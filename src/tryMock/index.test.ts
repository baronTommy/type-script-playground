import { request } from ".";

// mock を作る axios は これが呼ばれる
jest.mock("axios", () => ({
  get: () => {
    return new Promise(resolve => {
      resolve({ data: "I am mock" });
    });
  }
}));


describe("foo", () => {
  it("", async () => {
    const p = "https://jsonplaceholder.typicode.com/posts/1";
    const res = await request(p);
    expect(res.data).toBe("I am mock");
  });
});
