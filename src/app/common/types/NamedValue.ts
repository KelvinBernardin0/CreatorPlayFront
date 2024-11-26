export type NamedValue<T> = {
  name: string,
  value: T
}

export type NamedValueWithImage<T> = NamedValue<T> & {
   hasImage: boolean
  }
