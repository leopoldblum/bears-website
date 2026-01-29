# Img Component - Simple Image Optimization

## Usage
Provide an image source and the component handles optimization, error handling, and accessibility automatically.

```mdx
import { Img } from '../components/reusable/Img';
import myImage from '../../assets/my-photo.jpg';

<Img src={myImage} alt="A descriptive alt text" />
<Img src="https://example.com/image.jpg" alt="External image" class="rounded-lg" />
```

## What It Does For You

### ✅ **Automatic Optimization**
- **Local images**: Full optimization pipeline with metadata support
- **External images**: Applied best practices  
- **Responsive defaults**: `h-auto object-cover` for flexible sizing

### ✅ **Smart Features**
- **Error handling**: Shows clean placeholder instead of broken images
- **Accessibility**: Auto-generates alt text from filename if missing
- **Click to enlarge**: Images open in a modal for full-size viewing (can be disabled)

### ✅ **Developer Experience**
- **Type safety**: Works with string URLs and ImageMetadata imports
- **Zero config**: No setup required
- **Flexible sizing**: Width prop with automatic height calculation

## Props (All Optional Except src)

| Prop | Type | Default | Description |
|-------|--------|----------|-------------|
| src | `string \| ImageMetadata` | **Required** | Image URL or imported image metadata |
| alt | `string` | Auto-generated | Accessibility text from filename |
| class | `string` | `h-auto object-cover` | Tailwind classes |
| width | `number \| string` | `undefined` | Width in px (number) or CSS value (string) |
| loading | `'eager' \| 'lazy'` | `'lazy'` | Loading strategy |
| enableClickToEnlarge | `boolean` | `true` | Enable click-to-enlarge modal |

## Examples

### Basic Usage
```mdx
<Img src={heroImage} />
<Img src="https://site.com/image.jpg" alt="Custom alt" class="rounded-xl" />
```

### With Custom Styling
```mdx
<Img 
  src={profileImage} 
  class="w-32 h-32 rounded-full object-cover border-4 border-white" 
/>
```

### With Width Control
```mdx
<Img 
  src={bannerImage} 
  width={800}  // Sets width to 800px, height auto
/>

<Img 
  src={flexibleImage} 
  width="100%"  // CSS width value
/>
```

### Above-the-fold Images
```mdx
<Img 
  src={heroBackground} 
  loading="eager"  // Immediate loading for important images
/>
```

### Disable Click-to-Enlarge
```mdx
<Img 
  src={thumbnailImage} 
  enableClickToEnlarge={false}  // No modal on click
/>
```

## Technical Details

### Error Handling
When an image fails to load, the component:
1. Hides the broken `<img>` element
2. Shows a styled fallback placeholder with "Image not available" text
3. Uses dark/light theme appropriate styling

### Width Prop Behavior
- **Number**: Treated as pixels (e.g., `width={400}` → `width: 400px`)
- **String**: Used directly as CSS value (e.g., `width="50%"`)
- **Automatic height**: Always sets `height: auto` when width is provided
- **No width**: Uses natural image dimensions with `h-auto` class

### Alt Text Generation
When `alt` prop is omitted:
- Extracts filename from path: `"/path/to/image.jpg"` → `"image"`
- Removes file extension and directory components
- Works for both local and external URLs
```