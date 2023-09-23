import { defineBehavior, defineComponent } from "../src/index";
import type { PropType } from "../src/index";
import { assertType } from './utils';

const behavior = defineBehavior({
  data: {
    dataOnBehavior: "dataOnBehavior",
  },
  customValueOnBehavior: "customValueOnBehavior",
});

defineComponent({
  behaviors: [behavior],
  properties: {
    p1: Number,
    p2: String,
    p3: Boolean,
    p4: Array as PropType<number[]>,
    p5: Object as PropType<{ child: string }>,
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
    m1() { },
    async m2(v: { child: string }[]) {
      console.log(v);
      return 0;
    },
  },
  lifetimes: {
    created() {
      assertType<number>(this.properties.p1);
      assertType<string>(this.properties.p2);
      assertType<boolean>(this.properties.p3);
      assertType<number[]>(this.properties.p4);
      assertType<{ child: string } | null>(this.properties.p5);

      assertType<number>(this.c1);
      assertType<string>(this.c2);
      assertType<number[]>(this.c3);
      assertType<{ child: string }>(this.c4);
      assertType<string>(this.c4.child);
      assertType<{ child: string } | undefined>(this.c5);
      assertType<string | undefined>(this.c5?.child);

      assertType<string>(this.data.dataOnBehavior);
      assertType<string>(this.customValueOnBehavior);

      assertType<void>(this.m1())
      assertType<Promise<number>>(this.m2([]));
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