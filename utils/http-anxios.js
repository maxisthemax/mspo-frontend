import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";

const url = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: url,
});

const ISSERVER = typeof window === "undefined";
instance.interceptors.request.use(
  (req) => {
    req.headers["Content-Type"] = "application/json";

    const jwt = ISSERVER || reactLocalStorage.get("jwt");
    if (jwt) {
      req.headers["Authorization"] = `Bearer ${jwt}`;
    }

    return req;
  },
  (err) => err
);

export default instance;
