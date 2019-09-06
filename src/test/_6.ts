import readline, { ReadLine } from "readline";

type Input = any;
type Ans = number;
export type InputValidate<T> = (p: Input, ans: T) =>  string
type IsMatch<T> = (p: Input, ans: T) => boolean // 道場

const msg = "0-100で数字を当てて\n"

//  0 ~ 100 このぐらいのハードコーディングはいいでしょう...
const anser = () => Math.floor(Math.random() * (100 - 0) + 0)

// unit test 苦しい が e2e テストは可能である
export const init = (ansCreater: () => any) => ({
  rl: readline.createInterface({
    input: process.stdin,
    output: process.stdout
  }),
  ans: ansCreater()
});

// unit test 苦しい が e2e テストは可能である
const readUserInput = (rl: ReadLine, question: string) =>
  new Promise(resolve => rl.question(question, answer => resolve(answer)));

// unit test 可能であるが省略
export const inputResponse = async (rl: ReadLine, msg: string): Promise<Input> =>
  await readUserInput(rl, msg);

// unit test 可能であるが省略
const isMatch: IsMatch<Ans> = (input: Input, ans: Ans) => input === ans;

// unit test 可能であるが省略
const inputValidate: InputValidate<Ans> = (input, ans) => {
  // 桁数バリデートなど言うときりがないので...
  if (isNaN(input)) {
    return "まじめに...";
  }

  if (input < ans) {
    return "もっと上";
  }

  if (input > ans) {
    return "もっと下";
  }

  return "あたり";
};

// unit test 可能であるが省略
export const put = (p: string, f = console.log) => f(p);

// unit test 苦しい が e2e テストは可能である ただし けっこうたいへん
const game = async (rl: ReadLine, ans: Ans) => {
  await new Promise(async resolve => {
    const input = parseInt(await inputResponse(rl, msg));
    put(inputValidate(input, ans));
    if (!isMatch(input, ans)) {
        await game(rl, ans);
    }
    resolve()
  });
};

// unit test 苦しい が e2e テストは可能である ただし けっこうたいへん
export const main = async () => {
  const { rl, ans } = init(anser);
  console.log(`答え: ${ans}`);
  await game(rl, ans);
  rl.close();
};

