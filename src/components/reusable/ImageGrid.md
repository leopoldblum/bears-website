## ImageGrid

Responsive grid that displays slotted images while keeping their native aspect ratios. Items are squared for balanced sizing between landscape and portrait images, with card-like styling and accent hover outlines. Mobile: 1 column; small screens: 2 columns (when cols ≥ 2); large screens: `cols` columns. Intended for MDX usage with minimal props.

### Props
```typescript
interface Props {
  cols?: 1 | 2 | 3 | 4; // columns at ≥1024px (default 3); auto 1 col mobile, 2 col small
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

<ImageGrid cols={2}>
  <Img src={firstImage} alt="Project image one" />
  <Img src={secondImage} alt="Project image two" />
  <Img src={thirdImage} alt="Project image three" />
</ImageGrid>
```

Images automatically scale to the column width and retain their original proportions.
