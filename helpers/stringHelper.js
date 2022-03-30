export function getUrlExt(url) {
  return url.split(/[#?]/)[0].split(".").pop().trim();
}
