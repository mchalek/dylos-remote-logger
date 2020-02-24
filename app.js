const USB_FILENAME = '/dev/ttyUSB0';

const readline = require('readline');
const fs = require('fs');
const {BigQuery} = require('@google-cloud/biquery');

const readInterface = readline.createInterface({
    input: fs.createReadStream(USB_FILENAME),
    console: false
});

const DATASET_ID = 'my_dataset';
const TABLE_ID = 'my_table';

async function insertRowsAsStream(rows) {
  // Inserts the JSON objects into my_dataset:my_table.

  // Create a client
  const bigqueryClient = new BigQuery();

  // Insert data into a table
  await bigqueryClient
    .dataset(DATASET_ID)
    .table(TABLE_ID)
    .insert(rows);
  console.log(`Inserted ${rows.length} rows`);
}

function buildRow(line) {
    const [count_05_str, count_25_str] = line.trim().split(',');

    const timestamp = Date.now();

    return {
        'timestamp': timestamp,
        'count_05': Number(count_05_str),
        'count_25': Number(count_25_str),
    }
}

function processLine(line) {
    console.log(line);
    insertRowsAsStream([
        buildRow(line),
     ]);
}

readInterface.on('line', processLine);
