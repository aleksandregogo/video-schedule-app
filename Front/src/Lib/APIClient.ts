import axios from "axios";
import { API_URL } from "./appConfig";

export const APIClient = (() => {
  let logoutFunction: () => void;

  const setLogoutFunction = (func: () => void) => {
    logoutFunction = func;
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
        if (url != "/auth/user" && logoutFunction) {
          logoutFunction();
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
    setLogoutFunction,
  };
})();
