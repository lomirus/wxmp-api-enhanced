/**
 * `defineComponent()` 与 `defineBehavior()` 的参数公共字段。
 *
 * 在将自定义实例属性挂载到 this 的过程中，需要对以下字段进行过滤。
 * 该常量应与项目内 `miniprogram-api-typings` 包保持同步更新。可通过：
 * ```typescript
 * type A = Expand<keyof WechatMiniprogram.Component.Options<any, any, any, any>>;
 * ```
 * 获取最新的字段列表，从而及时更新。
 */
export const COMMON_OPTIONS_KEYS = [
  "properties",
  "data",
  "methods",
  "behaviors",
  "observers",
  "relations",
  "externalClasses",
  "pageLifetimes",
  "definitionFilter",
  "export",
  // 以下 7 个为 Lifetimes 中的字段
  "lifetimes",
  "created",
  "attached",
  "ready",
  "moved",
  "detached",
  "error",
] as const;
