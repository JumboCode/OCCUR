/* eslint-disable import/prefer-default-export */

export const slugify = (str, maxSegments = Infinity) => str
  .toLowerCase()
  .replace(/[^a-z0-9-'()]+/g, '-')
  .split('-')
  .slice(0, maxSegments)
  .join('-');
