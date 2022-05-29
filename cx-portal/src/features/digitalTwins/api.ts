import qs from 'querystring'
import { HttpClient } from 'utils/HttpClient'
import { FilterParams, ShellDescriptor, TwinList } from './types'
import { getSemanticApiBase } from 'services/EnvironmentService'
import { getHeaders } from 'services/RequestService'

export class Api extends HttpClient {
  private static classInstance?: Api

  public constructor() {
    super(`${getSemanticApiBase()}/twin-registry/registry/shell-descriptors`)
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new Api()
    }
    return this.classInstance
  }

  public getTwins = (filters: FilterParams) =>
    this.instance.get<TwinList>(`?${qs.stringify(filters)}`, getHeaders())

  public getTwinById = (id: string) =>
    this.instance.get<ShellDescriptor>(`/${id}`, getHeaders())
}