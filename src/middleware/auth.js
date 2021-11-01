const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try{
        
        //use .replace method to remove "Bearer " off of the token value
        const token = req.header('Authorization').replace('Bearer ', '')
        
        const decoded = jwt.verify(token, 'max');
        

        //find a user with specific id, and token
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token  });
        
        if (!user) {
            //This alone is enough to trigger catch down below.
            throw new Error()
        }
        
        req.token = token;
        req.user = user;
        next();
    } catch(e) {        
        res.status(401).send({ error: "Please authenticate." })
    }    
}

module.exports = auth;