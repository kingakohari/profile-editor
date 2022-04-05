const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();

const dataLocation = path.join(`${__dirname}/../frontend/data/`);



function getFunction(req, res){
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
}

app.use(fileUpload());
app.use("/upload", express.static(`${__dirname}/../frontend/upload`));
app.use("/pub", express.static(`${__dirname}/../frontend/public`));

app.get("/", getFunction);

// If there is a profile.json, read the data from the file, if not, use an empty Array
let jsonData = [];
try {
    let data = fs.readFileSync(`${dataLocation}profile.json`, error => {
        if (error) {
            console.log(error);
        }
    });
    jsonData = JSON.parse(data);
} catch (error) {
    fs.writeFile(`${dataLocation}profile.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
}

const uploads = path.join(`${__dirname}/../frontend/upload/`);

app.post("/", (req, res) => {
    // Upload image
    const picture = req.files.picture;
    const answer = {};

    if (picture) {
        picture.mv(uploads + "profile.jpg", error => {
            return res.status(500).send(error);
        });
    }
    answer.pictureName = "profile.jpg";

    // Upload data from form
    const formData = req.body;
    formData.image_name = "profile.jpg";
    jsonData.push(formData);

    fs.writeFile(`${dataLocation}profile.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
    res.send(answer);
});

const port = 9000;
const ipAddress = `http://127.0.0.1:${port}`;
app.listen(port, () => {
    console.log(ipAddress)
});