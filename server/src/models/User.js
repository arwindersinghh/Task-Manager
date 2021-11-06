const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require ('bcryptjs')
//JWT-JsonWebToken : Used for authentication.
const jwt = require('jsonwebtoken');
const Task = require('./Task');

//using userSchema allows us to take advantage of middleware.
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }                
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0){
                throw new Error("Age cannot be negative");
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//Setting up logic to find a Users tasks.
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '._id',
    foreignField: 'Owner'
})

//This code checks users credentials to validate logging in.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
}


//Public data for a user.
//Using .toJson automatically calls this function when returning user.
//when u attach .toJSON to a function, it automatically calls the .toJSON before returning.
//EXAMPLE : 
//const pet = { name : "Gor" }
//pet.toJSON = function() { return {} }
//console.log(JSON.stringify(pet)) // result is {}


userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject;
}


//Generates JWT token to authenticate user (for example to delete one of their own tasks.)
//use userSchema.methods for methods on the instance/individual user
//userSchema.statics for the actual uppercase User MODEL.
userSchema.methods.generateAuthToken = async function() {    
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    
    
    user.tokens = user.tokens.concat({ token });
    
    
    await user.save();    

    return token;

}

//taking advantage of middleware.
//Two methods accessible to us for middleware
//Pre(Before an event), or Post(after)
//Takes 2 arguments (Name of event, function to run)
//NEEDS TO BE STANDARD FUNCTION, "THIS" binding is CRUCIAL!
//next is provided to our function in our second arg
//Next is provided when we are done at the end of the function.

//This code is ran before a user is saved.
//Because we are doing asynchronous actions, we need to use next to indicate we are done
//if Next isn't called it will hang forever thinking we are still running some code before
//we save the user, and we will not save the user.

//THIS CODE HASHES THE PLAIN TEXT PASSWORD***
userSchema.pre('save', async function (next) {
    const user = this;
    

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

//Delete user tasks when user is removed.
userSchema.pre('remove', async function(next) {
    const user = this;

    await Task.deleteMany({ owner: user._id })

    next();
});

//pass in the name for the collection, as well as the
//object properties
const User = mongoose.model('User', userSchema)

module.exports = User;