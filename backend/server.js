
const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());

const port = 9000;

const pathToFrontend = `${__dirname}/../frontend`


app.get("/", (req, res, next) => {                
    res.sendFile(path.join(`${pathToFrontend}/index.html`));
}) 

app.get("/api/v1/profile", (req, res) => {
    console.log("Profile editor running");
    res.sendFile(path.join(`${pathToFrontend}/profile.json`));
})

app.use(fileUpload());
app.use("/upload", express.static(`${__dirname}/../frontend/upload`));
app.use("/pub", express.static(`${__dirname}/../frontend/public`));


// If there is a data.json, read the data from the file, if not, use an empty Array
let jsonData = [];
try {
    let data = fs.readFileSync(`${pathToFrontend}/profile.json`, error => {
        if (error) {
            console.log(error);
        }
    });
    jsonData = JSON.parse(data);
} catch (error) {
    fs.writeFile(`${pathToFrontend}/profile.json`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
}

const uploads = path.join(`${__dirname}/../frontend/upload/`);

app.post("/profile/new", (req, res) => {
    // Upload image
    const picture = req.files.picture;

    if (picture) {
        picture.mv(uploads + "profile.jpg", error => {
            return res.status(500).send(error);
        });
    }

    // Upload data from form
    const formData = req.body;
    formData.image_name = "profile.jpg"; 

    fs.writeFile(`${pathToFrontend}/profile.json`, JSON.stringify(formData), (error) => {
        if (error) {
            console.log(error);
        }
    });
    res.send(formData); // profile.json will have user data overwritten everytime user updates
});

app.delete('/delete', (req, response) => {

    const removePath = uploads + "profile.jpg"
    console.log(removePath);
    try {
        fs.unlinkSync(removePath);
    } catch (err) {
        console.error(err);
    }

    fs.writeFile(`${pathToFrontend}/profile.json`, "[]", (error) => {
        if(error) {
            console.log(error);
            res.send("Error in profile.json");
        }
    });

    response.send("Your profile has been deleted");
});


app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
})
