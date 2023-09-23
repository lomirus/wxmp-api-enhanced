/** 将 `A | B | C` 格式的类型转换为 `A & B & C` */
export type UnionToIntersection<T> =
  (T extends unknown ? (x: T) => unknown : never) extends
  (x: infer R) => unknown ? R : never;

/** 对对象执行展开或合并等操作，以简化 IDE 所显示类型以方便 debug */
export type Expand<T> = T extends (...args: unknown[]) => unknown ? T
  : T extends object ? { [K in keyof T]: Expand<T[K]> }
  : T;
