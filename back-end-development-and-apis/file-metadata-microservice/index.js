const fs = require("fs");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

function deleteFileAfterAnalyse(path) {
    path = __dirname + "/" + path;
    fs.unlink(path, (err) => {
        if (err && err.code == "ENOENT") {
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            console.error("Error occurred while trying to remove file.");
        } else {
            console.info("File removed:", path);
        }
    });
}
function fileAnalyseHandler(req, res) {
    const { originalname, mimetype, size, path } = req.file;
    res.json({ name: originalname, type: mimetype, size });
    deleteFileAfterAnalyse(path);
}
app.post("/api/fileanalyse", upload.single("upfile"), fileAnalyseHandler);

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Your app is listening on port " + port);
});
