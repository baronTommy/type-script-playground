it("object key から Union Type 作成", () => {
  // https://qiita.com/KuwabataK/items/587205867d333b705a41

  interface User {
    name: string,
    id: string,
    obj: {
      obj2: {
        aaa: string
      },
      bbb: string,
    }
  }
  type ValueOf<T> = T[keyof T];
  type Property<T> = keyof T | ValueOf<{[K in keyof T]: T[K] extends object ? Property<T[K]> : never}>
  
  type UserProperty = Property<User> //=> "name" | "id" | "obj" | "obj2" | "bbb" | "aaa"

  const uK: UserProperty = 'bbb'
  expect(uK).toBeDefined()
});

it("配列から要素の型を取得する", () => {
  // https://qiita.com/akameco/items/343ebca91a9c8506b897

  const MyArray = [
    { name: "Alice", age: 15 },
    { name: "Bob", age: 23 },
    { name: "Eve", age: 38 },
    { x: 123 }
  ];

  type T = (typeof MyArray)[number];

  const myObj: T = { name: "Alice", age: 15 };
  expect(myObj).toBeDefined();

  const myObj2: T = { x: 123 };
  expect(myObj2).toBeDefined();
});

it("ネストされた型もすべてオプショナルに", () => {
  // https://tech-1natsu.hatenablog.com/entry/2018/07/07/233655

  type NestedPartial<T> = {
    [K in keyof T]?: T[K] extends Array<infer R>
      ? Array<NestedPartial<R>>
      : NestedPartial<T[K]>;
  };

  interface Foo {
    foo: string;
    bar: string;
    baz: {
      a: string;
      b: string;
    };
  }

  type OptionalFoo = NestedPartial<Foo>;

  const a: OptionalFoo = {
    foo: "",
    baz: {}
  };

  expect(a).toBeDefined();
});

it("ネストされた型もすべてオプショナルに", () => {
  // https://log.pocka.io/posts/typescript-builtin-type-functions/
  interface Foo {
    bar?: number;
    baz: boolean;
  }
  type RequiredFoo = Required<Foo>;

  const foo: RequiredFoo = {
    bar: 1,
    baz: false
  };
  expect(foo).toBeDefined();
});

it("関数型Tの引数の型をタプルとして抽出", () => {
  // https://log.pocka.io/posts/typescript-builtin-type-functions/
  const foo = (arg1: string, arg2: number) => {
    if (arg1.length === arg2) {
      return;
    }
    return;
  };

  type Foo = Parameters<typeof foo>;

  const fooP: Foo = ["", 1];

  expect(fooP).toBeDefined();
});

it("型Tのコンストラクタの引数の型をタプルとして抽出", () => {
  // https://log.pocka.io/posts/typescript-builtin-type-functions/

  class Foo {
    constructor(arg1: string, arg2?: boolean) {
      arg1;
      arg2;
    }
  }
  type FooP = ConstructorParameters<typeof Foo>;

  const fooP: FooP = [""];
  const foo = new Foo(...fooP);

  expect(foo).toBeDefined();
});

it("this", () => {
  const user = {
    name: "foo",
    say() {
      return this.name;
    }

    // これはだめ
    // say: () => this.name
  };
  expect(user.say()).toBe("foo");
});

it("es5 class", () => {
  interface IDog {
    say(): string;
    name: string;
  }

  interface DogConstructor {
    new (): IDog;
  }

  const Dog = (function(this: IDog) {} as any) as DogConstructor;

  // こんな方法もあり
  // Dog.prototype.xx = 'xx'

  Dog.prototype = {
    name: "ポチ",
    say() {
      return "bow wow";
    }
  };

  const dog = new Dog();
  expect(dog.say()).toBe("bow wow");
  expect(dog.name).toBe("ポチ");
});

it("Proxy", () => {
  type Obj = {
    firstName: string;
    age: number;
  };

  const obj = {
    firstName: "Aloerina",
    age: 17
  };

  const handler: ProxyHandler<Obj> = {
    set(target, prop, value) {
      target;
      prop;
      value;
      throw new Error("上書き禁止");
    },
    get(target, name) {
      target;
      name;
      return "getされたよ";
    }
  };

  const wrapObj = new Proxy<Obj>(obj, handler);
  expect(wrapObj.firstName).toBe("getされたよ");

  const foo = () => (wrapObj.firstName = "");
  expect(foo).toThrow("上書き禁止");
});

