it("unknown", () => {
  // unknown 型安全な any
  const x: unknown = "unknown";

  // このタイミングだと lengthは NG
  // expect(x.length).toBe('unknown'.length)
  if (typeof x === "string") {
    // ここで 型を確定 させると length OK
    expect(x.length).toBe("unknown".length);
  }
});

it("nevar", () => {
  // voidとの違いは、関数が正常に終了して値が返ってくるということが無い
  const x = (p: boolean): never | string => {
    if (p) {
      return "OK";
    }
    throw new Error("never");
  };
  expect(x(true)).toBe("OK");

  // これが void
  const x2 = (): void => {
    return;
  };
  expect(x2()).toBe(undefined);
});

it("Intersection Type", () => {
  type User = {
    name: string;
    age: number;
  };

  type Robot = {
    switch: "on" | "off";
  };

  type Humanoid = User & Robot;

  const droid: Humanoid = {
    name: "どろいど",
    age: 0,
    switch: "on"
  };

  expect(droid).toBeDefined();
});

it("Symbol", () => {
  // const a = Symbol()
  // const b = Symbol()
  // Symbolは、 a === b にならない
  // objectのkeyとして使うと良さげ？

  const a = Symbol();

  expect(typeof a === "symbol").toBe(true);
});

it("Union Type", () => {
  const v: number | string = "123";
  expect(v).toBeDefined();

  const v2: (number | string)[] = [1, "2", 3];
  expect(v2).toBeDefined();
});

it("Literal Type", () => {
  const v: "a" | "b" = "a";
  expect(v).toBeDefined();
});

it("Numeric Literal Type", () => {
  const v: 0 | 5 = 5;
  expect(v).toBeDefined();
});

it("typeof", () => {
  const myName = "foo";

  // typeof のテク 変数を指定できる
  let friendName: typeof myName;

  friendName = 'foo'
  expect(friendName === "foo");
});

it("typeof その2", () => {
  const userInfo = {
    id: 1,
    name: 'foo',
  }

  const friendInfo: typeof userInfo = {
    id: 99,
    name: 'bar'
  }

  expect(typeof friendInfo.id).toBe(typeof userInfo.id)
});

it("keyof", () => {
  type SomeType = {
    foo: string;
    bar: string;
  };

  // foo or bar みたいな限定が可能
  const someKey: keyof SomeType = "foo";
  expect(someKey === "foo" || "bar").toBe(true);
});

it("keyof と typeof の併用", () => {
  // objectのkeyのみしか受け付けない

  const x = {
    foo: "aaa",
    bar: "bbb"
  };

  let y: keyof typeof x = "foo";
  expect(y).toBe("foo");
});

it("enum", () => {
  // enum は アッパーケースが良いらしい
  enum Direction {
    Up,
    Down
    // ...
  }

  expect(Direction.Up).toBe(Direction.Up);
});
