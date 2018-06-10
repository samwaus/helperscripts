/**
 * This script copies table structure and data from a MySQL table to a DynamoDB table in it's basic form.
 * Feel free to alter according to your requirement.
 */

// Configure MySQL connection
let mysql = require('mysql');
let con = mysql.createConnection({
  host: 'localhost', // Add localhost or your mysql host name
  user: 'MYSQL_USER_NAME', // Add MySQL user name
  password: 'MYSQL_PASSWORD', // Add MySQL password
  database: 'MYSQL_DB_NAME', // Add MySQL database name
});

// Configure DynamoDB connection
let AWS = require('aws-sdk');
AWS.config.update({
  region: 'ap-southeast-2', // Add your AWS Region
  endpoint: 'http://localhost:8000', // This address can be used if you are using SAM local of AWS. Else replace with your endpoint
});

// Connect to MySQL database and retrieve data from the relevant table
con.connect(function(err) {
  // Check for errors
  if (err) throw err;
  console.log('Connected to MySQL!');

  // Modify this query string according to your requirement
  let queryString = 'SELECT * FROM YOUR_TABLE';

  // Query MySQL table
  con.query(queryString, function(err, results, fields) {

    // If there is a query error, throw it.
    if (err) throw err;

    // Load AWS Document Client to insert data into Dynamo DB
    let docClient = new AWS.DynamoDB.DocumentClient();

    // Set the DynamoDB table name
    let dynamoDbTable = 'YOUR_TABLE_NAME';

    // loop through each record and insert into mongodb
    for (let record of results) {

      /* If required, alter the field names of the table before inserting the record if you want to have different field names
      for DynamoDB table since the fields are created on the fly */

      let params = {
        TableName: dynamoDbTable,
        Item: record,
      };

      console.log('Adding a new record...');
      // Add the record to the table
      docClient.put(params, function(err, data) {
        if (err) {
          console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
        } else {
          console.log('Added item:', JSON.stringify(data, null, 2));
        }
      });
    }
  });
});
