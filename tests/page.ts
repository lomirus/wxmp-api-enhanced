import { defineBehavior, definePage } from "../src/index";
import { assertType } from './utils';

const behavior = defineBehavior({
  data: {
    dataOnBehavior: "dataOnBehavior",
  },
  customValueOnBehavior: "customValueOnBehavior",
});

definePage({
  behaviors: [behavior],
  data: {
    d1: 1,
    d2: "string",
    d3: [1, 2, 3],
    d4: {
      child: "a",
    },
    d5: undefined,
  },
  m1() { },
  async m2(v: { child: string }[]) {
    console.log(v);
    return 0;
  },
  lifetimes: {
    created() {
      assertType<string>(this.data.dataOnBehavior);
      assertType<string>(this.customValueOnBehavior);

      assertType<void>(this.m1())
      assertType<Promise<number>>(this.m2([]));

      assertType<number>(this.c1);
      assertType<string>(this.c2);
      assertType<number[]>(this.c3);
      assertType<{ child: string }>(this.c4);
      assertType<string>(this.c4.child);
      assertType<{ child: string } | undefined>(this.c5);
      assertType<string | undefined>(this.c5?.child);
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
