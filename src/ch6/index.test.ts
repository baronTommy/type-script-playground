it("Generics デフォルト値", () => {
  type Box<T = string> = {
    name: T;
  };

  const strBox: Box = { name: "" };
  const numBox: Box<number> = { name: 1 };

  expect(strBox.name).toBe("");
  expect(numBox.name).toBe(1);
});

it("Generics 制約", () => {
  type Box<T extends string | number> = {
    name: T;
  };

  const strBox: Box<string> = { name: "" };
  const numBox: Box<number> = { name: 1 };

  expect(strBox.name).toBe("");
  expect(numBox.name).toBe(1);
});

it("Generics 制約2", () => {
  type Item = {
    name: string;
    price: number;
  };

  const boxed = <T extends Item>(p: T) => ({
    value: p,
    newName: p.name.concat("xx")
  });

  const newName = boxed({ name: "foo", price: 123 }).newName;

  expect(newName).toBe("fooxx");
});

it("Generics 制約3", () => {
  const pick = <T, K extends keyof T>(p: T, k: K) => p[k];

  const userInfo = {
    name: "foo",
    age: 50
  };

  expect(pick(userInfo, "name")).toBe("foo");
});

it("Conditional Type", () => {
  type IsString<T> = T extends string ? "ok" : false;

  type X = IsString<"foo">; // trueに確定
  type Y = IsString<123>; // falseに確定

  const x: X = "ok";
  const y: Y = false;

  expect(x).toBe("ok");
  expect(y).toBe(false);
});

it("Mapped Types", () => {
  type Member = {
    name: string;
    age: number;
    isAdmin: boolean;
  };

  type IsType<T, U> = {
    // T にある keyのみ OK
    // T[K] の型が Uであれば true : false
    [K in keyof T]: T[K] extends U ? true : "ng"
  };

  // Member の 型が strig の場合 true それ以外は false
  type IsString = IsType<Member, string>;

  const x: IsString = {
    name: true,
    age: "ng",
    isAdmin: "ng"
  };

  expect(x).toMatchObject({
    name: true,
    age: "ng",
    isAdmin: "ng"
  });
});

it("Mapped Types2", () => {
  type Auth = {
    insert: boolean;
    delete: boolean;
    update: boolean;
  };

  type AuthDescription<T, U> = {
    [K in keyof T]: T[K] extends U ? string : never
  };

  const staffAuthAction: Auth = {
    insert: false,
    delete: false,
    update: true
  };

  const staffAuthDesc: AuthDescription<Auth, boolean> = {
    insert: "権限ないからだめ",
    delete: "全然だめ",
    update: "これならOK"
  };

  expect(Object.keys(staffAuthAction)).toMatchObject(
    Object.keys(staffAuthDesc)
  );
});

it("Fillter 条件に一致するkeyのタプル", () => {
  type Properties = {
    firstName: string;
    lastName: string;
    age: number;
    action: () => void;
  };

  type Fillter<T, U> = {
    // 条件を満たす key フィルタリング
    [K in keyof T]: T[K] extends U ? K : never
  }[keyof T]; // 一致した key のタプル

  type StringKeyName = Fillter<Properties, string>;

  const x: StringKeyName = "firstName";
  const y: StringKeyName = "lastName";

  expect(x).toBeDefined();
  expect(y).toBeDefined();
});

it("Fillter 条件に一致するkeyでobject生成", () => {
  type Properties = {
    firstName: string;
    lastName: string;
    age: number;
    action: () => void;
  };

  type Fillter<T, U> = {
    // 条件を満たす key フィルタリング
    [K in keyof T]: T[K] extends U ? K : never
  }[keyof T]; // 一致した key のタプル

  type StringKeyName = Fillter<Properties, string>;

  type StringProperties = Pick<Properties, StringKeyName>;

  const x: StringProperties = {
    firstName: "",
    lastName: ""
  };
  expect(x).toBeDefined();
});

it("ネストが深い型の抽出", () => {
  type DeepNest = {
    deep: { nest: { value: string } };
  };

  type ShallowNest = {
    shallow: { value: string };
  };

  type Properties = {
    deep: DeepNest;
    shallow: ShallowNest;
  };

  type SalVage = DeepNest["deep"]["nest"]["value"];

  type DeepDive<T> = {
    // 処理の流れ
    // T[K] 互換性あり？ DeepNest
    // ↓
    // SalVage<Properties['deep']>
    // ↓
    // {deep: string}
    // ↓
    // {deep: string}[keyof {deep: string}]
    // ↓
    // {deep: string}['deep'] -> string
    [K in keyof T]: T[K] extends DeepNest ? SalVage : number
  }[keyof T];

  const x: DeepDive<Properties> = "";
  expect(x).toBeDefined();
});

