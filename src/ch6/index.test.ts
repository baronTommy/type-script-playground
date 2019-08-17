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
  type IsString<T> = T extends string ? true : false;

  type X = IsString<'foo'> // trueに確定
  type Y = IsString<123> // falseに確定

  const x: X = true
  const y: Y = false

  expect(x).toBe(true)
  expect(y).toBe(false)

});

it("Mapped Types", () => {
    type Member = {
        name: string
        age: number
        isAdmin: boolean
    }

    type IsType<T, U> = {
        // T にある keyのみ OK
        // T[K] の型が Uであれば true : false
        [K in keyof T]: T[K] extends U ? true : false
    }

    // Member の 型が strig の場合 true それ以外は false
    type IsString = IsType<Member, string>

    const x: IsString = {
        name: true,
        age: false,
        isAdmin: false
    }

    expect(x).toMatchObject({
      name: true,
      age: false,
      isAdmin: false
    })
});


it("Mapped Types2", () => {
  type Auth = {
      insert: boolean
      delete: boolean
      update: boolean
  }

  type AuthDescription<T, U> = {
    [K in keyof T]: T[K] extends U ? string : never
  }

  const fooStaffAuth: Auth = {
    insert: false,
    delete: false,
    update: true
  }

  const fooStaffAuthDesc: AuthDescription<Auth, boolean> = {
    insert: '権限ないからだめ',
    delete: '全然だめ',
    update: 'これならOK'
  }
  expect(Object.keys(fooStaffAuth)).toMatchObject(Object.keys(fooStaffAuthDesc))
  
});
