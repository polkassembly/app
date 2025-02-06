import { useQuery, useMutation, useInfiniteQuery, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  mergeConfig,
} from "axios";

interface RequestParams<PathParams = unknown, QueryParams = unknown, BodyParams = unknown> {
  pathParams?: PathParams;
  queryParams?: QueryParams;
  bodyParams?: BodyParams;
}

abstract class HookBuilder<PathParams, QueryParams, BodyParams, Result> {
  protected _axios: AxiosInstance;
  protected _config: AxiosRequestConfig = {};
  protected _method: Method = "GET";
  protected _url: string = "";
  protected _requestTransform?: (req: RequestParams<PathParams, QueryParams, BodyParams>) => RequestParams<PathParams, QueryParams, BodyParams>;
  protected _responseTransform?: (res: AxiosResponse) => Result;
  protected _postProcess?: (result: Result) => void;

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

  requestTransform(transformFn: (params: RequestParams<PathParams, QueryParams, BodyParams>) => RequestParams<PathParams, QueryParams, BodyParams>) {
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

  protected resolveUrl(pathParams?: PathParams): string {
    if (!pathParams) return this._url;
    let resolvedUrl = this._url;
    Object.entries(pathParams as Record<string, string>).forEach(([key, value]) => {
      resolvedUrl = resolvedUrl.replace(`{${key}}`, value);
    });
    return resolvedUrl;
  }
}

export class MutationBuilder<PathParams = unknown, QueryParams = unknown, BodyParams = unknown, Result = unknown>
  extends HookBuilder<PathParams, QueryParams, BodyParams, Result> {
  build() {
    return () => {
      return useMutation<Result, Error, RequestParams<PathParams, QueryParams, BodyParams>>({
        mutationFn: async (params) => {
          const transformedParams = this._requestTransform ? this._requestTransform(params) : params;
          const resolvedUrl = this.resolveUrl(transformedParams.pathParams);
          const response = await this._axios.request({
            method: this._method,
            url: resolvedUrl,
            params: transformedParams.queryParams,
            data: transformedParams.bodyParams,
          });
          const result = this._responseTransform ? this._responseTransform(response) : response.data as Result;
          if (this._postProcess) this._postProcess(result);
          return result;
        },
      });
    };
  }
}

export class QueryBuilder<PathParams = unknown, QueryParams = unknown, BodyParams = unknown, Result = unknown>
  extends HookBuilder<PathParams, QueryParams, BodyParams, Result> {
  build() {
    return (
      params: RequestParams<PathParams, QueryParams, BodyParams>,
      queryOptions?: Omit<UseQueryOptions<Result, Error>, "queryKey">
    ) => {
      const transformedParams = this._requestTransform ? this._requestTransform(params) : params;
      const resolvedUrl = this.resolveUrl(transformedParams.pathParams);

      return useQuery<Result, Error>({
        queryKey: [`${this._method} ${resolvedUrl}`, JSON.stringify(transformedParams)],
        queryFn: async () => {
          const response = await this._axios.request({
            method: this._method,
            url: resolvedUrl,
            params: transformedParams.queryParams,
            data: transformedParams.bodyParams,
          });
          return this._responseTransform ? this._responseTransform(response) : (response.data as Result);
        },
        ...queryOptions,
      });
    };
  }
}

export class InfiniteQueryBuilder<PathParams = unknown, QueryParams = unknown, BodyParams = unknown, Result = unknown>
  extends HookBuilder<PathParams, QueryParams, BodyParams, Result> {
  private _getNextPageParam: (lastPage: Result, allPages: Result[]) => any = () => null;

  getNextPageParam(fn: (lastPage: Result, allPages: Result[]) => any) {
    this._getNextPageParam = fn;
    return this;
  }

  build() {
    return (
      params: RequestParams<PathParams, QueryParams, BodyParams>,
    ) => {
      const transformedParams = this._requestTransform ? this._requestTransform(params) : params;
      const resolvedUrl = this.resolveUrl(transformedParams.pathParams);

      return useInfiniteQuery<Result, Error>({
        queryKey: [`${this._method} ${resolvedUrl}`, JSON.stringify(transformedParams)],
        queryFn: async ({ pageParam }) => {
          const response = await this._axios.request({
            method: this._method,
            url: resolvedUrl,
            params: { ...transformedParams.queryParams, page: pageParam },
            data: transformedParams.bodyParams,
          });
          return this._responseTransform ? this._responseTransform(response) : (response.data as Result);
        },
        initialPageParam: 1,
        getNextPageParam: this._getNextPageParam,
      });
    };
  }
}