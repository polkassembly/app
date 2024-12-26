import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosInstance, AxiosRequestConfig, mergeConfig, Method } from "axios";

abstract class HookBuilder<Params, Result> {
  _axios: AxiosInstance;

  _config: AxiosRequestConfig = {};
  _method: Method = "GET";
  _url: string = "";
  _requestTransform?: (req: Params) => any;

  constructor(axios: AxiosInstance) {
    this._axios = axios;
  }

  config(config: AxiosRequestConfig) {
    this._config = mergeConfig(this._config, config);
    return this;
  }

  method(method: Method) {
    this._method = method;
    return this;
  }

  requestTransform(transformFn: (params: Params) => unknown) {
    this._requestTransform = transformFn;
    return this;
  }

  url(url: string) {
    this._url = url;
    return this;
  }
}

export class MutationBuilder<
  Params = unknown,
  Result = unknown
> extends HookBuilder<Params, Result> {
  build() {
    return () => {
      return useMutation<Result, Error, Params>({
        mutationFn: async (params) => {
          const data = this._requestTransform
            ? this._requestTransform(params)
            : params;

          return await this._axios.request({
            method: this._method,
            url: this._url,
            data,
          });
        },
      });
    };
  }
}
