const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
//used to serve images
const multer = require('multer');
//used to modify image and image strings
const sharp = require('sharp');



router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch(e) {
        res.status(500).send();
    }
})

router.get('/me', auth, async (req, res) => {
    res.send(req.user);
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {                        
        res.status(400).send(e);
    }
})

router.post('/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/logout/all', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/', async (req, res) => {
    const user = new User(req.body);
    try{        
        console.log(req.headers);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch(e) {
        res.status(400).send(e);
    }
})

router.patch('/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!"})
    }

    try {
        //Using User.findByIdAndUpdate bypasses middleware, so had to refactor.
        const user = req.user;
    
        
        updates.forEach((update) => user[update] = req.body[update]);

        await user.save();
        
        res.send(user);    
    } catch(e) {
        res.status(400).send(e);
    }
})

router.delete('/me', auth, async (req, res) => {
    try {
        
        await req.user.remove()
        res.status(200).send(req.user);

    } catch(e) {
        res.status(500).send(e);
    }
})
//To handle file uploads
const upload = multer({
    //folder image will get saved to
    // dest: 'avatars',
    //max file size someone is allowed to upload
    limits: {
        //Number in bytes. (below is 1 megabyte)
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {        
        //Two ways to call the Callback.
        //Pass in the error, or allow the upload
        // cb(new Error("File must be a PDF"))
        // cb(undefined, true)
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Must upload an image!"))
        }

        cb(undefined, true);

    }
})




//we want to check if they are authenticated first, so pass in auth first.
//passing in a function as the last argument in this router.post will
//call that function to handle errors instead of sending us back a bunch of
//other unrelevant data we just get the error like this below.
router.post('/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    //contains a buffer of all binary data for the file that user uploaded
    //req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/me/avatar', auth, async (req, res) => {
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send();
})

router.get('/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router;


//DIFFERENCE BETWEEN HASHING AND ENCRYPTING
//HASHING IS ONE WAY NON REVERSIBLE
//ENCRYPTING CAN BE REVERSED
