import getNthColor, {
  nAvailableColors,
} from '../../../../src/stores/colors/getNthColor';

context('getNthColor', () => {
  it('should have many colors', () => {
    expect(nAvailableColors).to.be.greaterThan(150);
  });

  it('should use all available colors', () => {
    const colors = new Set<string>();
    for (let i = 0; i < nAvailableColors; i += 1) {
      colors.add(getNthColor(i));
    }
    expect(colors.size).to.be.eq(nAvailableColors);
  });

  it('should reuse all available colors on overflow', () => {
    const colors = [];
    const colors2 = [];
    for (let i = 0; i < nAvailableColors; i += 1) {
      colors.push(getNthColor(i));
    }
    for (let i = 0; i < nAvailableColors; i += 1) {
      colors2.push(getNthColor(nAvailableColors + i));
    }

    expect(colors).to.have.ordered.members(colors2);
  });

  it('returns every color as hex string', () => {
    // exhaustive test might be to heavy, but since the number
    // of colors if not that huge it's ok considering runtime.
    // It also implicitly checks if every value is defined.
    for (let i = 0; i < nAvailableColors; i += 1) {
      expect(getNthColor(i)).to.match(/#[0-9a-fA-F]{6}/);
    }
  });
});
