const jwt = require('jsonwebtoken');
const obj = require('../nodemon.json')

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.body.token, obj.env.JWT_KEY);
        req.userData = decoded;
        next();
    }   catch (error) {
        return res.status(401).json({ 
            message: 'Auth failed'
        });
    }
}