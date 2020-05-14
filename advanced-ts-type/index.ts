interface Action<T> {
  payload?: T;
  type: string;
}

class EffectModule {
  count = 1;
  message = "hello!";

  delay(input: Promise<number>) {
    return input.then((i) => ({
      payload: `hello ${i}!`,
      type: "delay",
    }));
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: "set-message",
    };
  }
}

// 修改 Connect 的类型，让 connected 的类型变成预期的类型
type Connect = (module: EffectModule) => Result;

const connect: Connect = (m) => ({
  delay: (input: number) => ({
    type: "delay",
    payload: `hello 2`,
  }),
  setMessage: (input: Date) => ({
    type: "set-message",
    payload: input.getMilliseconds(),
  }),
});

type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
};

export const connected: Connected = connect(new EffectModule());

/**
 * EffectModule => Connected
 * ! 删除ts map 中值为某一类的的字段。参考链接：https://github.com/microsoft/TypeScript/issues/23199
 */
type FilteredKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];
type ResultWithPlainFileds = {
  [key in keyof EffectModule]: EffectModule[key] extends (
    input: Promise<infer InputType>
  ) => Promise<infer Action>
    ? (input: InputType) => Action
    : EffectModule[key] extends (action: Action<infer T>) => Action<infer U>
    ? (action: T) => Action<U>
    : EffectModule[key];
};
type FilterdResultKeys = FilteredKeys<ResultWithPlainFileds, Function>;
type Result = {
  [Q in FilterdResultKeys]: ResultWithPlainFileds[Q];
};
