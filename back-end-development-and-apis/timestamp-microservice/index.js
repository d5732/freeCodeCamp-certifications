var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

function timeHandler(req, res) {
    const time = req.params.time;
    let d = new Date(time);
    if (d == "Invalid Date") {
        d = new Date(Number(time));
    }
    if (d == "Invalid Date") {
        res.json({ error: "Invalid Date" });
    } else {
        res.json({ unix: d.valueOf(), utc: d.toUTCString() });
    }
}
app.get("/api/:time", timeHandler);

function nowHandler(req, res) {
    const d = new Date();
    res.json({ unix: d.valueOf(), utc: d.toUTCString() });
}
app.get("/api/", nowHandler);

var listener = app.listen(process.env.PORT, function () {
    console.log("Your app is listening on port " + listener.address().port);
});
