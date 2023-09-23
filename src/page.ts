import { COMMON_OPTIONS_KEYS } from "./utils";
import type { BehaviorType, ExpandBehaviors } from "./behavior";
import type { PropType, TypedProperties } from "./properties";
import type { AllProperty, Data, DataOption } from "./wx";
import { UnionToIntersection } from "./libs";

/** `definePage()` 的参数字段 */
const OPTIONS_KEYS = ["data", "options", "behaviors"] as const;

/** `defineBehavior()` 的参数字段 */
const BEHAVIOR_OPTIONS_KEYS = COMMON_OPTIONS_KEYS;

type ILifetime = WechatMiniprogram.Page.ILifetime;
type ComponentOptions = WechatMiniprogram.Component.ComponentOptions;

/**
 * 类型友好的 Page 的构造函数，用于替代原版接口中的 `Page()`
 * @see https://iwiki.woa.com/pages/viewpage.action?pageId=4008551342
 */
const definePage = <
  TData extends DataOption = {},
  TBehavior extends BehaviorType<unknown> = BehaviorType<never>,
  TAllOptions extends Record<string, unknown> = {},
>(
  options:
    & Partial<Data<TData>>
    & Partial<ILifetime>
    & Partial<{
      behaviors: TBehavior[];
      options: ComponentOptions;
    }>
    & TAllOptions
    & ThisType<
      & WechatMiniprogram.Page.Instance<
        TData,
        Omit<TAllOptions, (typeof OPTIONS_KEYS)[number]>
      >
      & (UnionToIntersection<
        ExpandBehaviors<
          Required<
            TBehavior extends BehaviorType<infer TOptions> ? TOptions : never
          >
        >
      > extends
        // 此处 `T` 用于作为上方 `UnionToIntersection<_>` 的 alias，用于简化类型判断，无其他作用
        infer T ? T extends Record<string, unknown> ?
        & Omit<T, (typeof BEHAVIOR_OPTIONS_KEYS)[number]>
        & (T extends { properties: infer U }
          ? U extends
          Record<
            string,
            | AllProperty
            | PropType<Array<unknown> | Record<string, unknown>>
          > ? { properties: TypedProperties<U> }
          : never
          : never)
        & (T extends { methods: infer U } ? U : never)
        & (T extends { data: infer U } ? { data: U } : never)
        : unknown
        : never)
    >,
): void => {
  const { behaviors, ...restOptions } = options;

  return Page({
    behaviors: behaviors?.map((behavior: TBehavior) => behavior.id),
    ...restOptions,
  });
};

export default definePage;
