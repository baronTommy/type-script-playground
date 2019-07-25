import { of, throwError, concat } from "rxjs";
// Operators とは Observable に対してフィルターをかけるなど値を加工するためのメソッド群
import { map, catchError, tap } from "rxjs/operators";

function log(msg: string) {
  console.log(msg);
}

function errLog() {
  log("errLog: ng");
}

function completeLog() {
  log("complete");
}

function addToEnd(p: string) {
  return (base: string) => base.concat(p);
}

function errorHandler(p: string) {
  return of(p, "errorHandler");
}

const data = [
  of("a", "b", "c"),
  throwError({message: "throwError"}),
  of("x", "y", "z") // 上で throwErrorしているのでここは流れない
];

it("rxjs pipeにcatchError有り of を利用して Observableを返す", () => {
  // Observables 非同期データソース ( ストリーム ) を表すクラスで、言葉通り Observe ( 観察 ) する何か
  const resources$ = concat(...data);

  // pipe で事前に下ごしらえをして subscribeで流す
  resources$
    .pipe(
      map(addToEnd("111")),
      tap({
        // 新しい値が流れてきたときに
        next: log,
        // ストリームの途中でエラーが発生したときに
        error: error => {
          log(error.message);
        },
        // 全ての値が流れきってストリームが終了した時
        complete: () => console.log('on complete')
      }),
      catchError(errorHandler)
    )
    .subscribe(); // subscribe することで値が流れる
});
