const fs = require('fs');
const runNpmInit = require('../scripts/runNpmInit');

const options = {
  path: './',
  author: 'test-user',
  description: 'test project for architemplate',
  license: 'GNU',
  version: '0.1.0',
  main: 'index.js',
  'use jest': 1,
  git: {
    'use git': 1,
    'git url': '',
  },
};

describe('runNpmInit', () => {
  test('runNpmInit should create a package.json in the specified path (if provided).', () => {
    const file = runNpmInit(options);

    file.then((val) => {
      expect(val).toBe(`package.json has been written to ${options.path}`);
    }).catch(err => expect(err).toBe(err));
  });

  test('runNpmInit\'s created package.json, should match the options passed in.', () => {
    delete options.git;
    const file = runNpmInit(options);

    return file.then(() => {
      fs.readFile(`${options.path}/packageX.json`, 'utf8', (err, results) => {
        if (err) {
          expect(err).toBe(err);
        }

        const document = JSON.parse(results);
        expect(document.author).toBe(options.author);
      });
    });
  });

  test('runNpmInit should throw if the file cannot be created.', () => {
    Object.assign(options, { path: 'R:/invalid-_X_X_X_path' });
    const file = runNpmInit(options);

    return file.catch(err => expect(err).toBe(err));
  });

  test('runNpmInit should create the directory if it does not exist already.', () => {
    Object.assign(options, { path: '../invalid-path' });
    const file = runNpmInit(options);

    return file
      .then((buffer) => {
        expect(buffer).toBe(`package.json has been written to ${options.path}`);
      });
  });
});
