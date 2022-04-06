const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

const port = 9000;


const uploads = path.join(`${__dirname}/../frontend/upload/`);

function getFunction(req, res){
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
}

app.get("/", getFunction);

app.use(fileUpload());
app.use("/upload", express.static(`${__dirname}/../frontend/upload`));
app.use("/pub", express.static(`${__dirname}/../frontend/public`));

const dataLocation = path.join(`${__dirname}/../frontend/data/profile.json`);


app.get("/", (req, res, next) => {                 
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
}) 



app.get("/profiles", (req, res) => {
    
    res.sendFile(path.join(`${dataLocation}`)); 
})

// If there is a profile.json, read the data from the file, if not, use an empty Array
let jsonData = [];
try {
    let data = fs.readFileSync(`${dataLocation}`, error => {
        if (error) {
            console.log(error);
        }
    });
    jsonData = JSON.parse(data);
} catch (error) {
    fs.writeFile(`${dataLocation}`, JSON.stringify(jsonData), (error) => {
        if (error) {
            console.log(error);
        }
    });
}




app.post("/", (req, res) => {


/* const picture = req.files.picture;
picture.mv(uploads + "profile.jpg") */

    fs.readFile(`${dataLocation}`, (error, data) => {

        if (error) {
            console.log(error);
            res.send("Error reading users file")
        } else {

            const users = JSON.parse(data)
            console.log(req.body);
            users.push(req.body)
            
            fs.writeFile(`${dataLocation}`, JSON.stringify(users), error => {
                if (error) {
                    console.log(error);
                    res.send("Error writing users file")
                }
            })
            /* res.send(picture) */
            res.send(req.body)
        }
    })
})


const ipAddress = `http://127.0.0.1:${port}`;
app.listen(port, () => {
    console.log(ipAddress)
});