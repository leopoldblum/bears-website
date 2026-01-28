## ImageGrid

Simple responsive grid that displays slotted images in their native aspect ratios without cropping. Single column on mobile, configurable columns on large screens (≥1024px).

### Props
```typescript
interface Props {
  cols?: 1 | 2 | 3 | 4; // columns on large screens (default: 2)
  gap?: 'sm' | 'md' | 'lg'; // gap between items (default: 'md')
  class?: string;       // optional extra classes
}
```

### Usage in MDX
```astro
import ImageGrid from '../components/reusable/ImageGrid.astro';
import Img from '../components/reusable/Img.astro';
import firstImage from '../assets/projects/example-1.jpg';
import secondImage from '../assets/projects/example-2.jpg';
import thirdImage from '../assets/projects/example-3.jpg';

<ImageGrid cols={3} gap="lg">
  <Img src={firstImage} alt="Wide landscape photo" />
  <Img src={secondImage} alt="Portrait photo" />
  <Img src={thirdImage} alt="Square image" />
</ImageGrid>
```

Images fill the column width and display at their natural height, preserving aspect ratios.
