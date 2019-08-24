type Tpl = {
  code: number;
  label: string;
};

// https://github.com/Microsoft/TypeScript/issues/13923#issue-205837616
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}

class Foo implements Tpl {
  code!: 100;
  label!: "foo";
}

class Bar implements Tpl {
  code!: 200;
  label!: "bar";
}

type ServiceStatus = Foo | Bar;

type Whitelist<T> = T[keyof T];
type WhitelistCode = Whitelist<Pick<ServiceStatus, "code">>;
type WhitelistLabel = Whitelist<Pick<ServiceStatus, "label">>;


const serviceStatusDic: DeepReadonly<ServiceStatus[]> = [
  { code: 100, label: "foo" },
  { code: 200, label: "bar" },
  
  // すべてエラー
  // -----------------------------------
  { cobe: 200, label: "bar" },
  { code: 300, label: "bar" },
  { code: 200, lightNovel: "bar" },
  { code: 200, label: "f00" },
  { code: 100, label: "bar" }
  // -----------------------------------
];


const matchCode = (c: WhitelistCode) => (s: ServiceStatus) => s.code === c;
const _findMatchCodeFromServiceStatusDic = (c: WhitelistCode) =>
  serviceStatusDic.find(matchCode(c));
const find = _findMatchCodeFromServiceStatusDic; // alias

find(100); // {code: 100, label: 'foo'}
find(200); // {code: 200, label: 'bar'}
find(999); // 999はエラーになる

const label100: WhitelistLabel = "foo";
const label200: WhitelistLabel = "bar";
const labelXxx: WhitelistLabel = "xxx"; // xxxはエラーになる

// 再代入は不可
serviceStatusDic[0] = { code: 100, label: "foo" }
serviceStatusDic[1].cobe = 100
