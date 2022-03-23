/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiMedialURL(path = "") {
  return `${process.env.NEXT_PUBLIC_URL}${path}`;
}
