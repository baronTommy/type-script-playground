import { of, Observer, Observable, identity, throwError, concat } from "rxjs";
// Operators とは Observable に対してフィルターをかけるなど値を加工するためのメソッド群
import { map, catchError, tap, delay, finalize } from "rxjs/operators";
import { deepStrictEqual } from "assert";
import { TestScheduler } from "rxjs/testing";

const log = (msg: string) => {msg};
// logあると見づらいのでコメントに
// console.log(msg);

const errorLog = (error: any) => log(error.message);

const completeLog = () => console.log("on complete");

const addToEnd = (p: string) => (base: string) => base.concat(p);

const errorHandler = (p: string) => {
  p
  return throwError("ya ba i");
}

const mainEffect = ({ next, error, complete }: Observer<string>) => ({
  next, // 新しい値が流れてきたときに
  error, // ストリームの途中でエラーが発生したときに
  complete // 全ての値が流れきってストリームが終了した時
});

const epicLike = (resources$: Observable<string>) =>
  resources$.pipe(
    map(addToEnd("x")),
    tap(mainEffect({ next: log, error: errorLog, complete: completeLog })),
    catchError(errorHandler)
  );

it("正常系", () => {
  const marble = "-a-b-c|";

  const vales = {
    a: "aa",
    b: "bb",
    c: "cc"
  };

  const expectedVales = {
    a: "aax",
    b: "bbx",
    c: "ccx"
  };

  new TestScheduler(deepStrictEqual).run(({ hot, expectObservable }) => {
    const input$ = hot(marble, vales);
    expectObservable(epicLike(input$)).toBe(marble, expectedVales);
  });
});

it("異常系", () => {
  const fun = (p: Observable<string | any>) =>
  p.pipe(
    finalize(() => console.log("finalize")),
    delay(1000),
    map(identity),
    catchError(() => throwError("yabai X"))
  );
  const l = ["a", "b", "c"];
  const data = [of(...l), throwError({ message: "throwError" })];
  const resources$ = concat(...data);

  fun(resources$).subscribe(
    r => expect(r).toBe(l.shift()),
    e => expect(e).toBe('yabai X'),
    () => console.log("fix")
  );
});
