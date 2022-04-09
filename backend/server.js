
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());

const port = 9000;

const fFolder = `${__dirname}/../frontend`
const dataLocation = path.join(`${__dirname}/../frontend/data/`);

app.get("/", (req, res, next) => {                
    res.sendFile(path.join(`${fFolder}/index.html`));
}) 

app.get("/api/v1/profile", (req, res) => {
    console.log("Request received for profile endpoint.");
    res.sendFile(path.join(`${fFolder}/profile.json`));
})

app.use(fileUpload());
app.use("/upload", express.static(`${__dirname}/../frontend/upload`));
app.use("/pub", express.static(`${__dirname}/../frontend/public`));


// If there is a data.json, read the data from the file, if not, use an empty Array
let jsonData = [];
try {
    let data = fs.readFileSync(`${dataLocation}images.json`, error => {
        if (error) {
            console.log(error);
        }
    });
    jsonData = JSON.parse(data);
} catch (error) {
    fs.writeFile(`${dataLocation}images.json`, JSON.stringify(jsonData), (error) => {
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

    fs.writeFile(`${dataLocation}images.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
    res.send(answer);
});


app.post("/profile/new", (req, res) => {
    fs.readFile("../frontend/profile.json", (error, data) => {
        if (error) {
            console.log(error);
            res.send("Error reading profile JSON")
        } else {
            const profile = JSON.parse(data)
            console.log(req.body);
            profile.push(req.body)
            
            fs.writeFile("../frontend/profile.json", JSON.stringify(profile), error => {
                if (error) {
                    console.log(error);
                    res.send("Error writing profile JSON")
                }
            })
            res.send(req.body)
        }
    })
})


app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
})
