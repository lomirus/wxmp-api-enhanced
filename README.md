# `wxmp-api-enhanced`

## 介绍

微信小程序框架 API `Page`、`Component`、`Behavior` 的替代版本 API，优化了对于 TypeScript 的支持。

借助 `wxmp-api-enhanced`，开发人员不再需要重复声明各种类型、不需要导入导出类型，利用类型自动推断，可以显著减少大量重复代码，提升开发人员的开发效率。

## 示例

```ts
import { defineBehavior, defineComponent } from "wxmp-api-enhanced";
import type { PropType } from "wxmp-api-enhanced";

// ✅ 无需手动声明类型
const behavior = defineBehavior({
  data: {
    dataOnBehavior: "dataOnBehavior",
  },
  // ✅ 无需在 created 阶段手动赋值
  customValueOnBehavior: "customValueOnBehavior",
});

// ✅ 无需手动声明类型
defineComponent({
  behaviors: [behavior],
  properties: {
    p1: Number,
    p2: String,
    p3: Array as PropType<number[]>,
    p4: Object as PropType<{ child: string }>,
  },
  data: {
    d1: 1,
    d2: "string",
    d3: [1, 2, 3],
    d4: {
      child: "a",
    },
    d5: undefined,
  },
  methods: {
    m1() {},
    async m2(v: { child: string }[]) {
      console.log(v);
      return 0;
    },
  },
  lifetimes: {
    created() {
      console.log(this.properties.p1); // ✅ 类型推断为 number
      console.log(this.properties.p2); // ✅ 类型推断为 string
      console.log(this.properties.p3); // ✅ 类型推断为 number[]
      console.log(this.properties.p4); // ✅ 类型推断为 { child: string; }

      console.log(this.c1); // ✅ 类型推断为 number
      console.log(this.c2); // ✅ 类型推断为 string
      console.log(this.c3); // ✅ 类型推断为 number[]
      console.log(this.c4); // ✅ 类型推断为 { child: string; }
      console.log(this.c4.child); // ✅ 类型推断为 string | undefined

      console.log(this.c5); // ✅ 类型推断为 { child: string; } | undefined
      // console.log(this.c5.child); // ✅ 编译时按预期报错，需要修改为以下内容
      console.log(this.c5?.child); // ✅ 因为使用了空安全运算符，编译通过，类型推断为 string | undefined

      console.log(this.data.dataOnBehavior); // ✅ 类型推断为 string
      console.log(this.customValueOnBehavior); // ✅ 类型推断为 string
    },
  },
  c1: 1,
  c2: "c2",
  c3: [1, 2, 3],
  c4: {
    child: "text",
  },
  c5: undefined as undefined | {
    child: string;
  },
});
```

## API 列表

| 原版 API      | `wxmp-api-enhanced` API |
| ------------- | ----------------------- |
| `Page()`      | `definePage()`          |
| `Component()` | `defineComponent()`     |
| `Behavior()`  | `defineBehavior()`      |
