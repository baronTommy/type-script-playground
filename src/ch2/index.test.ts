describe("ch2", () => {

  it("unknown", () => {
    // unknown 型安全な any
    const x: unknown = "unknown";

    // このタイミングだと lengthは NG
    // expect(x.length).toBe('unknown'.length)
    if (typeof x === "string") {
      // ここで 型を確定 させると length OK
      expect(x.length).toBe("unknown".length);
    }
  });

  it("nevar", () => {
    // voidとの違いは、関数が正常に終了して値が返ってくるということが無い
    const x = (p: boolean): never | string => {
        if (p) {
            return 'OK'
        }
        throw new Error('never')
    }
    expect(x(true)).toBe('OK')

    // これが void
    const x2 = (): void => {
        return
    }
    expect(x2()).toBe(undefined)
  });

  it('Intersection Type', () => {
    type User = {
        name: string
        age: number
    }

    type Robot = {
        switch: 'on' | 'off'
    }

    type Humanoid = User & Robot

    const droid: Humanoid = {
        name: 'どろいど',
        age: 0,
        switch: 'on'
    }

    expect(droid).toBeDefined()
  })

  it('Union Type', () => {
    const v: number | string = '123'
    expect(v).toBeDefined()

    const v2: (number | string)[] = [1, '2', 3]
    expect(v2).toBeDefined()
  })

  it('Literal Type', () => {
    const v: 'a' | 'b' = 'a'
    expect(v).toBeDefined()
  })

  it('Numeric Literal Type', () => {
    const v: 0 | 5 = 5
    expect(v).toBeDefined()
  })
});
