import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  mergeConfig,
} from "axios";

/**
 * Represents parameters for API requests, including query and body parameters.
 */
interface RequestParams<Query = unknown, Body = unknown> {
  queryParams?: Query;
  bodyParams?: Body;
}

abstract class HookBuilder<Params extends RequestParams, Result = unknown> {
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
  Query = unknown,
  Body = unknown,
  Result = unknown
> extends HookBuilder<RequestParams<Query, Body>, Result> {
  build() {
    return () => {
      return useMutation<Result, Error, RequestParams<Query, Body>>({
        mutationFn: async ({ queryParams, bodyParams }) => {
          const data = this._requestTransform
            ? this._requestTransform({ queryParams, bodyParams })
            : bodyParams;

          const response = await this._axios.request({
            method: this._method,
            url: this._url,
            params: queryParams,
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
  Query = unknown,
  Body = unknown,
  Result = unknown
> extends HookBuilder<RequestParams<Query, Body>, Result> {
  build() {
    return (params: RequestParams<Query, Body>) => {
      return useQuery<Result, Error>({
        queryKey: [`${this._method} ${this._url}`, params],
        queryFn: async () => {
          const requestData = this._requestTransform
            ? this._requestTransform(params)
            : params.bodyParams;

          const response = await this._axios.request({
            method: this._method,
            url: this._url,
            params: params.queryParams,
            data: requestData,
          });;

          return this._responseTransform
            ? this._responseTransform(response)
            : (response.data as Result);
        },
      });
    };
  }
}

export class InfiniteQueryBuilder<
  Query = unknown,
  Body = unknown,
  Result = unknown
> extends HookBuilder<RequestParams<Query, Body>, Result> {
  private _getNextPageParam!: (lastPage: Result, allPages: Result[]) => any;

  getNextPageParam(fn: (lastPage: Result, allPages: Result[]) => any) {
    this._getNextPageParam = fn;
    return this;
  }

  build() {
    return (params: RequestParams<Query, Body>) => {
      return useInfiniteQuery<Result, Error>({
        queryKey: [`${this._method} ${this._url}`, params],
        queryFn: async ({ pageParam }) => {
          const requestData = this._requestTransform
            ? this._requestTransform(params)
            : { ...params.bodyParams };

          const response = await this._axios.request({
            method: this._method,
            url: this._url,
            params: { ...params.queryParams, page: pageParam },
            data: requestData,
          });

          return this._responseTransform
            ? this._responseTransform(response)
            : (response.data as Result);
        },
        initialPageParam: 1,
        getNextPageParam: this._getNextPageParam,
      });
    };
  }
}