it("call, apply, bind", () => {
  const Penguin = {
    name: "ペンギン"
  };

  const Falcon = {
    name: "鷹",
    fly(suffix = "*") {
      return `${this.name}が大空を飛びました${suffix}`;
    }
  };

  // 普通の呼び出し
  expect(Falcon.fly()).toBe("鷹が大空を飛びました*");

  expect(Falcon.fly.call(Penguin)).toBe("ペンギンが大空を飛びました*");
  expect(Falcon.fly.call(Penguin, "**")).toBe("ペンギンが大空を飛びました**");

  expect(Falcon.fly.apply(Penguin)).toBe("ペンギンが大空を飛びました*");
  expect(Falcon.fly.apply(Penguin, ["**"])).toBe(
    "ペンギンが大空を飛びました**"
  );

  const flyPenguin = Falcon.fly.bind(Penguin);
  expect(flyPenguin()).toBe("ペンギンが大空を飛びました*");

  const flyPenguin2 = Falcon.fly.bind(Penguin, "**");
  expect(flyPenguin2()).toBe("ペンギンが大空を飛びました**");
});

it("! lens", () => {
  const x: any = "";
  expect(x!.y).toBeUndefined();
});

it("絞り込み 1", () => {
  type A = { base: string };
  type V1 = A & { a: number };
  type V2 = A & { b: string };

  type X = V1 | V2;

  const hasA = (params: A): params is V1 => params.hasOwnProperty("a");

  const main = (params: X) => {
    if (hasA(params)) {
      console.log(params.a);
    }
  };

  expect(main).toBeDefined();
});

it("絞り込み 2", () => {
  type A = { base: string };
  type V1 = A & { a: number; __typeIs: "V1" };
  type V2 = A & { b: string; __typeIs: "V2" };

  type X = V1 | V2;

  const main = (params: X) => {
    if (params.__typeIs === "V1") {
      params.a;
    }
  };

  expect(main).toBeDefined();
});

it("絞り込み 3", () => {
  class Base {
    base!: string;
  }

  class A1 extends Base {
    a!: string;
  }

  class B1 extends Base {
    b!: string;
  }

  type YABAI = A1 | B1;

  const main = (p: YABAI) => {
    if (p instanceof A1) {
      p.a;
    }
  };

  expect(main).toBeDefined();
});

it("絞り込み 4", () => {
  type A = { base: string };
  type V1 = A & { a: number; aa: number };
  type V2 = A & { b: string };

  type X = V1 | V2;

  const main = (params: X) => {
    if ("a" in params) {
      params.a;
      params.aa; // 型確定してるので これもいける
    }
  };

  expect(main).toBeDefined();
});

it("Generics 制約", () => {
  type Input = {
    name: string;
  };

  const main = <P extends Input>(p: P) => {
    p.name;
  };

  // Input の要件を満たしていればOK
  main({ name: "", bar: "" });

  expect(true).toBeTruthy();
});

it("Generics 複数", () => {
  const t_u = <T, U>(p: T, p2: U) => ({ ...p, ...p2 });

  const merged = t_u({ a: "aa" }, { b: "bb" });
  const merged2 = t_u({ a: "aa" } as const, { b: "bb" } as const);

  expect(merged.a).toBeDefined();
  const x: typeof merged2.a = "aa";

  expect(x).toBeDefined();

  const x2: typeof merged = { a: "ok", b: "hi" };
  expect(x2).toBeDefined();
});

it("Generics 連携", () => {
  type FB = {
    foo: string;
    bar: string;
  };

  const fb: FB = { foo: "f", bar: "b" };

  const find = <T extends FB, U extends keyof T>(p: T, k: U) => p[k];

  find(fb, "foo");

  // 型推論 のたｍエラー
  // find(fb, 'hoge')
});

it("type safe object", () => {
  type Tpl = {
    code: number;
    label: string;
  };

  type TypeFactory<T extends Tpl> = T;

  const foo = { code: 100, label: "foo" } as const;
  type Foo = TypeFactory<typeof foo>;

  const bar = { code: 200, label: "bar" } as const;
  type Bar = TypeFactory<typeof bar>;

  type ServiceStatus = Foo | Bar;

  // https://github.com/Microsoft/TypeScript/issues/13923#issue-205837616
  type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };

  type DRServiceStatus = DeepReadonly<ServiceStatus[]>;

  const serviceStatusDic: DRServiceStatus = [
    { code: 100, label: "foo" },
    { code: 200, label: "bar" }
    // { cobe: 200, label: "bar" }, // エラー
    // { code: 300, label: "bar" }, // エラー
    // { code: 200, lightNovel: 'bar' }, // エラー
    // { code: 200, label: "f00" }, // エラー
    // { code: 100, label: "bar" } // エラー
  ];

  // https://www.typescriptlang.org/docs/handbook/advanced-types.html 参考
  const find = <T extends ServiceStatus, U extends keyof T>(o: T, k: U) => {
    o;
    k;
    // 省略
  };
  find(foo, "code");
  find(bar, "code");
  // find(bar, 'x') // エラー

  const find2 = <T extends DRServiceStatus, U extends ServiceStatus>(
    o: T,
    k: U
  ) => {
    o;
    k;
    // 省略
  };
  find2(serviceStatusDic, foo);
  find2(serviceStatusDic, bar);
  // find2({}, bar) // エラー
  // find2(serviceStatusDic, {code: 1, label: 'bar'})  // エラー

  const find3 = <T extends DRServiceStatus, U extends ServiceStatus["code"]>(
    o: T,
    k: U
  ) => {
    o;
    k;
    // 省略
  };
  find3(serviceStatusDic, 100);
  find3(serviceStatusDic, 200);
  // find3(serviceStatusDic, 300) // エラー
});

