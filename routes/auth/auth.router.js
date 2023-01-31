const express = require('express');
const { authService } = require('../../services/auth.service');
const HttpError = require('../../models/http-error.model');
const router = express.Router();


router.post('/login', (req,res,next) => {
    try {
        const { email, password } = req.body;

        if ( !email || !password) {
            return res.status(400).json({
                message: 'Bad Request',
            });
        }

        const token = authService.authUser( email, password );

        res.json({
            token,
        });
    } catch (e) {
        throw new HttpError(500, e.message);
    }
}); 


router.post('/profile', (req,res,next) => {
    try {
        const recievedToken = req.headers['authentication'];
        const token = recievedToken.substring(7); 
        const userprofile = authService.findUser(token);

        res.json({
            userprofile,
        });
    } catch (e) {
        throw new HttpError(500, e.message);
    }
});



module.exports = router; 
