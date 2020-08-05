const express = require('express');
const UsersService = require('./users-service');
const usersRouter = express.Router();

const bodyParser = express.json();

usersRouter
    .post('/', bodyParser, (req, res, next) => {
        const { password, user_name, email } = req.body;
        const fields = ['user_name', 'password', 'email'];

        for(const field of fields) {
            if(!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                });
            }
        }

        const passwordError = UsersService.verifyPassword(password);

        if(passwordError) {
            return res.status(400).json({ error: passwordError });
        }

        const emailError = UsersService.verifyEmail(email);

        if(emailError) {
            return res.status(400).json({ error: emailError });
        }

        UsersService.hasUserWithUserName(
            req.app.get('db'),
            user_name
        )
        .then(userBool => {
            if(userBool) {
                return res.status(400).json({
                    error: `Username already taken`
                });
            }

            return UsersService.hashPassword(password)
                .then(hashedPw => {
                    const newUser = {
                        user_name,
                        password: hashedPw,
                        email,
                        date_created: 'now()'
                    }

                    return UsersService.insertUser(
                        req.app.get('db'),
                        newUser
                    )
                    .then(user => {
                        res
                            .status(201)
                            .location(`/api/users/${user.id}`)
                            .json(UsersService.serializeUser(user))
                    })
                })
        })
        .catch(next);
    })

module.exports = usersRouter;
