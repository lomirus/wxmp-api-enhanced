import type { AllProperty } from './wx';

export type PropType<T extends Array<unknown> | Record<string, unknown>> = T extends Array<unknown>
  ? ArrayConstructor | { type: ArrayConstructor; value: T | null }
  : ObjectConstructor | { type: ObjectConstructor; value: T | null };

export type TypedProperties<
  T extends Record<string, PropType<Array<unknown> | Record<string, unknown>> | AllProperty>
> = {
    [key in keyof T]:
    // boolean
    T[key] extends BooleanConstructor | { type: BooleanConstructor; value: boolean }
    ? boolean

    // number
    : T[key] extends NumberConstructor | { type: NumberConstructor; value: number }
    ? number

    // string
    : T[key] extends StringConstructor | { type: StringConstructor; value: string }
    ? string

    // array
    : T[key] extends ArrayConstructor
    ? Array<unknown>
    : T[key] extends { type: ArrayConstructor; value: infer U }
    ? U

    // object
    : T[key] extends ObjectConstructor
    ? Record<string, unknown> | null
    : T[key] extends { type: ObjectConstructor; value: infer U }
    ? U

    // PropType<T>
    : T[key] extends PropType<infer U>
    ? U extends Array<unknown> ? U : (U | null)
    : unknown;
  };
