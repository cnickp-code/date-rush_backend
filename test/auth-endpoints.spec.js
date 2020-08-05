const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const { makeUsersArray } = require('./test-helpers');

describe('Auth Endpoints', function() {
    let db;

    const testUsers = makeUsersArray();
    const testUser = testUsers[0];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    before('clean db', () => helpers.cleanTables(db));
    afterEach('clean db', () => helpers.cleanTables(db));
    after('end connection', () => db.destroy());

    describe(`POST /api/auth/login`, () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(db, testUsers)
        )

        const requiredFields = ['user_name', 'password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                user_name: testUser.user_name,
                password: testUser.password,
            }

            it(`responds with 400 required error when '${field}' is missing`, () => {
                delete loginAttemptBody[field];

                return supertest(app)
                    .post('/api/auth/login')
                    .send(loginAttemptBody)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    })
            })

            it(`responds with 400 'invalid user_name or password' when bad user_name`, () => {
                const userInvalidUser = { user_name: 'user-not', password: 'password3' };
                return supertest(app)
                    .post('/api/auth/login')
                    .send(userInvalidUser)
                    .expect(400, { error: 'Incorrect user_name or password' })
            })

            it(`responds with 400 'invalid user_name or password' when bad password`, () => {
                const invalidPassword = { user_name: testUser.user_name, password: 'incorrect' };
                return supertest(app)
                    .post('/api/auth/login')
                    .send(invalidPassword)
                    .expect(400, { error: 'Incorrect user_name or password' })
            })

            it(`responds with 200 and JWT auth token using secret when valid credentials`, () => {
                const userValidCreds = {
                    user_name: testUser.user_name,
                    password: testUser.password
                }

                const expectedToken = jwt.sign(
                    { user_id: testUser.id },
                    process.env.JWT_SECRET,
                    {
                        subject: testUser.user_name,
                        algorithm: 'HS256'
                    }
                )
                return supertest(app)
                    .post('/api/auth/login')
                    .send(userValidCreds)
                    .expect(200, {
                        authToken: expectedToken
                    })
            })
        })
    })
})
    