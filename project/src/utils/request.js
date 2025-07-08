import axios from "axios";

export function request(config) {
  const instance = axios.create({
    baseURL: "/api",
    timeout: 10000,
  });

  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (err) => {
      console.log(err);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      if (typeof res.data === "string") {
        return {
          code: res.status,
          msg: res.data,
          data: null,
        };
      }
      return res.data;
    },
    (err) => {
      if (err.response) {
        const { status, data } = err.response;
        return Promise.reject({
          code: status,
          msg: typeof data === 'string' ? data : err.message || '请求失败',
          data: null,
        });
      }
      return Promise.reject(err);
    }
  );

  return instance(config);
}
