import { defineBehavior, defineComponent } from "../src/index";
import { assertType } from "./utils";

const behavior1 = defineBehavior({
  data: {
    d1: "d1",
  },
  c1: "c1",
});

const behavior2 = defineBehavior({
  data: {
    d2: "d2",
  },
  c2: "c2",
});

const behavior3 = defineBehavior({
  data: {
    d3: "d3",
  },
  c3: "c3",
});

const behavior4 = defineBehavior({
  data: {
    d4: "d4",
  },
  c4: "c4",
});

const behavior5 = defineBehavior({
  behaviors: [behavior1, behavior2],
  data: {
    d5: "d5",
  },
  c5: "c5",
});

const behavior6 = defineBehavior({
  behaviors: [behavior3, behavior4],
  data: {
    d6: "d6",
  },
  c6: "c6",
});

defineComponent({
  behaviors: [behavior5, behavior6],
  lifetimes: {
    created() {
      assertType<string>(this.data.d1);
      assertType<string>(this.data.d2);
      assertType<string>(this.data.d3);
      assertType<string>(this.data.d4);
      assertType<string>(this.data.d5);
      assertType<string>(this.data.d6);
      
      assertType<string>(this.c1);
      assertType<string>(this.c2);
      assertType<string>(this.c3);
      assertType<string>(this.c4);
      assertType<string>(this.c5);
      assertType<string>(this.c6);
    },
  },
});