it("type safe object2", () => {
  type Tpl = {
    code: number;
    label: string;
  };

  class Foo implements Tpl {
    code!: 100;
    label!: "foo";
  }

  class Bar implements Tpl {
    code!: 200;
    label!: "bar";
  }

  type ServiceStatus = Readonly<Foo | Bar>;

  // https://github.com/Microsoft/TypeScript/issues/13923#issue-205837616
  type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };

  type DRServiceStatus = DeepReadonly<ServiceStatus[]>;

  const serviceStatusDic: DRServiceStatus = [
    { code: 100, label: "foo" },
    { code: 200, label: "bar" }
  ];

  // https://www.typescriptlang.org/docs/handbook/advanced-types.html 参考
  const find = <T extends ServiceStatus, U extends keyof T>(o: T, k: U) => {
    o;
    k;
    // 省略
  };
  find(new Foo(), "code");

  const find2 = <T extends DRServiceStatus, U extends ServiceStatus>(
    o: T,
    k: U
  ) => {
    o;
    k;
    // 省略
  };
  find2(serviceStatusDic, new Foo());

  const find3 = <T extends DRServiceStatus, U extends ServiceStatus["code"]>(
    o: T,
    k: U
  ) => {
    // 省略
    o;
    k;
  };
  find3(serviceStatusDic, 100);
});

it("Tuple -> Union", () => {
  type A = ["a", "b", "c"];
  type TU<T> = T extends (infer I)[] ? I : never;
  const aValue: TU<A> = "a";

  expect(aValue).toBeDefined();
});

it("Map -> Union", () => {
  type A = {
    a: "aa";
    b: "bb";
  };
  type MU<T> = T extends { [k: string]: infer I } ? I : never;

  const aValue: MU<A> = "aa";
  expect(aValue).toBeDefined();
});

it("Tuple -> Union その2", () => {
  const A = [{ a: 0, x: "abc" }, { b: 99 }];

  type TU<T> = T extends (infer I)[] ? I : never;
  const aValue: keyof TU<typeof A> = "x";

  expect(aValue).toBeDefined();
});

it("index type", () => {
  interface Dictionary<T> {
    [key: string]: T;
  }
  const key: keyof Dictionary<any> = 0; // string | number
  expect(key).toBeDefined();

  const value: Dictionary<number>[""] = 0; // number
  expect(value).toBeDefined();
});

it("交差での追加", () => {
  type PartialWithNewMember<T> = { [P in keyof T]?: T[P] } & {
    newMember: boolean;
  };

  const p: PartialWithNewMember<{}> = {
    newMember: false
  };
  expect(p).toBeDefined();
});

it("タプル", () => {
  // stringが1つ以上
  type KeyT = [string, ...string[]];
  // [T, T, T] を T | T | Tに 変更
  type TU<T> = T extends (infer I)[] ? I : never;

  type StringKeys = "k1" | "k2";
  type StringKeys2 = "x1" | "x2" | "x3";

  type Flags<T extends TU<KeyT>> = { [K in T]: boolean };

  const f: Flags<StringKeys> = { k1: false, k2: true };
  const f2: Flags<StringKeys2> = { x1: false, x2: true, x3: false };

  expect(f).toBeDefined();
  expect(f2).toBeDefined();
});

