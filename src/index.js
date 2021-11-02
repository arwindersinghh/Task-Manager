const express = require('express');
//Just requiring the file makes sure the file runs
require('./db/mongoose');
const User = require('./models/User');
const Task = require('./models/Task');



const app = express();


const port = process.env.PORT;

//Middleware
// const multer = require('multer');
// const upload = multer({
//     //value should be name for the folder where all our images will be stored that
//     //we download from client
//     dest: 'images'
// })
// //this request from the client to store our image is not passed in on the req.body, but passed in as Form Data
// //upload.single will look for a key value pair, key being whatever is passed in
// //in our case, 'upload' : 'file.jpg'
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })
//This will save the file as a string, if u append .jpg it will load the picture.


app.use(express.json());
app.use('/api/users', require('./api/users'));
app.use('/api/tasks', require('./api/tasks'));









app.listen(port, () => {
    console.log("listening on " + port);
})