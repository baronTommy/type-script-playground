export const hash = {
  main: {
    first: { text: "foobar" },
    second: { text: "fizzbuzz", child: { text: "foobar" } }
  },
  sub: {
    first: { text: "fizzbuzz", child: { text: "foobar" } },
    second: {
      third: { text: "barfoo", child: { text: "foobar" } },
      forth: { child: { text: "jit_foo_foo" } }
    }
  },
  text: "foofava"
};

const kageDio = `uryyyy!!`;

// https://qiita.com/usk81/items/cc7541c2b50d47373e32
function isArray(item: any) {
  return Object.prototype.toString.call(item) === "[object Array]";
}

// https://qiita.com/usk81/items/cc7541c2b50d47373e32
function isObject(item: any) {
  return typeof item === "object" && item !== null && !isArray(item);
}

export const main = (p: object) => {
  Object.keys(p).map(r => {
    // @ts-ignore
    if (isObject(p[r])) {
      // @ts-ignore
      main(p[r]);
      return
    }
    // @ts-ignore
    p[r] = p[r].replace(/foo/g, kageDio);
    return
  });
  return p;
};
