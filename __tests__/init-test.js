const init = require('../scripts/init');

describe('init', () => {
  test('init should start the process with defaults.', () => {
    expect(init()).toBe('defaults');
  });

  test('init should start the process with customizations.', () => {
    expect(init(1)).toBe('customize');
  });
});
