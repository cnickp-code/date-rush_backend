const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'Crayzix',
            password: 'password1',
            email: 'nick@nick.com',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 2,
            user_name: 'Zixith',
            password: 'password2',
            email: 'carlo@carlo.com',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 3,
            user_name: 'Zero',
            password: 'password3',
            email: 'mark@mark.com',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 4,
            user_name: 'Bigbarrels',
            password: 'password4',
            email: 'mario@mario.com',
            date_created: '2029-01-22T16:28:32.615Z',
        },
        {
            id: 5,
            user_name: 'Liquid',
            password: 'password5',
            email: 'hayden@hayden.com',
            date_created: '2029-01-22T16:28:32.615Z',
        },
    ]
}

function makeDatesArray() {
    return [
        {
            id: 1,
            name: 'best date 1',
            user_id: 1,
            place_id: 'ChIJ7U-BHeuzwoARAvYAqFtEc2A',
            meal_id: '52906',
            meal_type: "In",
            drink_id: '14229',
            show_id: '32669',
            show_type: "Movie"
        },
        {
            id: 2,
            name: 'best date 2',
            user_id: 1,
            place_id: 'ChIJ621AHF_QwoARxgHofQrJkEk',
            meal_id: '53021',
            meal_type: "In",
            drink_id: '14133',
            show_id: '63',
            show_type: "Movie"
        },
        {
            id: 3,
            name: 'best date 1',
            user_id: 2,
            place_id: 'ChIJ621AHF_QwoARxgHofQrJkEk',
            meal_id: '53021',
            meal_type: "In",
            drink_id: '14133',
            show_id: '63',
            show_type: "Movie"
        },
        {
            id: 4,
            name: 'best date 2',
            user_id: 2,
            place_id: 'ChIJ7U-BHeuzwoARAvYAqFtEc2A',
            meal_id: '52906',
            meal_type: "In",
            drink_id: '14229',
            show_id: '32669',
            show_type: "Movie"
        },
        {
            id: 5,
            name: 'best date',
            user_id: 3,
            place_id: 'ChIJ621AHF_QwoARxgHofQrJkEk',
            meal_id: '53021',
            meal_type: "In",
            drink_id: '14133',
            show_id: '63',
            show_type: "Movie"
        },
        {
            id: 6,
            name: 'best date',
            user_id: 4,
            place_id: 'ChIJ7U-BHeuzwoARAvYAqFtEc2A',
            meal_id: '52906',
            meal_type: "In",
            drink_id: '14229',
            show_id: '32669',
            show_type: "Movie"
        },
    ]
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => {
        let { id, ...newUser } = user;
        newUser.password = bcrypt.hashSync(user.password, 12);

        return newUser;
    })
    return db
        .into('dr_users')
        .insert(preppedUsers)
        .then(() => db.raw(`SELECT setval('dr_users_id_seq', ?)`, [users[users.length - 1].id]))
}

function cleanTables(db) {
    return db.transaction(trx => 
        trx.raw(
            `
            TRUNCATE dr_dates CASCADE;
            TRUNCATE dr_users CASCADE;
            `
        )
            .then(() => 
                Promise.all([
                    trx.raw(`ALTER SEQUENCE dr_users_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`ALTER SEQUENCE dr_dates_id_seq minvalue 0 START WITH 1`),
                    trx.raw(`SELECT setval('dr_users_id_seq', 0)`),
                    trx.raw(`SELECT setval('dr_dates_id_seq', 0)`),
                ])
            )
    )
}

function seedDates(db, users, dates) {
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('dr_dates').insert(dates.map(date => {
            let { id, ...newDate } = date;

            return newDate;
        }))
        await trx.raw(`SELECT setval('dr_dates_id_seq', ?)`, [dates[dates.length - 1].id])
    })
}

function makeMaliciousDate() {
    const maliciousDate = {
        id: 911,
        name: 'Bad Date <script>alert("xss");</script>',
        user_id: 4,
        place_id: 'ChIJ7U-BHeuzwoARAvYAqFtEc2A',
        meal_id: '52906',
        meal_type: "In",
        drink_id: '14229',
        show_id: '32669',
        show_type: "Movie"
    }
    const cleanedDate = {
        ...maliciousDate,
        name: 'Bad Event &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
        maliciousEvent,
        cleanedDate
    }
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256'
    })
    return `Bearer ${token}`
}

module.exports = {
    makeDatesArray,
    makeUsersArray,
    makeMaliciousDate,
    makeAuthHeader,
    seedUsers,
    seedDates,
    cleanTables
}