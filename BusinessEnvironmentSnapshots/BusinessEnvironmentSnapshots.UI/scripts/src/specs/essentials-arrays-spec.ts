import ea = require('essentials/array');


describe('arrays', function() {
    describe('map', function() {
        
        it('works with values', function() {
            var input = ['a', 'b', 'c'];
            expect(
                ea.map(input, value => value.toUpperCase())
            ).toEqual(
                ['A', 'B', 'C'],
                "['a', 'b', 'c'] => ['A', 'B', 'C']"
            );
            expect(input).toEqual(['a', 'b', 'c'], 'Map should not mutate input.')
        });

        it('works with empty array', function() {
            expect(
                ea.map([], value => { throw new Error(); })
            ).toEqual([], "[] => []");
        });

    });
});