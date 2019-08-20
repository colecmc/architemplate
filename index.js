const readline = require('readline');
const config = require('./config');
const data = require('./scripts/options');

const options = config(data);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function* proctor(list) {
  let index = 0;
  while (index < list.length) {
    yield list[index];
    index += 1;
  }
}

const monitor = proctor(Object.entries(options));

function getQuestion(item) {
  const record = [].concat(item);
  const record1 = record.shift && record.shift();
  const val = record1 && record1.value;
  const lastVal = val.pop && val.pop();

  return lastVal;
}

/**
 * Create an object of indexed keys from an array.
 * @param {Array} collection
 */
function objectFrom(collection) {
  const object = {};

  collection.forEach((item, index) => {
    console.log({ item });
    Object.entries(item).forEach((record) => {
      Object.assign(object, { [index]: item[record.shift()] });
    });
  });

  return object;
}

function closeReadLine(collection) {
  rl.close();
  console.log('collection', objectFrom(collection));
}

/**
 * @todo Move logic into a separate function. Use a Map
 * @todo populate collection. It starts off empty and needs to be filled with 'items'
 * @param item
 * @param collection
 */
function loop(item, collection) {
  if (item.value) {
    const query = getQuestion(item);
    const question = query.label;

    if (question) {
      rl.question(question, (answer) => {
        if (question.includes('use default') && ['Y', 'y', 'yes', 'Yes'].some(record => answer === record)) {
          closeReadLine(collection);
        } else {
//          console.log(objectFrom([query.key, { value: answer }]));
//          collection.reduce((a, b) => Object.assign(item, { value: answer }), {});
//          collection.push({ question, answer });
          collection.push(answer);
          loop(monitor.next(), collection);
        }
      });
    }
  } else if (item.done) {
    closeReadLine(collection);
  }
}

loop(monitor.next(), []);
