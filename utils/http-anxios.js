import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";

const url = {
  staging: process.env.NEXT_PUBLIC_API_URL,
};

const instance = axios.create({
  baseURL: url["staging"],
});

const ISSERVER = typeof window === "undefined";
instance.interceptors.request.use(
  (req) => {
    const accessToken = ISSERVER || reactLocalStorage.get("access_token");

    accessToken && (req.headers["Authorization"] = `Bearer ${accessToken}`);

    return req;
  },
  (err) => err
);

export default instance;
