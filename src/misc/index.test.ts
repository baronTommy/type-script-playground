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
      : NestedPartial<T[K]>
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
    constructor(arg1: string, arg2?: boolean) {}
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
      throw new Error("上書き禁止");
    },
    get(target, name) {
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
    fly(suffix = '*') {
      return `${this.name}が大空を飛びました${suffix}`
    }
  };

  // 普通の呼び出し
  expect(Falcon.fly()).toBe('鷹が大空を飛びました*')

  expect(Falcon.fly.call(Penguin)).toBe('ペンギンが大空を飛びました*')
  expect(Falcon.fly.call(Penguin, '**')).toBe('ペンギンが大空を飛びました**')

  expect(Falcon.fly.apply(Penguin)).toBe('ペンギンが大空を飛びました*')
  expect(Falcon.fly.apply(Penguin,['**'])).toBe('ペンギンが大空を飛びました**')

  
  const flyPenguin = Falcon.fly.bind(Penguin); 
  expect(flyPenguin()).toBe('ペンギンが大空を飛びました*')

  const flyPenguin2 = Falcon.fly.bind(Penguin,'**');
  expect(flyPenguin2()).toBe('ペンギンが大空を飛びました**')
});
