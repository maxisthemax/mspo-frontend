import { getStrapiURL } from "lib/api";
import useSwr from "swr";
import qs from "qs";

function useSwrHttp(url, urlParamsObject, options = {}) {
  const strapiUrl = getStrapiURL(url);
  const queryString = qs.stringify(urlParamsObject);
  const swr = useSwr(
    url ? `${strapiUrl}${queryString ? `?${queryString}` : ""}` : null,
    options
  );
  return { ...swr };
}

export default useSwrHttp;
