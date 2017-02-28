describe("deepEqual", function() {
    it("null == null", function () {
        assert.isTrue(Game.deepEqual(null, null));
    });
    it("same objects with same values (1 level)", function () {
        assert.isTrue(Game.deepEqual({a: 1, b: 2}, {a: 1, b: 2}));
    });
    it("same objects with different values (1 level)", function () {
        assert.isTrue(!Game.deepEqual({a: 2, b: 1}, {a: 1, b: 2}));
    });
    it("same objects with same values (2 level)", function () {
        assert.isTrue(Game.deepEqual({a: {c: 1}, b: 2}, {a: {c: 1}, b: 2}));
    });
    it("same objects with different values (2 level)", function () {
        assert.isTrue(!Game.deepEqual({a: {c: 2}, b: 1}, {a: {c: 1}, b: 2}));
    });
});

describe("getCollisionPosition", function() {
    it("empty matrix", function () {
        assert.equal(new Game.Field()._getCollisionPosition([
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null]
        ], 0, 0, 1), null);
    });

    it("collision in row", function () {
        assert.deepEqual(new Game.Field()._getCollisionPosition([
            [null, null, null, null, null, null, null, null, 2],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null]
        ], 0, 0, 2), {row: 0, col: 8});
    });

    it("collision in col", function () {
        assert.deepEqual(new Game.Field()._getCollisionPosition([
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [3, null, null, null, null, null, null, null, null]
        ], 0, 0, 3), {row: 8, col: 0});
    });

    it("collision in rectangle", function () {
        assert.deepEqual(new Game.Field()._getCollisionPosition([
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, 4, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [3, null, null, null, null, null, null, null, null]
        ], 0, 0, 4), {row: 2, col: 2});
    });

    it("nearbly collision", function () {
        assert.deepEqual(new Game.Field()._getCollisionPosition([
            [null, null, null, null, null, null, null, null, null],
            [null, null, 5, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, 5, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [3, null, null, null, null, null, null, null, null]
        ], 0, 0, 5), {row: 1, col: 2});
    });
});
