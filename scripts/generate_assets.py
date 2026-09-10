import os
import re
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.path import Path
import matplotlib.patches as patches
from PIL import Image, ImageDraw, ImageFilter

def parse_svg_path(d_str):
    tokens = re.findall(r'[A-Za-z]|[-+]?(?:\d*\.\d+|\d+)', d_str)
    verts = []
    codes = []
    i = 0
    while i < len(tokens):
        cmd = tokens[i]
        if cmd == 'M':
            x = float(tokens[i+1])
            y = 100.0 - float(tokens[i+2])
            verts.append((x, y))
            codes.append(Path.MOVETO)
            i += 3
        elif cmd == 'C':
            x1, y1 = float(tokens[i+1]), 100.0 - float(tokens[i+2])
            x2, y2 = float(tokens[i+3]), 100.0 - float(tokens[i+4])
            x3, y3 = float(tokens[i+5]), 100.0 - float(tokens[i+6])
            verts.extend([(x1, y1), (x2, y2), (x3, y3)])
            codes.extend([Path.CURVE4, Path.CURVE4, Path.CURVE4])
            i += 7
        elif cmd == 'Z':
            verts.append((0, 0))
            codes.append(Path.CLOSEPOLY)
            i += 1
        else:
            i += 1
    return Path(verts, codes)

left_horn_d = "M 50 76 C 45 52 38 34 32 24 C 24 12 8 20 8 36 C 8 50 20 60 30 52 C 34 49 34 43 30 43 C 24 43 17 38 18 32 C 19 24 28 20 33 28 C 38 36 43 54 48 76 Z"
right_horn_d = "M 50 76 C 55 52 62 34 68 24 C 76 12 92 20 92 36 C 92 50 80 60 70 52 C 66 49 66 43 70 43 C 76 43 83 38 82 32 C 81 24 72 20 67 28 C 62 36 57 54 52 76 Z"
center_crown_d = "M 45 36 C 45 36 47 48 50 56 C 53 48 55 36 55 36 Z"

path_left = parse_svg_path(left_horn_d)
path_right = parse_svg_path(right_horn_d)
path_center = parse_svg_path(center_crown_d)

def render_mark(
    size=1024,
    mark_scale=0.62,
    mark_color='#FFFFFF',
    dot_color='#F59E0B',
    bg_type='gradient', # 'gradient', 'transparent', 'solid'
    bg_color='#0F4C3A',
    output_path='icon.png'
):
    dpi = 100
    fig_size = size / dpi
    fig = plt.figure(figsize=(fig_size, fig_size), dpi=dpi)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    if bg_type == 'transparent':
        fig.patch.set_alpha(0.0)
        ax.patch.set_alpha(0.0)
    elif bg_type == 'solid':
        fig.patch.set_facecolor(bg_color)
        ax.patch.set_facecolor(bg_color)
    elif bg_type == 'gradient':
        # Create subtle smooth radial background gradient
        x = np.linspace(-1, 1, size)
        y = np.linspace(-1, 1, size)
        X, Y = np.meshgrid(x, y)
        R = np.sqrt((X + 0.15)**2 + (Y + 0.15)**2)
        
        # Color from #14614A (top-left lighter forest green) to #0A3225 (deep border)
        c1 = np.array([20, 97, 74]) / 255.0   # #14614A
        c2 = np.array([10, 50, 37]) / 255.0   # #0A3225
        
        t = np.clip(R / 1.3, 0, 1)[:, :, None]
        bg_img = (1 - t) * c1 + t * c2
        ax.imshow(bg_img, extent=[0, 100, 0, 100], origin='lower')

    # Transform paths to scale and center
    # Original SVG viewBox is 0 to 100, centered around (50, 50)
    # The mark extends roughly from x: 8 to 92 (width 84), y: 20 to 80 (height 60)
    # Centered around (50, 50) in inverted coords
    # Scale from center (50, 50):
    # (x - 50) * mark_scale + 50
    # (y - 50) * mark_scale + 50
    
    def transform_path(p):
        verts = p.vertices.copy()
        verts[:, 0] = (verts[:, 0] - 50.0) * mark_scale + 50.0
        verts[:, 1] = (verts[:, 1] - 50.0) * mark_scale + 50.0
        return Path(verts, p.codes)

    t_left = transform_path(path_left)
    t_right = transform_path(path_right)
    t_center = transform_path(path_center)

    patch_left = patches.PathPatch(t_left, facecolor=mark_color, edgecolor='none', antialiased=True)
    patch_right = patches.PathPatch(t_right, facecolor=mark_color, edgecolor='none', antialiased=True)
    patch_center = patches.PathPatch(t_center, facecolor=mark_color, edgecolor='none', antialiased=True)

    ax.add_patch(patch_left)
    ax.add_patch(patch_right)
    ax.add_patch(patch_center)

    # Dot position: cx=50, cy=62 in SVG coords -> y=38 in matplotlib
    dot_y_svg = 62.0
    dot_y_mpl = 100.0 - dot_y_svg
    dot_x = (50.0 - 50.0) * mark_scale + 50.0
    dot_y = (dot_y_mpl - 50.0) * mark_scale + 50.0
    dot_r = 3.2 * mark_scale

    if dot_color:
        circle = patches.Circle((dot_x, dot_y), radius=dot_r, facecolor=dot_color, edgecolor='none', antialiased=True)
        ax.add_patch(circle)

    plt.savefig(
        output_path,
        dpi=dpi,
        transparent=(bg_type == 'transparent'),
        bbox_inches='tight',
        pad_inches=0
    )
    plt.close(fig)

    # Ensure exact dimensions
    with Image.open(output_path) as im:
        if im.size != (size, size):
            im_resized = im.resize((size, size), Image.Resampling.LANCZOS)
            im_resized.save(output_path)

