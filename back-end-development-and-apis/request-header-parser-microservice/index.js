require("dotenv").config();
var express = require("express");
var app = express();

var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

function whoamiHandler(req, res) {
    const userAgent = req.get("user-agent");
    const ipAddress = req.socket.remoteAddress;
    const lang = req.headers["accept-language"];
    res.json({ ipaddress: ipAddress, language: lang, software: userAgent });
}
app.get("/api/whoami", whoamiHandler);

var listener = app.listen(process.env.PORT || 3000, function () {
    console.log("Your app is listening on port " + listener.address().port);
});
