import fetch = require('node-fetch');
import {ServerError, StatusCode} from '../types';

type RequestOptions = Omit<fetch.RequestInit, 'method' | 'body'>;
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function mergeOptions<T>(
  {method, data}: {method: Method; data?: T},
  source?: RequestOptions
) {
  const body = data ? JSON.stringify(data) : undefined;
  return source ? {...source, method, body} : {method, body};
}

function parseResponse<T>(response: fetch.Response) {
  console.log(response);
  if (response.ok) return response.json() as Promise<T>;
  throw new ServerError(response.status as StatusCode, response.statusText);
}

export const api = {
  async get<R>(url: string, options?: RequestOptions) {
    const opts = mergeOptions({method: 'GET'}, options);

    const response = await fetch(url, opts);
    return parseResponse<R>(response);
  },

  async post<R>(url: string, data: unknown, options?: RequestOptions) {
    const opts = mergeOptions({method: 'POST', data}, options);

    const response = await fetch(url, opts);
    return parseResponse<R>(response);
  },

  async put<R>(url: string, data: unknown, options?: RequestOptions) {
    const opts = mergeOptions({method: 'PUT', data}, options);

    const response = await fetch(url, opts);
    return parseResponse<R>(response);
  },

  async patch<R>(url: string, data: unknown, options?: RequestOptions) {
    const opts = mergeOptions({method: 'PATCH', data}, options);

    const response = await fetch(url, opts);
    return parseResponse<R>(response);
  },

  async delete<R>(url: string, options?: RequestOptions) {
    const opts = mergeOptions({method: 'DELETE'}, options);

    const response = await fetch(url, opts);
    return parseResponse<R>(response);
  },
};
