export interface PageParams<T> {
  params: Promise<T>
}

export interface ParamsWithId {
  params: Promise<{
    id: string
  }>
}

export type SearchParams = { [key: string]: string | string[] | number | undefined }

export interface ParamsWithQuery {
  searchParams: Promise<SearchParams>
}

export type QueryParams = {
  search?: string
  page?: number
  limit?: number
  companyId?: string
}

export type ActionResultState<T = any> = {
  success?: boolean
  message?: string
  errors?: string[]
  data?: T
}

export interface SessionData {
  userId: string;
  email?: string;
  role?: string;
  [key: string]: any;
}
