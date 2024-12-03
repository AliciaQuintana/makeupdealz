let { MongoClient } = require("mongodb");
let uri = "mongodb://localhost:27017";
let client = new MongoClient(uri);

let express = require("express");
let path = require("path");

let https = require("https"); 
let fs = require("fs"); 
let app = express();
let port = 443; 


app.use(express.static("www"));
app.use(express.json());


const sslOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};


https.createServer(sslOptions, app).listen(port, function () {
  console.log(`Secure HTTPS server is running at https://localhost:${port}`);
});


app.get("/", function (req, res) {
  res.send("Welcome to MakeupDealz! The server is running securely over HTTPS.");
});


app.get("/helloworld", function (req, res) {
  res.send("Hello World: Alicia Quintana!");
});


app.get("/retrieve", function (req, res) {
  async function run() {
    try {
      await client.connect();
      const database = client.db("app");
      const table = database.collection("makeup");
      const query = {};
      const rows = await table.find(query);
      res.send(JSON.stringify(await rows.toArray()));
    } finally {
      await client.close();
    }
  }
  run();
});


app.get("/api/makeup", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("app");
    const table = database.collection("makeup");
    const query = {};
    const rows = await table.find(query).toArray();
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving makeup items:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
  }
});


app.get("/retrieve-one/:userid", function (req, res) {
  async function run() {
    try {
      await client.connect();
      const database = client.db("app");
      const table = database.collection("makeup");
      const query = { userid: parseInt(req.params.userid) };
      const row = await table.findOne(query);
      res.send(JSON.stringify(row));
    } finally {
      await client.close();
    }
  }
  run();
});