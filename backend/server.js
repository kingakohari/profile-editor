const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

const port = 9000;

const fFolder = `${__dirname}/../frontend`

const uploads = path.join(`${__dirname}/../frontend/upload/`);

function getFunction(req, res){
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
}

app.use(fileUpload());
app.use("/upload", express.static(`${__dirname}/../frontend/upload`));
app.use("/pub", express.static(`${__dirname}/../frontend/public`));

app.get("/", getFunction);

app.get("/", (req, res, next) => {                 
    res.sendFile(path.join(`${fFolder}/index.html`));
}) 



app.get("/api/v1/users", (req, res) => {
    console.log("Request received for users endpoint.");
    res.sendFile(path.join(`${fFolder}/profile.json`)); 
})



app.post("/", (req, res) => {

/*     // Upload image
    const picture = req.files.picture;
    const answer = {};

    if (picture) {
        picture.mv(uploads + "profile.jpg", error => {
            return res.status(500).send(error);
        });
    }
    answer.pictureName = "profile.jpg";

    fs.readFile("../frontend/profile.json", (error, data) => {

        if (error) {
            console.log(error);
            res.send("Error reading profile data")
        } else {
            const users = JSON.parse(data)
            console.log(req.body);
            users.push(req.body)
            
            fs.writeFile("../frontend/profile.json", JSON.stringify(users), error => {
                if (error) {
                    console.log(error);
                    res.send("Error writing users file")
                }
            })
            res.send(answer)
        }
    })
}) */

    fs.readFile("../frontend/users.json", (error, data) => {
        if (error) {
            console.log(error);
            res.send("Error reading users file")
        } else {
            const users = JSON.parse(data)
            console.log(req.body);
            users.push(req.body)
            
            fs.writeFile("../frontend/users.json", JSON.stringify(users), error => {
                if (error) {
                    console.log(error);
                    res.send("Error writing users file")
                }
            })
            res.send(req.body)
        }
    })
})


const ipAddress = `http://127.0.0.1:${port}`;
app.listen(port, () => {
    console.log(ipAddress)
});