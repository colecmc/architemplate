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

  return lastVal && lastVal.label;
}

function closeReadLine(collection) {
  rl.close();
  console.log('collection', collection);
}

/**
 * @todo Move logic into a separate function. Use a Map
 * @todo populate collection. It starts off empty and needs to be filled with 'items'
 * @param item
 * @param collection
 */
function loop(item, collection) {
  if (item.value) {
    const question = getQuestion(item);

    if (question) {
      rl.question(question, (answer) => {
        if (question.includes('use default') && ['Y', 'y', 'yes', 'Yes'].some(record => answer === record)) {
          closeReadLine(collection);
        } else {
          collection.reduce((a, b) => Object.assign(item, { value: answer }), {});
          loop(monitor.next(), collection);
        }
      });
    }
  } else if (item.done) {
    closeReadLine(collection);
  }
}

loop(monitor.next(), []);
