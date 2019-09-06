it("FizzBuzz", () => {
  // 30分

  // ブログでリファクタ
  // https://dev.classmethod.jp/beginners/try-typescript-fizz-buzz/

  type Maybe<T> = T | "";
  type Fizz = "Fizz";
  type Buzz = "Buzz";
  type FizzBuzz = Fizz | Buzz | "FizzBuzz";
  type Result = FizzBuzz | number;

  const fizz = (p: number): Maybe<Fizz> => (p % 3 === 0 ? "Fizz" : "");
  const buzz = (p: number): Maybe<Buzz> => (p % 5 === 0 ? "Buzz" : "");

  const main = (p: number) =>
    [...Array(p)]
      .map(
        (_, i): Result => {
          // 0 開始の調整用
          const k = i + 1;
          const r = [fizz(k), buzz(k)].join("") as Maybe<FizzBuzz>;
          return r === "" ? k : r;
        }
      )
      .join(", ");

  const expectAns =
    "1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz, 16, 17";
  const input = 17;
  expect(main(input)).toBe(expectAns);
});

it("文字列ハッシュ", () => {
  // 30分

  // reduce を初めて使いました acc の上書きは気持ち悪いです

  const delimiter = " ";
  type Result = { [i: string]: number };

  const main = (p: string) =>
    p.split(delimiter).reduce((acc: Result, cur) => {
      acc[cur] = acc.hasOwnProperty(cur) ? acc[cur] + 1 : 1;
      return acc;
    }, {});

  const input = "no js no life";
  const expectAns = { no: 2, js: 1, life: 1 };

  expect(main(input)).toEqual(expectAns);
});

it("じゃんけん", () => {
  // 30分

  // 特筆事項
  // ジャンケンの概念は一般的なので Mapで定義 量を考えてもハードコーデョングで十分だと思います
  // もし 3すくみ以上であれば、 ロジック化したほうがいいと思います

  type Janken = "グー" | "チョキ" | "パー";
  type Response = "カチ" | "マケ" | "アイコ";
  type Judge = { [K in Janken]: Response };

  const janken: Janken[] = ["グー", "チョキ", "パー"];
  const jankenMap = new Map<Janken, Judge>();
  jankenMap.set("グー", { グー: "アイコ", チョキ: "カチ", パー: "マケ" });
  jankenMap.set("チョキ", { チョキ: "アイコ", グー: "カチ", パー: "マケ" });
  jankenMap.set("パー", { パー: "アイコ", グー: "カチ", チョキ: "マケ" });

  const judgeJanken = (me: Janken, cpu: Janken): Response => {
    const r = jankenMap.get(me);
    if (r === undefined) {
      throw new Error("ごめんなさい");
    }
    return r[cpu];
  };

  const main = (p: Janken) => {
    const cpuJanken = janken[Math.floor(Math.random() * janken.length)];

    return {
      me: p,
      cpu: cpuJanken,
      judge: judgeJanken(p, cpuJanken)
    };
  };

  while (true) {
    const { me, cpu, judge } = main("グー"); // チョキ パーは省略
    console.log({ me, cpu, judge });

    if (judge !== "アイコ") {
      break;
    }
  }
});

it("再帰", () => {
  // 10分

  // 特筆事項
  // sumの上書きは気持ち悪いです

  const main = (p: number, sum = 0): number => {
    if (p === 1) {
      return sum + 1;
    }
    return main(p - 1, sum + p);
  };

  // 入力：5
  // 出力：15 （5+4+3+2+1 の結果）
  expect(main(5)).toBe(15);
});

it("ソート", () => {
  // 300分

  // 特筆事項
  // 可読性向上のための array propatyは 使ってもいいと思うので使っています
  // 1度のループですると可読性下がるので 個別にループしています
  // swap や sort での引数汚染は気持ち悪いです
  
  // バブルソートを初めて書きました 苦手です
  // クイックソートを初めて書きました あまり理解できていません
  // ソートの降順は省略しています

  type Input = [number, ...number[]];

  const lt = (p1: number, p2: number) => p1 < p2;
  const rt = (p1: number, p2: number) => p1 > p2;
  const countUp = (i: number) => i + 1;
  const countDown = (i: number) => i - 1;
  const head = (p: Input) => p.find(() => true) as number;
  const swap = (base: Input, k1: number, k2: number) => {
    const tmp = base[k1];
    base[k1] = base[k2];
    base[k2] = tmp;
    return base;
  };

  const minMax = (p: Input, condition = lt) => {
    let r = head(p);
    p.forEach(v => (condition(r, v) ? (r = v) : undefined));
    return r;
  };

  const bSortAsk = (p: Input, condition = lt) => {
    p.forEach((v, k) => {
      const next = k + 1; // 妥協
      condition(v, p[next]) ? swap(p, k, next) : undefined;
    });
    return p;
  };

  const find = (
    pivot: number,
    p: Input,
    index: number,
    condition = rt,
    nextIndex = countUp
  ) => {
    let i = index;

    while (condition(pivot, p[i])) {
      i = nextIndex(i);
    }

    return i;
  };

  const min = (p: Input) => minMax(p, rt);
  const max = (p: Input) => minMax(p);

  const sum = (p: Input) => {
    let r = 0;
    p.forEach(v => (r += v));
    return r;
  };

  const average = (p: Input) => {
    return sum(p) / p.length;
  };

  const bubbleSortAsk = (p: Input, r: number[] = []): number[] => {
    if (p.length === 0) {
      return r;
    }
    r.push(bSortAsk(p).pop() as number);
    return bubbleSortAsk(p, r);
  };

  const isAllocation = (a: number, b: number) => a <= b;

  const quickSortAsk = (p: Input) => {
    const qSortAsk = (s: number, e: number) => {
      // 配列の真ん中を基準として
      const pivot = p[Math.floor((s + e) / 2)];
      let l = s;
      let r = e;

      while (true) {
        // pivotより大きい値が出るまで 先頭から 末尾へ
        l = find(pivot, p, l);

        // pivotより小さい値が出るまで 末尾から 先頭へ
        r = find(pivot, p, r, lt, countDown);

        // ピボットを基準に左右に 値がふりわけられた？
        if (isAllocation(r, l)) {
          break;
        }

        swap(p, l, r);

        // 同値用
        r--;
        l++;
      }

      //左側に分割できるデータがある場合、quickSort関数を呼び出して再帰的に処理を繰り返す。
      if (s < l - 1) {
        qSortAsk(s, l - 1);
      }

      //右側に分割できるデータがある場合、quickSort関数を呼び出して再帰的に処理を繰り返す。
      if (r < e - 1) {
        qSortAsk(r + 1, e);
      }
    };

    qSortAsk(0, p.length - 1);
    return p;
  };

  const main = (p: Input) => ({
    max: max(p),
    min: min(p),
    average: average(p),
    sum: sum(p),
    bubbleSortAsk: bubbleSortAsk([...p] as Input), // 引数汚染があるので
    quickSortAsk: quickSortAsk([...p] as Input) // 引数汚染があるので
  });

  const input: Input = [20, 31, 42, 13, 5, 38];
  main(input);
});
