const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs');
let filePath;
let allData;

let upload = (req, res) => {
    console.log('at upload endpoint');
    var form = new IncomingForm();
    form.on('file', (field, file) => {
        // Do something with file
        filePath = file.path;
        console.log('here!');
        console.log(file.path);
        console.log(file);
        fs.readFile(file.path, (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(data);
                allData = data;
                fs.writeFile("./client/src/public/data.csv", data, () => {
                    console.log('finished writing3');
                })
            }
        });
    })
    form.on('end', () => {
        console.log('ended');
        res.json();
    })
    form.parse(req);
}

let getUpload = (req, res) => {
    res.status(200).json(filePath).end();
}

module.exports = {upload, getUpload};