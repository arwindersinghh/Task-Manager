const express = require('express');
const cors = require('cors');
//Just requiring the file makes sure the file runs
require('./db/mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const path = require('path');



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
const whitelist = ['http://localhost:3000', 'http://localhost:5000', 'https://arvy-task-manager.herokuapp.com/']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))
//app.use(cors());
if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
  }
app.use('/api/users', require('./api/users'));
app.use('/api/tasks', require('./api/tasks'));









app.listen(port, () => {
    console.log("listening on " + port);
})