/* eslint-disable import/prefer-default-export */

export const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9-'()]+/g, '-');
