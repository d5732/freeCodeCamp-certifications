require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const dns = require("dns");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const store = new Map();
let currentIdx = 0;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));
app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

app.listen(port, function () {});

function isValidURL(url) {
    const URLRegEx =
        /https?:\/\/(www.)?[a-z0-9@:%._\+~#=-]{2,256}\.[a-z]{2,6}\b([-a-z0-9@:%_\+.~#?&//=]*)/i;
    return URLRegEx.test(url);
}
function trimURL(url) {
    const domainRegEx =
        /https?:\/\/(www.)?[a-z0-9@:%._\+~#=-]{2,256}\.[a-z]{2,6}/gi;
    const protocolRegEx = /https?:\/\//gi;
    domainRegEx.test(url);
    protocolRegEx.test(url);
    return url.slice(protocolRegEx.lastIndex, domainRegEx.lastIndex);
}

function shortenHandler(req, res) {
    let { url } = req.body;
    if (!isValidURL(url)) {
        return res.json({ error: "Invalid URL" });
    }
    dns.lookup(trimURL(url), (err) => {
        if (err) {
            return res.json({ error: "Invalid Hostname" });
        }
        store.set(url, ++currentIdx);
        store.set(currentIdx, url);
        res.json({ original_url: url, short_url: currentIdx });
    });
}
app.post("/api/shorturl", shortenHandler);

function redirectHandler(req, res) {
    let { idx } = req.params;
    idx = parseInt(idx);
    res.redirect(store.get(idx));
}
app.get("/api/shorturl/:idx", redirectHandler);
