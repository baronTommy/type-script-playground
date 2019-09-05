import { init, inputResponse, put } from "./_6"; // 6から importはよくないが.. 課題なので... 再利用可能 = ドライと思ってもらえると ありがたいです
import { ReadLine } from "readline";

type Ans = string;
type P = { input: string; ans: Ans; i: number };

// ここがこの問題の本質ではないので これで十分
const anser = (): Ans => "1234";

const msg = "ランダムに用意された4桁の数字を当てる\n";

const isMatchAndAns = (input: any, ans: Ans) => {
  if (input.length !== ans.length) {
    return {
      isValid: false,
      res: "あのねー"
    };
  }

  const hit = check(input, ans, isHit);
  const blow = check(input, ans, isBlow);

  return {
    isValid: parseInt(hit) === ans.length,
    res: `hit: ${hit}, blow: ${blow}`
  };
};

const isBlow = ({ input, i }: P) => {
  const r = anser().indexOf(input.charAt(i));

  // デバッグ用にあったほうがいいと思い 残してます
  console.log({
    i: `今見てる値-> ${input.charAt(i)}`,
    ans: `答え-> ${anser()}`,
  })

  if (r === i) {
    // 完全一致
    return false;
  }

  return r >= 0
};

const isHit = ({ input, ans, i }: P) => ans.charAt(i) === input.charAt(i);

const check = (input: string, ans: Ans, checker: (p: P) => boolean) => {
  let cnt = 0;
  for (let i = 0; i < ans.length; i++) {
    checker({ input, ans, i }) ? cnt++ : undefined;
  }
  return cnt.toString();
};

const game = async (rl: ReadLine, ans: Ans) => {
  await new Promise(async resolve => {
    const input = await inputResponse(rl, msg);
    const { isValid, res } = isMatchAndAns(input, ans);
    if (!isValid) {
      put(res);
      await game(rl, ans);
    }
    resolve();
  });
};

export const main = async () => {
  const { rl, ans } = init(anser);
  console.log(`答え: ${ans}`);
  await game(rl, ans);
  rl.close();
};
