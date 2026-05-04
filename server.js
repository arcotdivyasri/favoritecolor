const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const url = "mongodb://divya:hello123@ac-w1ebqtp-shard-00-00.wjmianc.mongodb.net:27017,ac-w1ebqtp-shard-00-01.wjmianc.mongodb.net:27017,ac-w1ebqtp-shard-00-02.wjmianc.mongodb.net:27017/divyadb?ssl=true&replicaSet=atlas-kw5dtn-shard-0&authSource=admin&appName=Cluster1";
const client = new MongoClient(url);

let db;
async function connectDB() {
    await client.connect();
    db = client.db("divyadb");
    console.log("DB Connected");
}
connectDB();

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await db.collection("sodi").findOne({ username, password });
    if (user) {
        res.redirect(`/color.html?username=${username}&password=${password}`);
    } else {
        res.send("Invalid Username or Password");
    }
});

app.post("/saveColor", async (req, res) => {
    const { username, password, favcolor } = req.body;
    const data = { username, password, favcolor };

    await db.collection("sodi").insertOne(data);

    let arr = [];
    if (fs.existsSync("users.json")) {
        arr = JSON.parse(fs.readFileSync("users.json"));
    }
    arr.push(data);
    fs.writeFileSync("users.json", JSON.stringify(arr, null, 2));

    res.send("Saved Successfully");
});

app.listen(2000, () => console.log("Server running on port 2000"));