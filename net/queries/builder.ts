import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  mergeConfig,
  Method,
} from "axios";

abstract class HookBuilder<Params, Result = AxiosResponse> {
  _axios: AxiosInstance;

  _config: AxiosRequestConfig = {};
  _method: Method = "GET";
  _url: string = "";
  _requestTransform?: (req: Params) => any;
  _responseTransform?: (res: AxiosResponse) => Result;
  _postProcess?: (result: Result) => void;

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

  responseTransform(transformFn: (res: AxiosResponse) => Result) {
    this._responseTransform = transformFn;
    return this;
  }

  postProcess(postProcessFn: (result: Result) => void) {
    this._postProcess = postProcessFn;
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

          const response = await this._axios.request({
            method: this._method,
            url: this._url,
            data,
          });

          const result = this._responseTransform
            ? this._responseTransform(response)
            : response.data;

          if (this._postProcess) {
            this._postProcess(result);
          }

          return result;
        },
      });
    };
  }
}

export class QueryBuilder<
  Params = unknown,
  Result = unknown
> extends HookBuilder<Params, Result> {
  build() {
    return (params: Params) => {
      return useQuery<Result, Error, Result>({
        queryKey: [`${this._method} ${this._url}`, params],

        queryFn: async () => {
          const data = this._requestTransform
            ? this._requestTransform(params)
            : params;
          const response = await this._axios.request({
            method: this._method,
            url: this._url,
            data,
          });
          const result = this._responseTransform
            ? this._responseTransform(response)
            : (response.data as Result);

          return result;
        },
      });
    };
  }
}
