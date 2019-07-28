import { RxHR } from "@akanass/rx-http-request";
import { tap } from "rxjs/operators";
import { Observer } from "rxjs";

function fetData() {
  return RxHR.get("https://api.zipaddress.net/")
    .pipe(
      tap({
        next: () => console.log("ok"),
        error: () => console.log("error"),
        complete: () => console.log("complete")
      })
    )
    .subscribe();
}

it("aa", () => {
  expect(true).toBe(true)
});