it("typename", () => {
  type TypeName<T> = T extends string
    ? "string"
    : T extends number
    ? "number"
    : T extends boolean
    ? "boolean"
    : T extends undefined
    ? "undefined"
    : T extends null
    ? "null"
    : T extends Function
    ? "function"
    : T extends []
    ? "array"
    : T extends Array<any>
    ? "any-array"
    : "object";

  const a: TypeName<string> = "string";
  expect(a).toBeDefined();

  const b: TypeName<{}> = "object";
  expect(b).toBeDefined();

  const c: TypeName<[]> = "array";
  expect(c).toBeDefined();

  const d: TypeName<null> = "null";
  expect(d).toBeDefined();

  const e: TypeName<string[] | number[]> = "any-array";
  expect(e).toBeDefined();
});

it("Diff, Filter", () => {
  type Diff<T, U> = T extends U ? never : T;
  type Filter<T, U> = T extends U ? T : never;

  type Base = "a" | "b" | "c";
  type Input1 = "c" | "a" | "b";
  type Input2 = "a" | "x" | "y";

  // @ts-ignore
  let x: Diff<Base, Input1>;
  const x2: Diff<Base, Input2> = "b";
  expect(x2).toBeDefined();

  const y: Filter<Base, Input1> = "b";
  const y2: Filter<Base, Input2> = "a";

  expect(y).toBeDefined();
  expect(y2).toBeDefined();
});

it("Arrayの宣言", () => {
  const x = [...Array(5)];
  expect(x).toBeDefined();

  const b = Array(5).slice();
  expect(b).toBeDefined();
});

it("PickUp", () => {
  // T.has(U) ? T : never みたいな感じ
  type Filter<T, U> = T extends U ? T : never;

  // {
  //   banana: { name: "banana", price: 10 },
  //   apple: { name: "apple", price: 20 },
  //   orange: never
  // }
  type FilterMap<T, U> = {
    [K in keyof T]: T[K] extends Filter<T[K], U> ? T[K] : never;
  };

  // banana, apple
  type NonNeverKeys<T> = {
    [K in keyof T]: T[K] extends never ? never : K;
  }[keyof T];

  // {
  //   banana: { name: "banana", price: 10 },
  //   apple: { name: "apple", price: 20 },
  // }
  type PickUp<T, U> = Pick<T, NonNeverKeys<FilterMap<T, U>>>;

  // ---------------------------------------
  type FruitsMap = {
    banana: { name: "banana"; price: number };
    apple: { name: "apple"; price: number };
    orange: { name: "orange" };
  };
  type P = { price: number };

  const x: PickUp<FruitsMap, P> = {
    banana: { name: "banana", price: 10 },
    apple: { name: "apple", price: 20 }
  };
  expect(x).toBeDefined();
});

it("DropOff", () => {
  type Filter<T, U> = T extends U ? T : never;

  type FilterMap<T, U> = {
    [K in keyof T]: T[K] extends Filter<T[K], U> ? T[K] : never;
  };

  type NeverKeys<T> = {
    [K in keyof T]: T[K] extends never ? K : never;
  }[keyof T];

  type DropOff<T, U> = Pick<T, NeverKeys<FilterMap<T, U>>>;

  // ---------------------------------------
  type FruitsMap = {
    banana: { name: "banana"; price: number };
    apple: { name: "apple"; price: number };
    orange: { name: "orange" };
  };
  type P = { price: number };

  const x: DropOff<FruitsMap, P> = {
    orange: { name: "orange" }
  };
  expect(x).toBeDefined();
});

it("myObj 型を抽出", () => {
  // 上と同じ
  // ---------------------------------------------------
  type Filter<T, U> = T extends U ? T : never;

  type FilterMap<T, U> = {
    [K in keyof T]: T[K] extends Filter<T[K], U> ? T[K] : never;
  };

  type NeverKeys<T> = {
    [K in keyof T]: T[K] extends never ? K : never;
  }[keyof T];

  type NonNeverKeys<T> = {
    [K in keyof T]: T[K] extends never ? never : K;
  }[keyof T];

  type DropOff<T, U> = Pick<T, NeverKeys<FilterMap<T, U>>>;
  type PickUp<T, U> = Pick<T, NonNeverKeys<FilterMap<T, U>>>;
  // ---------------------------------------------------

  // --------------------------------------------------
  const myObj = {
    cnt: 0,
    increment() {
      this.cnt++;
    },
    decrement() {
      this.cnt--;
    },
    pointLabel(unit: string) {
      return `${this.cnt}${unit}`;
    },
    computePoint(compute = (cnt: number) => cnt) {
      return compute(this.cnt);
    },
    getPointLabel() {
      return (unit = "") => this.pointLabel(unit);
    }
  };
  // --------------------------------------------------

  // 関数で無いものを抽出
  type DropOffFunction<T> = DropOff<T, Function>;

  // 戻りが U の物を抽出
  type PickUpByReturnType<T, U> = PickUp<T, (...args: any[]) => U>;

  type MyObj = typeof myObj;

  type A = DropOffFunction<MyObj>;
  const a: A = {
    cnt: 0
  };
  expect(a).toBeDefined();

  type B = PickUpByReturnType<MyObj, string>;
  const b: B = {
    pointLabel: () => ""
  };
  expect(b).toBeDefined();

  // returnが void の抽出
  // ---------------------------------------------------
  // 関数の戻りの型を取得
  type R<T> = T extends (...args: any[]) => infer I ? I : never;

  // 関数の戻りの型が void の Tを返す
  type RV<T> = T extends Function ? (R<T> extends void ? T : never) : never;

  // RVの map 化
  type ReturnVoidMap<T> = {
    [K in keyof T]: T[K] extends RV<T[K]> ? T[K] : never;
  };

  // return が void の propaty 名を取得して
  // その propaty を 持つ object を再生
  type PickUpReturnVoid<T> = Pick<T, NonNeverKeys<ReturnVoidMap<T>>>;
  // ---------------------------------------------------

  const x: PickUpReturnVoid<MyObj> = {
    increment: () => {},
    decrement: () => {}
  };
  expect(x).toBeDefined();
});

