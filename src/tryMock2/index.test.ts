import { foo, bar } from ".";

jest.mock('.', () => ({
  ...jest.requireActual('.'),
  foo: () => 'I am mock',
  baz: jest.spyOn
}));

describe("", () => {
  it("",  () => {
    expect(foo()).toBe('I am mock')
    expect(bar()).toBe('I am bar')
  });
});