it("key名をタプルとして", () => {
  type A = {
    foo: string;
  };

  type B = A[keyof A];

  const b: B = "a";
  expect(b).toBeDefined();
});

it("extends 複数一致", () => {
  type A = {
    a: number;
    b: string;
    c: string;
  };

  type C<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];

  const x: C<A> = "b";
  expect(x).toBeDefined();

  const y: C<A> = "c";
  expect(y).toBeDefined();
});

it("infer でReturn type 自作", () => {
  const greet = () => "hi";

  // (...arg: any[]) => ?? は 戻りがある関数の型
  type MyReturnType<T> = T extends (...arg: any[]) => infer U ? U : never;

  const b: MyReturnType<typeof greet> = "";

  expect(b).toBeDefined();
});

it("infer 関数の引数の型を取る", () => {
  const greet = (msg: string, age: number) => `${msg} & ${age}`;

  // Tメソッドの1 番目の引数の型を返す
  type PickP1<T> = T extends (...arg: [infer U, ...any[]]) => any ? U : never;

  // Tメソッドの2 番目の引数の型を返す
  type PickP2<T> = T extends (...arg: [any, infer U, ...any[]]) => any
    ? U
    : never;

  // Tメソッドの引数の型の array
  type P<T> = T extends (...arg: infer U) => any ? U : never;

  const msg: PickP1<typeof greet> = "";
  const age: PickP2<typeof greet> = 1;
  const greetP: P<typeof greet> = ["", 1];

  expect([msg, age, greetP]).toBeDefined();
});

it("infer Promiseの戻りの型", () => {
  const greet = async () => {
    return "hi";
  };

  type A<T> = T extends () => Promise<infer U> ? U : never;

  const a: A<typeof greet> = "";

  expect(a).toBeDefined();
});

it("ClassのGenerics", () => {
  const Aa = class<T extends string> {
    name: T;
    constructor(name: T) {
      this.name = name;
    }
  };
  expect(Aa).toBeDefined();
});

it("ClassのGenerics 2", () => {
  type Info = {
    name: string;
    age: number;
  };
  const Bb = class<T extends Info> {
    name!: Pick<T, "name">;
    age!: Pick<T, "age">;
  };
  expect(Bb).toBeDefined();
});

it("無名classは型として利用できない", () => {
  const Cc = class {
    name = "foo";
  };
  // 無名classは型として利用できない
  // const cc: Cc = {}

  // これならOK
  const cc: typeof Cc = class {
    name = "foo";
  };
  expect(cc).toBeDefined();
});

it("無名class 掘り下げ (たぶん使いみち無し)", () => {
  const Cc = class {
    name = "foo";
  };
  const x = function() {}.prototype;
  const cc: keyof typeof Cc = x;
  expect(cc).toBeDefined();
});

it("無名class 掘り下げ (たぶん使いみち無し2)", () => {
  const Cc = class {
    name = "foo";
  };
  const x = new Cc();
  const cc: typeof x = { name: "foo" };
  expect(cc).toBeDefined();
});

it("class を型として継承", () => {
  class Xx {
    name!: "foo" | "bar";
  }

  class Yy<T extends Xx> {
    name: T["name"] = "foo";
    updateName() {
      this.name = "bar";
    }
  }
  expect(Yy).toBeDefined();
});

it("ClassのGenerics 3", () => {
  class Cc {
    name = "foo";
    age = 12;

    // この方法はデフォルト値がセットされるわけではない
    bar!: "hoge";
  }
  // class を型として利用
  const myClass: Cc = { name: "foo", age: 100, bar: "hoge" };
  expect(myClass).toBeDefined();
});

it("Utility Type", () => {
  interface User {
    name: string;
    age: number | null;
    generate: "male" | "female" | "other";
    birthpace?: string;
  }

  // readonly 付与
  // @ts-ignore
  type ReadonlyUser = Readonly<User>;

  // optional に変更
  // @ts-ignore
  type PartialUser = Partial<User>;

  // optional を除去
  // @ts-ignore
  type RequiredUser = Required<User>;

  // 下記のよう型を生成
  // ----------------------------------
  // @ts-ignore
  type UserRecord = Record<"newIndex", User>;
  // @ts-ignore
  const u: UserRecord = {
    newIndex: {
      name: "",
      age: 1,
      generate: "other"
    }
  };
  // ----------------------------------

  // 型から要素の取り出し
  type UserAge = Pick<User, "age">;
  // @ts-ignore
  const userAge: UserAge = 1;

  // 型から要素の除去
  type WithoutAge = Omit<User, "age">;
  // @ts-ignore
  const userInfo: WithoutAge = {
    name: "",
    generate: "male"
  };
});

