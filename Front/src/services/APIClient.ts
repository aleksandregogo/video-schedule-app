import axios from "axios";
import { API_URL } from "../config/appConfig";

export const APIClient = (() => {
  let logoutCb: () => void;

  const setLogoutCb = (func: () => void) => {
    logoutCb = func;
  };

  const instance = axios.create({
    baseURL: API_URL as string,
    withCredentials: true,
  });

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (
        [400].includes(error.response?.status) &&
        error.response?.data?.message
      ) {
        const { message } = error.response.data;
        return Promise.reject(message);
      }
      if (!error.response || [401].includes(error.response?.status)) {
        const url = error.config?.url;
        if (url != "/auth/user" && logoutCb) {
          logoutCb();
        }
      } else {
        return Promise.reject(error);
      }
    }
  );

  return {
    post: instance.post,
    postForm: instance.postForm,
    putForm: instance.putForm,
    get: instance.get,
    put: instance.put,
    delete: instance.delete,
    setLogoutCb,
  };
})();
