const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');

/*these are the endpoints the router will depend on
1. Get all tasks (GET)
2. Create a new task (POST)
3. Delete a Task(DELETE)
4. Add a new user (POST)
*/


router.post('/register' , async (req, res) => {
    const { username, password } = req.body;
    try{
      const userDocs = new Users({username:username, password: password, tasks: []})
        await userDocs.save();

        res.status(200).send({username});  
    } catch(error){
        res.status(400).send({error: 'req body should carry the username and password'})
    }
    
});

router.post('/login', (req, res) => {
    passport.authenticate('local', {session: false}, (error, user) => {
        if(error || !user) {
            res.status(400).json({error});
        }
         const payload = {
             username: user.username,
             expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
         };

         req.login(payload, {session: false}, (error) => {
             if(error){
                 res.status(400).send({error});
             }

             const token = jwt.sign(JSON.stringify(payload), 'top_secret');
             res.cookie('jwt', token, {httpOnly: true, secure: true});
             res.status(200).send({username});
         })
    })(req, res);
});

router.get('/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { user } = req;

    res.status(200).send({ user });
});

module.exports = router;