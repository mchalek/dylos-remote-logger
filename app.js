const USB_FILENAME = '/dev/ttyUSB0';

const readline = require('readline');
const fs = require('fs');
const {BigQuery} = require('@google-cloud/bigquery');

const readInterface = readline.createInterface({
    input: fs.createReadStream(USB_FILENAME),
    console: false
});

const DATASET_ID = '415k';
const TABLE_ID = 'dylos';

async function insertRowsAsStream(rows) {
  // Inserts the JSON objects into my_dataset:my_table.

  // Create a client
  const bigqueryClient = new BigQuery();
  console.log(`Inserting ${rows.length} rows into ${DATASET_ID}:${TABLE_ID}`);

  // Insert data into a table
  await bigqueryClient
    .dataset(DATASET_ID)
    .table(TABLE_ID)
    .insert(rows)
    .catch(function(err) {
        console.log(`Caught error: ${JSON.stringify(err)}`);
    })
  console.log(`Inserted ${rows.length} rows`);
}

function buildRow(line) {
    const [count_05_str, count_25_str] = line.trim().split(',');

    //const timestamp_micros = Date.now() * 1000;

    return {
        'timestamp': BigQuery.timestamp(Date.now()),
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