output_dir = 'assets/images'

# 1. Main Icon (1024x1024): Gradient background, crisp white mark + gold dot
print("Generating icon.png...")
render_mark(
    size=1024,
    mark_scale=0.72,
    mark_color='#FFFFFF',
    dot_color='#F59E0B',
    bg_type='gradient',
    output_path=os.path.join(output_dir, 'icon.png')
)

# 2. Android Adaptive Icon Foreground (1024x1024): Transparent, safe zone scale (0.50)
print("Generating android-icon-foreground.png...")
render_mark(
    size=1024,
    mark_scale=0.52,
    mark_color='#FFFFFF',
    dot_color='#F59E0B',
    bg_type='transparent',
    output_path=os.path.join(output_dir, 'android-icon-foreground.png')
)

# 3. Android Adaptive Icon Background (1024x1024): Solid #0F4C3A with gradient
print("Generating android-icon-background.png...")
render_mark(
    size=1024,
    mark_scale=0.0, # no mark, just background
    mark_color='#0F4C3A',
    dot_color=None,
    bg_type='gradient',
    output_path=os.path.join(output_dir, 'android-icon-background.png')
)

# 4. Android Monochrome Icon (1024x1024): Transparent, pure white mark
print("Generating android-icon-monochrome.png...")
render_mark(
    size=1024,
    mark_scale=0.52,
    mark_color='#FFFFFF',
    dot_color='#FFFFFF',
    bg_type='transparent',
    output_path=os.path.join(output_dir, 'android-icon-monochrome.png')
)

# 5. Splash Icon (1024x1024): Transparent, prominent mark in crisp white + gold dot
print("Generating splash-icon.png...")
render_mark(
    size=1024,
    mark_scale=0.68,
    mark_color='#FFFFFF',
    dot_color='#F59E0B',
    bg_type='transparent',
    output_path=os.path.join(output_dir, 'splash-icon.png')
)

# 6. Favicon (48x48): Scaled down from icon
print("Generating favicon.png...")
with Image.open(os.path.join(output_dir, 'icon.png')) as im:
    fav = im.resize((48, 48), Image.Resampling.LANCZOS)
    fav.save(os.path.join(output_dir, 'favicon.png'))

print("All brand assets generated successfully!")
