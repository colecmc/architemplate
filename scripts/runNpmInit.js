const fs = require('fs');
const data = require('../config');

function keyFilter(container, disallowed) {
  return container && Object.keys(container)
    .filter(key => !disallowed.includes(key))
    .reduce((obj, key) => {
      const temp = obj;
      temp[key] = container[key];
      return temp;
    }, {});
}

module.exports = function runNpmInit(options) {
  const config = data(options);

  if (options.git) {
    Object.assign(config.repository, options.git);
  } else {
    Object.assign(config.repository, keyFilter(config.repository, ['repository']));
  }

  if (options['use jest']) {
    Object.assign(config.scripts, { test: 'jest' });
  } else {
    Object.assign(config.scripts, keyFilter(config.scripts, ['scripts']));
  }

  return new Promise((resolve, reject) => {
    const prepConfig = Object.entries(config)
      .map((item) => {
        const record = item[1];
        return {
          [record.key]: record.value,
        };
      })
      .reduce((a, b) => Object.assign(a, b), {});

    const packageJSON = JSON.stringify(keyFilter(prepConfig, ['path']), null, '\t');

    fs.readdir(options.path, { withFileTypes: true }, (readdirError) => {
      if (readdirError) {
        fs.mkdir(options.path, { recursive: true }, (mkdirError) => {
          if (mkdirError) {
            reject(mkdirError);
          }
        });
      }

      fs.writeFile(`${options.path}/packageX.json`, packageJSON, (writeFileError) => {
        if (writeFileError) {
          reject(writeFileError);
        }
        resolve(`package.json has been written to ${options.path}`);
      });
    });
  });
};
