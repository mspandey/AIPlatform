const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const width = 1920;
const height = 1080;
const frames = 90;

const outDir = path.join(__dirname, '../public/sequence');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate a structured neural network (spherical with tendrils)
const numNodes = 400;
const nodes = [];

// Create a core structure
for (let i = 0; i < numNodes; i++) {
  // Use spherical coordinates for a more organic shape
  const phi = Math.acos(-1 + (2 * i) / numNodes);
  const theta = Math.sqrt(numNodes * Math.PI) * phi;
  
  // Mix between a tight core and radiating tendrils
  const r = 200 + (Math.random() * 800) * (Math.random() > 0.8 ? 2 : 1);
  
  nodes.push({
    x: r * Math.cos(theta) * Math.sin(phi),
    y: r * Math.sin(theta) * Math.sin(phi),
    z: r * Math.cos(phi),
    color: Math.random() > 0.6 ? '#eab308' : '#38bdf8', // Tailwind yellow-500 and sky-400
    size: Math.random() * 3 + 1.5,
    phase: Math.random() * Math.PI * 2,
    baseR: r
  });
}

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

function project(x, y, z, fov, cameraZ) {
  const scale = fov / (fov + z + cameraZ);
  return {
    x: x * scale + width / 2,
    y: y * scale + height / 2,
    scale
  };
}

// Cubic ease in out
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

for (let frame = 0; frame < frames; frame++) {
  const progress = frame / (frames - 1);
  const eased = easeInOutCubic(progress);
  
  // Deep dark background
  ctx.fillStyle = '#030712'; 
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = 'screen';
  
  // Camera dives into the core
  const cameraZ = 2500 - eased * 1800;
  
  // Rotation
  const angleY = eased * Math.PI * 0.5; // 90 degree rotation
  const angleX = eased * Math.PI * 0.2;

  const projectedNodes = [];

  for (let i = 0; i < numNodes; i++) {
    let node = nodes[i];
    
    // Nodes organically "breathe"
    const breath = Math.sin(node.phase + progress * Math.PI * 2) * 20;
    const rScale = (node.baseR + breath) / node.baseR;
    
    let nx = node.x * rScale;
    let ny = node.y * rScale;
    let nz = node.z * rScale;

    // Rotate Y
    let x1 = nx * Math.cos(angleY) - nz * Math.sin(angleY);
    let z1 = nz * Math.cos(angleY) + nx * Math.sin(angleY);

    // Rotate X
    let y2 = ny * Math.cos(angleX) - z1 * Math.sin(angleX);
    let z2 = z1 * Math.cos(angleX) + ny * Math.sin(angleX);

    // Filter nodes behind camera
    if (z2 + cameraZ < 50) continue; 

    const p = project(x1, y2, z2, 1200, cameraZ);
    p.node = node;
    p.z2 = z2;
    p.x1 = x1;
    p.y2 = y2;
    projectedNodes.push(p);
  }

  // Draw Connections
  ctx.lineWidth = 1;
  // O(N^2) line drawing but with N=400 it's fine for a static script
  for (let i = 0; i < projectedNodes.length; i++) {
    // Only connect to next ~40 to save time
    for (let j = i + 1; j < Math.min(i + 40, projectedNodes.length); j++) {
      const p1 = projectedNodes[i];
      const p2 = projectedNodes[j];
      const dx = p1.x1 - p2.x1;
      const dy = p1.y2 - p2.y2;
      const dz = p1.z2 - p2.z2;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

      const maxDist = 300;
      if (dist < maxDist) {
        // Opacity falls off with distance, and scales with perspective depth
        const distFade = Math.pow(1 - dist / maxDist, 2);
        // Depth fade: darker when further away
        const depthFade1 = Math.max(0, Math.min(1, 1 - (p1.z2 + cameraZ - 500) / 3000));
        const depthFade2 = Math.max(0, Math.min(1, 1 - (p2.z2 + cameraZ - 500) / 3000));
        
        const alpha = distFade * Math.min(depthFade1, depthFade2) * 0.8;
        
        if (alpha > 0.02) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          
          let c1 = p1.node.color === '#eab308' ? `rgba(234, 179, 8, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
          let c2 = p2.node.color === '#eab308' ? `rgba(234, 179, 8, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
          
          const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grad.addColorStop(0, c1);
          grad.addColorStop(1, c2);
          ctx.strokeStyle = grad;
          ctx.stroke();
        }
      }
    }
  }

  // Draw Nodes
  for (let p of projectedNodes) {
    const depthFade = Math.max(0, Math.min(1, 1 - (p.z2 + cameraZ - 500) / 3000));
    if (depthFade < 0.05) continue;

    const pulse = Math.sin(p.node.phase + progress * Math.PI * 4) * 0.5 + 0.5;
    // Base radius scales with perspective
    const radius = Math.max(0.5, p.node.size * p.scale * (0.8 + pulse * 0.4));
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    
    // Parse color to add alpha
    let r,g,b;
    if (p.node.color === '#eab308') { r=234; g=179; b=8; }
    else { r=56; g=189; b=248; }
    
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${depthFade})`;
    
    // Simulate glow
    ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
    ctx.shadowBlur = radius * 3;
    ctx.fill();
    
    // Hot center
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${depthFade * 0.9})`;
    ctx.shadowBlur = 0;
    ctx.fill();
  }

  // Quality 0.8 keeps file size manageable for 90 frames
  const frameNum = String(frame + 1).padStart(4, '0');
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
  fs.writeFileSync(path.join(outDir, `frame_${frameNum}.jpg`), buffer);
  
  if ((frame + 1) % 10 === 0) {
    console.log(`Generated frame ${frameNum}/${frames}`);
  }
}
console.log('Sequence generation complete.');