it("Utility Type2", () => {
  type L = "a" | "b" | "c" | "d";
  type R = "a" | "b";

  // 第1型パラメタ と 第2型パラメタ 差分の型を生成
  type X = Exclude<L, R>;
  // @ts-ignore
  const x: X = "c";
  // @ts-ignore
  const x2: X = "d";

  // 上記の逆
  type Y = Extract<L, R>;
  // @ts-ignore
  const y: Y = "a";
  // @ts-ignore
  const y2: Y = "b";

  // null, undefined の除去
  type Z = NonNullable<string | null | undefined>;
  // @ts-ignore
  const z: Z = "";

  // 関数の戻りの型
  const say = () => "hi";
  type X1 = ReturnType<typeof say>;
  // @ts-ignore
  const sayR: X1 = "";

  // class 関連操作
  // ----------------------------------------------------------
  class MyClass {
    x = 1;
    aaa() {}
  }
  // class を型として利用
  const myClass: MyClass = { x: 1, aaa: () => {} };
  expect(myClass).toBeDefined();

  // class を typeof して利用
  const MyClass2: typeof MyClass = class {
    x = 1;
    aaa() {}
  };
  expect(MyClass2).toBeDefined();

  // InstanceType で どのクラスのインスタンスか判定
  type MyClassT = InstanceType<typeof MyClass>;
  const a: MyClassT = new MyClass();
  expect(a).toBeDefined();
  // ----------------------------------------------------------
});

it("Utility Type3", () => {
  type MyFunc = Function;
  type Part = {
    id: number;
    f: MyFunc;
    ff: MyFunc;
  };

  // MyFunc の 型の key 名取得
  type A<T> = { [K in keyof T]: T[K] extends MyFunc ? K : never }[keyof T];

  type D = Pick<Part, A<Part>>;

  // @ts-ignore
  const x: D = { f: p => {}, ff: p2 => {} };

  const m: A<Part> = "f";
  expect(m).toBeDefined();
});

it("Readonly type 再帰", () => {
  type User = {
    name: string;
    deep: {
      age: number;
    };
  };

  // array or object 以外
  type Primitives = string | number; // ...

  type DR<T> = {
    readonly [P in keyof T]: T[P] extends Primitives ? T[P] : DR<T[P]>
  };

  const u: DR<User> = {
    name: "",
    deep: {
      age: 1
    }
  };

  // どちらも だめ
  // u.name = '10'
  // u.deep.age = 10

  expect(u).toBeDefined();
});

it("objectの型を 抽出して unionにする", () => {
  type Unbox<T> = T extends { [K in keyof T]: infer U } ? U : never;
  type T = Unbox<{ a: string; b: number; c: boolean }>;

  const x: T = "";
  const x2: T = 1;
  const x3: T = false;

  expect(x).toBeDefined();
  expect(x2).toBeDefined();
  expect(x3).toBeDefined();
});

it("or を and に変える, union を intersection に変える", () => {
  // --------------
  // 引数の型を`(p: T) => void` これに変更
  type A<T> = T extends any ? (p: T) => void : never;

  // 上記の処理で すべて `infer I` となり I 連結して帰ってくる
  type B<T> = A<T> extends (x: infer I) => void ? I : never;
  // --------------

  type X_or_Y = { x: "x" } | { y: "y" };
  type X_and_Y = B<X_or_Y>;

  const t: X_or_Y = { x: "x" };
  const t2: X_and_Y = { x: "x", y: "y" };

  expect(t).toBeDefined();
  expect(t2).toBeDefined();
});

it("NonEmptyList", () => {
  type L<T> = [T, ...T[]];

  const l: L<string> = [""];
  expect(l).toBeDefined();

  const l2: L<{ a: "a" }> = [{ a: "a" }];
  expect(l2).toBeDefined();

  const l3: L<{ a: { a: "a" } }> = [{ a: { a: "a" } }];
  expect(l3).toBeDefined();
});

it("Setの引数の型取得", () => {
  type X<T> = T extends Set<infer I> ? I : never;

  // as const で tuple化
  const set = new Set([1, 5] as const);
  const p : X<typeof set> =  1

  expect(p).toBeDefined()
});

it("Mapの引数の型取得", () => {
  const p = [[0, 'foo'], [10, 'bar']] as const
  const map = new Map(p)

  type PMK<T>  = T extends Map<infer K, any> ? K : never

  type MKS = PMK<typeof map>

  const mks: MKS = 0
  expect(mks).toBeDefined()
});
