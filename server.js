const express = require('express'); // import express
const app = express();

const fs = require('fs'); // file system
const mysql = require('mysql');
const db = mysql.createConnection({
  host: "prices-db.mysql.database.azure.com",
  user: "george",
  password: "priceWatch1",
  database: "prices",
  port: 3306,
  ssl: { ca: fs.readFileSync("./certs/DigiCertGlobalRootCA.crt.pem") }
});
db.connect(function callback(err) {
  if (err) throw err;
  console.log("Connected to MySql!");
});

const hostname = '127.0.0.1';
const port = 3000;

// for searching static files in public folder (for js, css, images)
app.use(express.static(__dirname + '/public'));

// app.get() is a function that tells the server what to do
// when a get request at the given route is called.
// It has a callback function (req, res)
// that listen to the incoming request req object
// and respond accordingly using res response object.

// return the main page of the application (static)
app.get('/', function (req, res) {
  // The send_file() function sends data from the file associated
  // with the open file handle over the connection associated with the socket.
  // A pointer to a socket file descriptor.
  res.sendFile(__dirname + '/public/index.html');
});

// return JSON (dynamic response)
app.get('/chains', (req, res) => {
  const sql = "SELECT id, name FROM prices.chains"
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    // send() Send a string response in a format other than JSON
    //        (XML, CSV, plain text, etc)
    // JSON.stringify() method converts JavaScript objects into strings.
    //         When sending data to a web server the data has to be a string.
    res.send(JSON.stringify(result));
  });
})

app.get('/chain/:chainId', (req, res) => {
  const chainId = req.params['chainId'];
  const sql = "SELECT id, name FROM prices.chains " + `WHERE id=${chainId};`
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

app.get('/chain/:chainId/subchains', (req, res) => {
  const chainId = req.params['chainId'];
  const sql = "SELECT id, name FROM prices.subchains " + `WHERE chain=${chainId};`
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

app.get('/chain/:chainId/subchain/:subchainId', (req, res) => {
  const chainId = req.params['chainId'];
  const subchainId = req.params['subchainId'];
  const sql = "SELECT id, `chain`, name FROM prices.subchains " +
    `WHERE chain=${chainId} AND id=${subchainId};`
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

app.get('/chain/:chainId/subchain/:subchainId/store/:storeId', (req, res) => {
  const chainId = req.params['chainId'];
  const subchainId = req.params['subchainId'];
  const storeId = req.params['storeId'];
  const sql = "SELECT id, `chain`, subchain, `type`, name, city, address, zipcode FROM prices.Stores " +
    `WHERE chain=${chainId} AND subchain=${subchainId} AND id=${storeId};`
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

/* using for autocomplete in 'city' field */
app.get('/cities', (req, res) => {
  const startWith = req.query['startWith'];
  const sql = `select distinct city from prices.stores where city like '${startWith}%'`;
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

/* get all stores in a specific city */
app.get('/stores', (req, res) => {
  const city = req.query['city'];
  const sql = "SELECT name, address FROM prices.Stores " + `WHERE city='${city}';`
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

/* using for autocomplete in 'item' field */
app.get('/item', (req, res) => {
  const itemStartWith = req.query['itemStartWith'];
  const sql = `select id, name from prices.items where name like '${itemStartWith}%' limit 10`;
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

/*
New Query:
SELECT price, name, city, address FROM prices.prices
INNER JOIN prices.stores ON chain_id and subchain_id and store_id
WHERE item_id='7290000099941''
Old Query:
const sql = "SELECT price, store_id FROM prices.prices " + `WHERE item_id='${itemId}';`
*/
/* get item's prices by item id */
app.get('/item/:itemId', (req, res) => {
  const itemId = req.params['itemId'];
  const sql = "SELECT price, name, city, address FROM prices.prices " +
    "INNER JOIN prices.stores ON chain_id and subchain_id and store_id " +
    `WHERE item_id='${itemId}';`
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

// starts a port and host
// making the localhost for the connections to listen to incoming requests from a client
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${process.env.PORT || port}/`);
});