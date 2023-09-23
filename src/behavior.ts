import { COMMON_OPTIONS_KEYS } from "./utils";
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

/** `defineBehavior()` 的参数字段 */
const OPTIONS_KEYS = COMMON_OPTIONS_KEYS;

type DefinitionFilter = <
  T extends
  & WechatMiniprogram.Behavior.Options<{}, {}, {}>
  & WechatMiniprogram.Component.Options<{}, {}, {}>
  & WechatMiniprogram.Page.Options<{}, {}>
  & Record<string, unknown>,
>(
  /** 使用该 behavior 的 component/behavior 的定义对象 */
  defFields: T,
  /** 该 behavior 所使用的 behavior 的 definitionFilter 函数列表 */
  definitionFilterArr?: DefinitionFilter[],
) => void;

/** 递归展开嵌套 Behavior */
export type ExpandBehaviors<T> = T extends infer TOptions ?
  | Omit<TOptions, "behaviors">
  | (TOptions extends { behaviors: Array<infer TBehavior> }
    ? TBehavior extends BehaviorType<infer UOptions>
    ? ExpandBehaviors<Required<UOptions>>
    : unknown
    : never)
  : never;

/** 定义 Behavior 的参数类型 */
export type BehaviorOptions<
  // 原始 API 定义存在问题，若对象无默认值，经实际运行测试为其初始值 null，但类型被标注为
  // undefined，导致类型不匹配，因此下方采用 any 绕过。
  TProperty extends Record<string, PropType<any> | AllProperty> = {},
  TData extends DataOption = {},
  TMethod extends MethodOption = {},
  TAllOptions extends Record<string, unknown> = {},
  TBehavior extends BehaviorType<unknown> = BehaviorType<never>,
> =
  & Partial<Data<TData>>
  & Partial<Property<TProperty>>
  & Partial<Method<TMethod>>
  & Partial<Lifetimes>
  & Partial<Omit<OtherOption, "behaviors" | "options" | "definitionFilter">>
  & Partial<{
    behaviors: TBehavior[];
    definitionFilter: DefinitionFilter;
  }>
  & TAllOptions
  & ThisType<
    Instance<
      TProperty,
      TData,
      TMethod,
      Omit<TAllOptions, (typeof OPTIONS_KEYS)[number]>,
      TBehavior
    >
  >;

/** 挂载到 this 上的 behavior 实例类型 */
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

/** 类型友好的 Behavior 的类型定义。其中 `_options` 仅用于类型推断，不建议开发者直接访问。 */
export interface BehaviorType<TOptions> {
  id: WechatMiniprogram.Behavior.BehaviorIdentifier;
  _options: TOptions;
}

/**
 * 类型友好的 Behavior 的构造函数，用于替代原版接口中的 `Behavior()`
 * @see https://iwiki.woa.com/pages/viewpage.action?pageId=4008551342
 */
const defineBehavior = <
  // 原始 API 定义存在问题，若对象无默认值，经实际运行测试为其初始值 null，但类型被标注为
  // undefined，导致类型不匹配，因此下方采用 any 绕过。
  TProperty extends Record<string, PropType<any> | AllProperty> = {},
  TData extends DataOption = {},
  TMethod extends MethodOption = {},
  TCustom extends Record<string, unknown> = {},
  TBehavior extends BehaviorType<unknown> = BehaviorType<never>,
>(
  options: BehaviorOptions<TProperty, TData, TMethod, TCustom, TBehavior>,
): BehaviorType<
  BehaviorOptions<TProperty, TData, TMethod, TCustom, TBehavior>
> => {
  const { behaviors, lifetimes, definitionFilter, ...restOptions } = options;

  const id = Behavior<TData, TProperty, TMethod, TCustom>({
    behaviors: behaviors?.map((behavior: TBehavior) => behavior.id),
    lifetimes: {
      ...lifetimes,
      created() {
        Object.entries(options)
          .filter(([key]: [string, unknown]) =>
            !OPTIONS_KEYS.includes(key as any)
          )
          .forEach((
            [key, value]: [keyof TCustom, unknown],
          ) => ((this as any)[key] = value));
        lifetimes?.created?.apply(this);
      },
    },
    // 由于旧版 API 的 `definitionFilter()` 的首个参数 `defFields` 不支持顶层自定义属性，因此直接赋值会导致类型不匹配
    // 但是实际上运行时支持此功能，所以此处将其强制转换为 any 类型以绕过类型检查
    definitionFilter: definitionFilter as any,
    ...restOptions,
  });
  return { id, _options: options };
};

export default defineBehavior;
