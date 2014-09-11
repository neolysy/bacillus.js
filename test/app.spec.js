describe('Environment module', function() {
    var env;

    beforeEach(function() {
        env = new Environment();
        //env.init();
    });

    it('Should return valid data', function() {
        expect(env.getDoc()).toBeNull();
    });
});