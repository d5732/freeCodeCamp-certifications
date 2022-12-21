const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const Store = require("./store.js");
const store = new Store();
//TODO: MongoDB approach

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

function createUserHandler(req, res) {
    const { username } = req.body;
    res.json(store.createUser(username));
}
function getAllUsersHandler(req, res) {
    res.json(store.getAllUsers());
}
app.route("/api/users").get(getAllUsersHandler).post(createUserHandler);

function createExercisesHandler(req, res) {
    const { _id } = req.params;
    const { date, duration, description } = req.body;
    res.json(store.createExercises(_id, date, duration, description));
}
app.post("/api/users/:_id/exercises", createExercisesHandler);

function getExercisesLogsHandler(req, res) {
    const { _id } = req.params;
    const { from, to, limit } = req.query;
    res.json(store.getExercisesLogsByUserId(_id, from, to, limit));
}
app.get("/api/users/:_id/logs", getExercisesLogsHandler);

const listener = app.listen(process.env.PORT || 3000, () => {});