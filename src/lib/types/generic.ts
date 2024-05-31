export type Freeze<T> = T extends Function ? T : T extends object ? { readonly [K in keyof T]: Freeze<T[K]> } : T;

export type Nullable<T> = T | null | undefined;
