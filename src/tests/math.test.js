const { calculateTip } = require('./math');

describe("Our Dummy Tests on random math", () => {
    test("It calculates tip correctly", () => {
        const tip = calculateTip(20);

        expect(tip).toBe(5)
    });

    test("Calculates tip with passed in value for tip percentage", () => {
        const tip = calculateTip(100, 0.10);

        expect(tip).toBe(10);
    })
})