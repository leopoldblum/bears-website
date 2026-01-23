/**
 * Maps kebab-case category values to human-readable labels
 */
export const categoryLabels: Record<string, string> = {
  // Event categories
  'trade-fairs-and-conventions': 'Trade Fairs & Conventions',
  'competitions-and-workshops': 'Competitions & Workshops',
  'kick-off-events': 'Kick-off Events',

  // Project categories
  'experimental-rocketry': 'Experimental Rocketry',
  'science-and-experiments': 'Science & Experiments',
  'robotics': 'Robotics',

  // Shared
  'other': 'Other',
};

/**
 * Get human-readable label for a category value.
 * Falls back to title-cased kebab-case if not found in the map.
 */
export function getCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
