import { getStrapiURL } from "lib/api";
import useSWRInfinite from "swr/infinite";
import qs from "qs";

function useSWRInfiniteHttp(url, urlParamsObject, options = {}) {
  const strapiUrl = getStrapiURL(url);

  function compileQueryString(index) {
    urlParamsObject.pagination.page = index;
    return qs.stringify(urlParamsObject);
  }

  const swr = useSWRInfinite(
    (index) =>
      url
        ? `${strapiUrl}?${
            urlParamsObject ? `?${compileQueryString(index + 1)}` : ""
          }`
        : null,
    options
  );
  return { ...swr };
}

export default useSWRInfiniteHttp;
