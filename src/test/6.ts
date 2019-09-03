import readline, { ReadLine } from "readline";

type Input = any;
type Ans = number;

const init = () => ({
  rl: readline.createInterface({
    input: process.stdin,
    output: process.stdout
  }),
  //  0 ~ 100
  ans: Math.floor(Math.random() * (100 - 0) + 0)
});

const readUserInput = (rl: ReadLine, question: string) =>
  new Promise(resolve => rl.question(question, answer => resolve(answer)));

const inputResponse = async (rl: ReadLine): Promise<Input> =>
  await readUserInput(rl, "0~100以内で入力 \n");

const isHit = (input: Input, ans: Ans) => input === ans;

const inputValidate = (input: Input, ans: Ans) => {
  if (isNaN(input)) {
    return "まじめに...";
  }

  if (input < ans) {
    return "小さい";
  }

  if (input > ans) {
    return "大きい";
  }

  return "あたり";
};

const put = (p: string) => console.log(p);

const game = async (rl: ReadLine, ans: Ans) => {
  await new Promise(async resolve => {
    const input = parseInt(await inputResponse(rl));
    put(inputValidate(input, ans));
    if (!isHit(input, ans)) {
        await game(rl, ans);
    }
    resolve()
  });
};

const main = async () => {
  const { rl, ans } = init();
  console.log(`答え: ${ans}`);
  await game(rl, ans);
  rl.close();
};

main();
