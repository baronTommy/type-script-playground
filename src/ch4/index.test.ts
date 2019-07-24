it("readonly", () => {
    type User = {
        readonly id: number
        name: string
    }

    const user: User = {
        id: 1,
        name: 'foo'
    }
    
    // エラー
    // user.id = 10

    user.name = 'bar'

    expect(user.name).toBe('bar')
});

it("一括でreadonly Readonly", () => {
    type User = {
        id: number
        name: string
    }

    const user: Readonly<User> = {
        id: 1,
        name: 'foo'
    }
    
    // エラー
    // user.id = 10
    // user.name = 'bar'

    expect(user.name).toBe('foo')
});

it("一括でreadonly Object.freeze", () => {
    type User = {
        id: number
        name: string
    }
    
    const user: User = Object.freeze({
        id: 1,
        name: 'foo'
    })
    
    // エラー になるが  実行時エラーか...
    // user.id = 10
    // user.name = 'bar'
    expect(user.name).toBe('foo')
});

it("as const", () => {
    const A = 'ABC' as const
    let B = A
    // B = '' // エラー
    // B = 'ABC' // OK
    expect(B).toBe(A)
});

it("as const その2", () => {
    function increment() {
        return {type: 'INCREMENT'}
    }

    function decrement() {
        return {type: 'DECREMENT'} as const
    }

    const a = increment()
    // 再代入可能なので うーん
    a.type = 'foo'
    expect(a.type).not.toBe(increment().type)

    const b = decrement()
    // 再代入不可 なので いいね
    // b.type = 'foo' // エラー
    expect(b.type).toBe(decrement().type)
});

it("Objectを保護したい", () => {
    const x = {
        id: 1
    } as const
    // x.id = 1 // エラー
    
    const y: Readonly<any> = {
        id: 1
    }
    // y.id = 1 // エラー

    expect(x.id).toBe(y.id)
});


it("is 型", () => {
    function isString(myValue: any): myValue is string{
        return typeof myValue === 'string'
    }
    
    function lengthOrDefault(v: any, defalut = 0){
        if(isString(v)){
            // any から string に 絞り込みが可能
            // myValue is string のおかげ
            // エラーにならない
            return v.length
        }
        return defalut
    }

    expect(lengthOrDefault(null)).toBe(0)
    expect(lengthOrDefault('abc')).toBe(3)
});
