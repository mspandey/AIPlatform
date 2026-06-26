export const preloadFrames = async (
  basePath: string,
  frameCount: number,
  onProgress?: (progress: number) => void
): Promise<HTMLImageElement[]> => {
  const frames: HTMLImageElement[] = [];
  let loadedCount = 0;

  // Generate paths
  const framePaths = Array.from({ length: frameCount }, (_, i) => {
    // e.g. "frame_0001.webp"
    const indexStr = (i + 1).toString().padStart(4, '0');
    return `${basePath}/frame_${indexStr}.webp`;
  });

  // Preload frame 1 immediately and resolve it
  const firstFrame = new Image();
  firstFrame.src = framePaths[0];
  await new Promise((resolve) => {
    firstFrame.onload = resolve;
    firstFrame.onerror = resolve; // Continue even if it errors
  });
  frames.push(firstFrame);
  loadedCount++;
  if (onProgress) onProgress(loadedCount / frameCount);

  // Preload the rest asynchronously using Promise.all so they download concurrently
  // but we wait for them to finish decoding before marking fully loaded
  const promises = framePaths.slice(1).map((path) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        loadedCount++;
        if (onProgress) onProgress(loadedCount / frameCount);
        resolve(img);
      };
      img.onerror = () => {
        // Resolve with the image anyway so promise.all doesn't fail the whole batch
        // We'll just handle drawing errors gracefully
        loadedCount++;
        if (onProgress) onProgress(loadedCount / frameCount);
        resolve(img);
      };
    });
  });

  const remainingFrames = await Promise.all(promises);
  frames.push(...remainingFrames);

  return frames;
};
