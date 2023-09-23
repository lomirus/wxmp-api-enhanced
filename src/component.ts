import { COMMON_OPTIONS_KEYS } from "./utils";
import type { BehaviorType, ExpandBehaviors } from "./behavior";
import type { PropType, TypedProperties } from "./properties";
import type {
  AllProperty,
  Data,
  DataOption,
  Lifetimes,
  Method,
  MethodOption,
  OtherOption,
  Property,
} from "./wx";
import type { UnionToIntersection } from "./libs";

/** `defineComponent()` 的参数字段 */
const OPTIONS_KEYS = [
  ...COMMON_OPTIONS_KEYS,
  "options",
] as const;

/** 挂载到 this 上的 component 实例类型 */
export type Instance<
  TProperty extends Record<
    string,
    PropType<Array<unknown> | Record<string, unknown>> | AllProperty
  > = {},
  TData extends DataOption = {},
  TMethod extends MethodOption = {},
  TCustom extends Record<string, unknown> = {},
  TBehavior extends BehaviorType<unknown> = BehaviorType<never>,
> =
  & WechatMiniprogram.Behavior.Instance<TData, {}, TMethod, TCustom>
  & { properties: TypedProperties<TProperty> }
  & (UnionToIntersection<
    ExpandBehaviors<
      Required<
        TBehavior extends BehaviorType<infer TOptions> ? TOptions : never
      >
    >
  > extends
    // 此处 `T` 用于作为上方 `UnionToIntersection<_>` 的 alias，用于简化类型判断，无其他作用
    infer T ? T extends Record<string, unknown> ?
    & Omit<T, (typeof OPTIONS_KEYS)[number]>
    & (T extends { properties: infer U }
      ? U extends
      Record<
        string,
        AllProperty | PropType<Array<unknown> | Record<string, unknown>>
      > ? { properties: TypedProperties<U> }
      : never
      : never)
    & (T extends { methods: infer U } ? U : never)
    & (T extends { data: infer U } ? { data: U } : never)
    : unknown
    : never);

/**
 * 类型友好的 Component 的构造函数，用于替代原版接口中的 `Component()`
 * @see https://iwiki.woa.com/pages/viewpage.action?pageId=4008551342
 */
const defineComponent = <
  // 原始 API 定义存在问题，若对象无默认值，经实际运行测试为其初始值 null，但类型被标注为
  // undefined，导致类型不匹配，因此下方采用 any 绕过。
  TProperty extends Record<string, PropType<any> | AllProperty> = {},
  TData extends DataOption = {},
  TMethod extends MethodOption = {},
  TAllOptions extends Record<string, unknown> = {},
  TBehavior extends BehaviorType<unknown> = BehaviorType<never>,
>(
  options:
    & Partial<Property<TProperty>>
    & Partial<Data<TData>>
    & Partial<Method<TMethod>>
    & Partial<Lifetimes>
    & Partial<Omit<OtherOption, "behaviors">>
    & Partial<{ behaviors: TBehavior[] }>
    & TAllOptions
    & ThisType<
      Instance<
        TProperty,
        TData,
        TMethod,
        Omit<TAllOptions, (typeof OPTIONS_KEYS)[number]>,
        TBehavior
      >
    >,
): string => {
  const { behaviors, lifetimes, ...restOptions } = options;

  return Component<TData, TProperty, TMethod, TAllOptions>({
    behaviors: behaviors?.map((behavior: TBehavior) => behavior.id),
    // 由于 options 浅拷贝的原因，暂时禁用掉在 created 阶段自动初始化自定义实例参数的功能。
    lifetimes: lifetimes,
    // lifetimes: {
    //   ...lifetimes,
    //   created() {
    //     Object.entries(options)
    //       .filter(([key]) => !(OPTIONS_KEYS).includes(key as any))
    //       .forEach(([key, value]) => {
    //         (this as any)[key] = value;
    //       });
    //     options.lifetimes?.created?.apply(this);
    //   },
    // },
    ...restOptions,
  });
};

export default defineComponent;
