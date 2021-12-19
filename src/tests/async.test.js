//function returning a promise
const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(a < 0 || b < 0){
                reject("Numbers cannot be negative")
            }

            resolve(a + b)
        }, 2000)
    })
}

describe("Testing Asynchronous code", () => {
    // test("Async test demo", (done) => {
    //     setTimeout(() => {
    //         expect(2).toBe(1);
    //         done()
    //     }, 2000)        
    // })

    test("testing add function that waits 2s before adding numbers", (done) => {
        add(2, 3).then((sum) => {
            expect(sum).toBe(5);
            done();
        })
    })

    test('Should add two numbers using async/await', async() => {
        const sum = await add(10, 20)
        expect(sum).toBe(30);
    })
})