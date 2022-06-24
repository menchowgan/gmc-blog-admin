import { instance, Axios } from './utils/instance'
import CONFIG_METHODS from "./utils/Config"

interface ConfigOptsModel {
  url?: string
  method?: string
  baseURL?: string
  transformRequest?: Array<Function>
  transformResponse?: Array<Function>
  headers?: object
  params?: object
  paramsSerializer?: Function
  data?: object
  timeout?: number
  withCredentials?: boolean
  adapter?: Function
  auth?: object
  responseType?: string
  responseEncoding?: string
  xsrfCookieName?: string
  xsrfHeaderName?: string
  onUploadProgress?: Function
  onDownloadProgress?: Function
  maxContentLength?: Function
  validateStatus?: Function
  maxRedirects?: number
  socketPath?: object
  httpAgent?: any
  httpsAgent?: any
  proxy?: object
  cancelToken?: object
}

function request(requestName: string, configOpts?: ConfigOptsModel): any
function request(requestName: string, params?: any, configOpts?: ConfigOptsModel): any
function request(requestName: string, params?: any, conf?: any): any{
  const config = CONFIG_METHODS[requestName]
  let request
  if (config) {
    let parameter = params
    switch (config.method) {
      case "get":
        if (typeof params === 'string' || typeof params === 'number') {
          request = instance.get(`${config.url}/${params}`)
        } else {
          if (conf && conf.params) {
            parameter = conf.params
          }
          request = instance.get(config.url, { params: parameter })
        }
        break;
      case "post":
        if (params && params.params) {
          parameter = params.params
        }
        request = instance.post(config.url, parameter)
        break;
      case "delete":
        let data = {}
        console.log(" params is ConfigOptsModel", params as ConfigOptsModel);
        
        if (params && params.data) {
          parameter = params.data
        }
        data = parameter
        request = instance.delete(config.url, {data})
        break;
    }
    return request
  }
}

export {
  request,
  Axios
}