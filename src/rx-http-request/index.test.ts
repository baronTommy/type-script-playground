import { RxHR, RxHttpRequestResponse } from "@akanass/rx-http-request";
import { tap } from "rxjs/operators";
import {Observable, of} from 'rxjs'

const isSuccess = (code: number) => code === 200
const fetchZipAddress = () =>  RxHR.get("https://api.zipaddress.net/")

const fetData = (f: Observable<RxHttpRequestResponse>) => {
  return f.pipe(
    tap({
      next: p => {
        console.log(isSuccess(p.response.statusCode))
      },
      error: e => console.log(e),
      complete: () => console.log("complete")
    })
  );
}

it("aa", done => {
  const end = () => done()

  fetData(of()).subscribe(
    end, end, end
  );

  expect(true).toBe(true);
});
