const express=require('express');
const app = express();

const fs = require('fs');
const mysql = require('mysql');
const db = mysql.createConnection({
  host: "prices-db.mysql.database.azure.com",
  user: "george",
  password: "priceWatch1",
  database: "prices",
  port: 3306,
  ssl: {ca: fs.readFileSync("../certs/DigiCertGlobalRootCA.crt.pem")}
});
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySql!");
});

const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/chains', (req, res) => {
  const sql = "SELECT id, name FROM prices.chains"
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

app.get('/chain/:chainId', (req, res) => {
  const chainId = req.params['chainId'];
  const sql = "SELECT id, name FROM prices.chains " +
              `WHERE id=${chainId};`
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

app.get('/chain/:chainId/subchains', (req, res) => {
  const chainId = req.params['chainId'];
  const sql = "SELECT id, name FROM prices.subchains " +
              `WHERE chain=${chainId};`
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

/* find the price of a specific product */
app.get('/item/:itemName', (req, res) => {
  const itemName = req.params['itemName'];
  const sql = "SELECT name, id, unit_qty FROM prices.items " +
      `WHERE name='${itemName}';`
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
})

/* using for 'city' autocomplete field */
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
  const sql = "SELECT name, address FROM prices.Stores " +
      `WHERE city='${city}';`
  console.log(sql)
  db.query(sql, function (err, result) {
    console.log("Result: " + JSON.stringify(result));
    if (err) throw err;
    res.send(JSON.stringify(result));  
  });
})


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});