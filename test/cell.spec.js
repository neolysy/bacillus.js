describe('Class Cell', function() {
    var cell;

    beforeEach(function() {
        cell = new Cell();
    });

    it('Should return cell', function() {
        expect(cell.move() instanceof Cell).toBeTruthy();
    });
});