it("Promise の sleep", async () => {
  const p = (): Promise<void> =>
    new Promise(r =>
      setTimeout(() => {
        // console.log("ok");
        r();
      }, 10)
    );

  const main = (): Promise<void> => p();
  await main();
});

it("例外処理", () => {
  const yabai = () => {
    try {
      throw new Error("Something bad happened");
    } catch (e) {
      return e;
    }
  };

  const callYabai = () => yabai();
  // スタックトレースがあるので追いかけやすい
  expect(callYabai).toBeDefined();
});

it("例外処理2", () => {
  const yabai = () => {
    try {
      new Array(100000000000000000);
    } catch (e) {
      return e;
    }
  };

  // RangeError: Invalid array length
  // 数値変数またはパラメータが有効な範囲外にあるときに発生するエラーを表すインスタンスを作成します。
  expect(yabai).toBeDefined();
});

it("例外処理3", () => {
  const yabai = () => {
    try {
      // @ts-ignore
      naiyo();
    } catch (e) {
      return e;
    }
  };

  // ReferenceError
  // 無効な参照を参照解除するときに発生するエラーを表すインスタンスを作成します。例えば
  expect(yabai).toBeDefined();
});

it("例外処理4", () => {
  const yabai = () => {
    try {
      // @ts-ignore
      "1.2".toPrecision(1);
    } catch (e) {
      return e;
    }
  };

  // TypeError
  // 変数またはパラメータが有効な型でないときに発生するエラーを表すインスタンスを作成します。
  expect(yabai).toBeDefined();
});

it("例外処理5", () => {
  const yabai = () => {
    try {
      // @ts-ignore
      decodeURI("%"); // URIError: URI malformed
    } catch (e) {
      return e;
    }
  };

  // URIError
  // encodeURI()または decodeURI()に無効なパラメータが渡されたときに発生するエラーを表すインスタンスを生成します。
  expect(yabai).toBeDefined();
});

it("引数の型取得", () => {
  const myFunc = (p1: { a: number; b: string }, p2 = (c: number) => c) => {
    p1;
    p2;
  };

  // 1番目の引数 取得
  type A1T<T> = T extends (...arg: [infer I]) => any ? I : never;
  const myFuncP1: A1T<typeof myFunc> = { a: 1, b: "" };
  expect(myFuncP1).toBeDefined();

  // 2番目の引数取得
  type A2T<T> = T extends (...arg: [any, infer I]) => any ? I : never;
  const myFuncP2: A2T<typeof myFunc> = undefined;
  expect(myFuncP2).toBe(undefined);

  // 2番目の引数取得
  const myFuncP22: A2T<typeof myFunc> = (p: number) => p;
  expect(myFuncP22).toBeDefined();
});

it("Non null assertion", () => {
  type P = {
    foo: string | null | undefined;
  };

  const main = (p: P) => {
    // ! をつけると null や undefined をつぶす
    return p.foo!.length;
  };

  expect(main({ foo: "ok" })).toBeDefined();
});

it("脱 object -> Map使う", () => {
  type Keys = {
    [i: string]: Symbol;
  };

  const keys: Keys = {
    foo: Symbol(),
    bar: Symbol()
  } as const;

  const myMap = new Map<Symbol, any>();

  myMap.set(keys.foo, "~foo~");
  myMap.set(keys.bar, "~bar~");

  expect(myMap.get(keys.foo)).toBe("~foo~")
});
