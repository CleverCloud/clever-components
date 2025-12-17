type StringOrNumberKeys<T> = {
  [K in keyof T]: T[K] extends string | number ? K : never;
}[keyof T];

export type sortByProps = <T>(properties: Array<[StringOrNumberKeys<T>, 'asc' | 'desc']>) => (a: T, b: T) => number;
