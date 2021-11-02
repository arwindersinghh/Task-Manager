const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
//Email sending function
const { sendEmail, getTasksOnly } = require('../emails/account');



// router.get('/', async(req, res) => {
//     try{
//         const tasks = await Task.find({});
//         res.send(tasks);
//     }
//     catch(e){
//         res.status(500).send();
//     }
// })

//If you wanted pagination and filtering client side, you would have 
//to manipulate the query string with the req.query parameter
//using properties like match, sort, etc
router.get('/', auth, async(req, res) => {
    try{
        const tasks = await Task.find({ 
            owner: req.user._id            
        });

        const myTasks = await getTasksOnly(tasks);        
        console.log(myTasks);
        sendEmail(req.user.email, myTasks);        
        res.send(tasks);
    }
    catch(e){
        res.status(500).send();
    }
})

router.get('/:id', auth, async(req, res) => {
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if(!task) {
            return res.status(404).send()
        }
        res.send(task);
    }
    catch(e){
        res.status(500).send();
    }
})

router.post('/', auth, async(req, res) => {
    const task = new Task ({
        ...req.body,
        owner : req.user._id
    })

    try{
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})

router.patch('/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    try {
        const task = await Task.findOne({ 
            _id: req.params.id, 
            owner: req.user._id
        });

        if(!task) {            
            res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update])

        await task.save();


        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            res.status(404).send()
        }
        
        res.send(task);

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;