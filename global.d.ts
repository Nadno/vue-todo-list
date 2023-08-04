declare global {
  type OverridableUnion<T, B extends string | number = string> =
    | T
    | (B & Record<never, never>);
}

export {};
