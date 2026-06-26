import os
from PIL import Image, ImageDraw, ImageFont
import math

def generate_sequence(folder_name, num_frames=60, width=1920, height=1080, bg_color=(20, 20, 30), fg_color=(255, 200, 1)):
    # Create the directory if it doesn't exist
    os.makedirs(folder_name, exist_ok=True)
    
    # Pre-calculate center
    cx, cy = width // 2, height // 2
    
    for i in range(1, num_frames + 1):
        # Progress from 0 to 1
        t = (i - 1) / (num_frames - 1)
        
        # Create a new image with background color
        img = Image.new('RGB', (width, height), color=bg_color)
        draw = ImageDraw.Draw(img)
        
        # We'll draw some abstract shapes that morph smoothly based on t
        
        # Example 1: A rotating, scaling rectangle/circle
        scale = 1.0 + 2.0 * math.sin(t * math.pi) # scale goes from 1.0 -> 3.0 -> 1.0
        angle = t * 2 * math.pi # 1 full rotation
        
        # Draw some grid lines or something so movement is clear
        grid_size = 100
        for x in range(0, width, grid_size):
            draw.line([(x, 0), (x, height)], fill=(40, 40, 50), width=2)
        for y in range(0, height, grid_size):
            draw.line([(0, y), (width, y)], fill=(40, 40, 50), width=2)
            
        # Draw the main morphing shape in the center
        # We'll draw a polygon that rotates
        points = []
        num_points = 5
        base_radius = 200 * scale
        for p in range(num_points):
            p_angle = angle + (p / num_points) * 2 * math.pi
            px = cx + base_radius * math.cos(p_angle)
            py = cy + base_radius * math.sin(p_angle)
            points.append((px, py))
            
        draw.polygon(points, outline=fg_color, width=10)
        
        # Add frame number text
        draw.text((50, 50), f"Frame {i:04d} / {num_frames}", fill=(255, 255, 255), font_size=80)
        
        # Save as webp
        filename = f"frame_{i:04d}.webp"
        filepath = os.path.join(folder_name, filename)
        
        img.save(filepath, "WEBP", quality=80)
        print(f"Generated {filepath}")

if __name__ == "__main__":
    public_dir = os.path.join(os.path.dirname(__file__), "..", "public")
    
    hero_dir = os.path.join(public_dir, "hero-sequence")
    feature_dir = os.path.join(public_dir, "feature-sequence")
    
    print("Generating Hero Sequence frames...")
    generate_sequence(hero_dir, num_frames=60, bg_color=(10, 20, 30), fg_color=(0, 255, 150))
    
    print("Generating Feature Sequence frames...")
    # Feature sequence might be shorter, say 45 frames, and different colors
    generate_sequence(feature_dir, num_frames=45, bg_color=(30, 20, 10), fg_color=(255, 100, 50))
    
    print("All frames generated successfully.")
