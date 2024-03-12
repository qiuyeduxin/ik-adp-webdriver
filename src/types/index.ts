export interface IResponse<T = unknown> {
  dm_error: number
  data?: T
  error_msg: string
}

export type IObject<K extends string | number | symbol, T> = Record<K, T>

export type IStrNumBoo = string | number | boolean

export type Fun = (...args: any[]) => any
