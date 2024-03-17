// ---
// Handy shortcuts

type Dict<V = unknown> = Record<string, V>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func<V = any> = (...args: any[]) => V;

type Values<T> = T[keyof T];

type Primitive = string | number | boolean;

// ---
// Utilities

/**
 * Require all optional props to be explicitly listed
 *
 * <pre>
 *  { a?: number } => { a: number | undefined }
 * </pre>
 */
type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined;
};

/**
 * Require at least one prop from object
 *
 * <pre>
 *  Either<{ a: 1, b: 2 }> => { a: 1, b?: 2 } | { a?: 1, b: 2 }
 * </pre>
 */
type Either<T extends Dict> = Values<{
  [K in keyof T]: Pick<Required<T>, K> & Partial<Omit<T, K>>;
}>;

/**
 * <pre>
 *  FilerKeys<{ a: 1, b: true }, number, 'pick'> => { a: 1 }
 *
 *  FilerKeys<{ a: 1, b: true }, number, 'omit'> => { b: true }
 * </pre>
 */
type FilterKeys<O, T, Mode extends "pick" | "omit" = "pick"> = Values<{
  [K in keyof O]: Mode extends "omit"
    ? O[K] extends T
      ? never
      : K
    : O[K] extends T
    ? K
    : never;
}>;

/**
 * Replace props from `T` with props from `R`
 * <pre>
 *  type Thing = { foo: string, bar: string }
 *  Replace<Thing, { bar: number }> => { foo: string, bar: number }
 *  // while with direct union we'll get `never`:
 *  Thing & { bar: number } => { foo: string, bar: never }
 * </pre>
 */
type Replace<T, R> = Omit<T, keyof R> & R;

/**
 * <pre>
 *  AlterProps<{ a: string, b: number }, null, 'b'> => { a: string, b: number | null }
 * </pre>
 */
type AlterProps<O, T, P extends keyof O = keyof O> = {
  [K in keyof O]: K extends P ? O[K] | T : O[K];
};

/**
 * Make listed props optional, preserving the rest.
 *
 * <pre>
 *   type Data = { a: number, b: string }
 *   PartialProps<Data, 'b'> => { a: number, b?: string }
 * </pre>
 */
type PartialProps<T, P extends keyof T> = Omit<T, P> & Partial<Pick<T, P>>;

/**
 * Make listed props non-nullable
 * <pre>
 *   type Data = { a?: number | undefined, b?: string }
 *   NonNullableProps<Data, 'a'> => { a?: number, b?: string }
 * </pre>
 */
type NonNullableProps<T, P extends keyof T = keyof T> = Omit<T, P> & {
  [K in P]: NonNullable<T[K]>;
};

/**
 * Make listed props required
 * <pre>
 *   type Data = { a?: number | undefined, b?: string }
 *   RequiredProps<Data, 'a'> => { a: number | undefined, b?: string }
 * </pre>
 */
type RequiredProps<T, P extends keyof T> = Omit<T, P> & Pick<Required<T>, P>;

/**
 * Make listed props BOTH required and non-nullable
 * <pre>
 *   type Data = { a?: number | undefined, b?: string }
 *   RequiredPropsStrict<Data, 'a'> => { a: number, b?: string }
 * </pre>
 */
type RequiredPropsStrict<T, P extends keyof T> = Omit<T, P> &
  NonNullableProps<RequiredProps<T, P>, P>;

/**
 * Omit function's return value: require same arguments, but always return void
 */
type AsCallback<T> = T extends (...args: infer PT) => unknown
  ? (...args: PT) => void
  : never;

/**
 * <pre>
 *   type AsyncFunc = () => Promise<number>
 *   ReturnType<AsyncFunc> => Promise<number>
 *   ReturnTypeAsync<AsyncFunc> => number
 * </pre>
 */
type ReturnTypeAsync<T extends Func<Promise<unknown>>> = T extends Func<
  Promise<infer RT>
>
  ? RT
  : never;
