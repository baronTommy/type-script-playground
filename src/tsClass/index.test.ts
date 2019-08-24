import {validate, Length} from "class-validator";

it("classの基本", () => {
  class Aa {
    say() {
      return "hi";
    }

    protected say2() {
      return "hi2";
    }

    // @ts-ignore
    private say3() {
      return "hi3";
    }

    static say4() {
      return "hi4";
    }
  }

  expect(new Aa().say()).toBe("hi");

  // protected なので呼べない
  // expect((new Aa()).say2()).toBe('hi')

  // private なので呼べない
  // expect((new Aa()).say3()).toBe('hi')

  expect(Aa.say4()).toBe("hi4");
});

it("classの基本2", () => {
  class Aa {
    // 初期化はされていない
    myName!: "foo" | "bar";

    myName2 = "foo";
    protected myName3 = "foo";
    // @ts-ignore
    private myName4 = "foo";
    static myName5 = "bar";
  }

  const aa = new Aa();
  expect(aa.myName).toBeUndefined();
  expect(aa.myName2).toBe("foo");
  expect(Aa.myName5).toBe("bar");
});

it("classの基本3 extends", () => {
  class Aa {
    static myName2 = "foo";
    say() {
      return "Aa hi";
    }
  }

  class Bb extends Aa {
    say() {
      return "Bb hi";
    }

    sayS() {
      return super.say();
    }
  }

  expect(Bb.myName2).toBe("foo");
  expect(new Bb().say()).toBe("Bb hi");
  expect(new Bb().sayS()).toBe("Aa hi");
});

it("classの基本4 interface implements", () => {
  interface Base {
    name: string;
    say: () => string;
  }

  class Aa implements Base {
    name = "foo";
    say() {
      return "";
    }
  }
  expect(Aa).toBeDefined();
});

it("classの基本4 abstract", () => {
  abstract class Aa {
    name!: string;
    say() {
      return this.name;
    }
    // this 無し
    abstract say2: () => string;

    // this 有り
    abstract say3(): string;
  }

  class Bb extends Aa {
    name = "foo";
    say2 = () => "say2";
    say3() {
      return "say3";
    }
  }

  expect(new Bb().say()).toBe("foo");
  expect(new Bb().say2()).toBe("say2");
  expect(new Bb().say3()).toBe("say3");
});

it("classの基本5 get set", () => {
  class Aa {
    get name() {
      return this._name;
    }

    set name(p) {
      this._name = `${p}--`;
    }

    constructor(private _name: string) {
      this.name = _name;
    }
  }

  const aa = new Aa("");
  expect(aa.name).toBe("--");
});

it("classの基本 decorator ", async () => {
    class Post {
        @Length(3, 100)
        title!: string;

        @Length(3, 100)
        body!: string;
    }
    const post = new Post();
    post.title = "AB";
    post.body = "XX";

    expect((await validate(post)).length).toBe(2)

    // for (const error of await validate(post)) {
    //     console.log(error)
    // }
});

it("classの基本 decorator ", async () => {
    class Post {
        @Length(3, 100)
        title!: string;

        @Length(3, 100)
        body!: string;
    }
    
    // 継承 OK
    class X extends Post { }

    const x = new X();
    x.title = "AB";
    x.body = "XX";
    expect((await validate(x)).length).toBe(2)
   
});
