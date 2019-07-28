it("Generics デフォルト値", () => {
    type Box<T = string> = {
        name: T
    }

    const strBox: Box = {name: ''}
    const numBox: Box<number> = {name: 1}

    expect(strBox.name).toBe('')
    expect(numBox.name).toBe(1)
});

it("Generics 制約", () => {
    type Box<T extends string | number> = {
        name: T
    }

    const strBox: Box<string> = {name: ''}
    const numBox: Box<number> = {name: 1}

    expect(strBox.name).toBe('')
    expect(numBox.name).toBe(1)
});

it("Generics 制約2", () => {
    type Item = {
        name: string
        price: number
    }

    const boxed = <T extends Item >(p: T) => ({
        value: p,
        newName: p.name.concat('xx')
    })

    const newName = boxed({name: 'foo', price: 123}).newName

    expect(newName).toBe('fooxx')
});

it("Generics 制約3", () => {
    const pick = <T, K extends keyof T>(p: T, k: K) => p[k]

    const userInfo = {
        name: 'foo',
        age: 50
    }

    expect(pick(userInfo, 'name')).toBe('foo')
});
