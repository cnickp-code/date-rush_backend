const xss = require('xss');
const bcrypt = require('bcryptjs');
const regexp_password = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const regexp_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const UsersService = {
    verifyPassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters';
        }
        if (password.length > 72) {
            return 'Password must be shorter than 72 characters';
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return `Password must not start or end with empty spaces`;
        }
        if (!regexp_password.test(password)) {
            return `Password must contain 1 upper case, lower case, number, and special character`;
        }
        return null
    },
    verifyEmail(email) {
        if(!regexp_email.test(email)) {
            return 'Not a valid email';
        }
    },
    hasUserWithUserName(db, user_name) {
        return db('dr_users')
            .where({ user_name })
            .first()
            .then(user => !!user);
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('dr_users')
            .returning('*')
            .then(([user]) => user)
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12);
    },
    serializeUser(user) {
        return { 
            id: user.id,
            user_name: xss(user.user_name),
            email: xss(user.email),
            date_created: new Date(user.date_created)
        }
    }
}

module.exports = UsersService;