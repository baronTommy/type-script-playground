function myName(): Promise<string> {
    return new Promise(r => r('foo'))
}

function myAge():Promise<number> {
    return new Promise(r => r(10))
}

it("Promise.allの型", async () => {
    function myData(): Promise<[string, number]> {
        return Promise.all([
            myName(),
            myAge()
        ])
    }

    expect(await myData()).toStrictEqual(['foo', 10])
});

it("Promise.raceの型", async () => {
    // Promise.race() - 複数のPromise関数を実行し、最初の結果を得る
    function myData(): Promise<string | number> {
        return Promise.race([
            myName(),
            myAge()
        ])
    }

    expect(await myData()).toBe('foo' || 10)
});
