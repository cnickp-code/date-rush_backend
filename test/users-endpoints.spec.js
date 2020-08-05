const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const { expect } = require('chai');

describe('Users Endpoints', function () {
    let db;

    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[0];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            );

            const requiredFields = ['user_name', 'password', 'email'];

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    user_name: 'test user_name',
                    password: 'test password',
                    email: 'test@test.com'
                };

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field];

                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        })
                })
            })
            it(`responds with 400 'Password must be longer than 8 characters' when empty password`, () => {
                const userShortPassword = {
                    user_name: 'test user_name',
                    password: '123456',
                    email: 'test@test.com'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userShortPassword)
                    .expect(400, { error: `Password must be longer than 8 characters` })
            })
            it(`responds with 400 'Password must be shorter than 72 characters' when empty password`, () => {
                const userLongPassword = {
                    user_name: 'test user_name',
                    password: '*'.repeat(73),
                    email: 'test@test.com'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userLongPassword)
                    .expect(400, { error: `Password must be shorter than 72 characters` })
            })
            it(`responds with 400 when password starts with spaces`, () => {
                const userPasswordBeginsWithSpaces = {
                    user_name: 'test user_name',
                    password: '     321',
                    email: 'test@test.com'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordBeginsWithSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces` })
            })
            it(`responds with 400 when password ends with spaces`, () => {
                const userPasswordEndsWithSpaces = {
                    user_name: 'test user_name',
                    password: '321     ',
                    email: 'test@test.com'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordEndsWithSpaces)
                    .expect(400, { error: `Password must not start or end with empty spaces` })
            })
            it(`responds with 400 when password isn't complex enough`, () => {
                const userPasswordNotComplex = {
                    user_name: 'test user_name',
                    password: '11AAaabb',
                    email: 'test@test.com'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordNotComplex)
                    .expect(400, { error: `Password must contain 1 upper case, lower case, number, and special character`})
            })
            it(`responds with 400 'User name already taken' when user_name isn't unique`, () => {
                const duplicateUser = {
                    user_name: testUser.user_name,
                    password: '11AAaa!!',
                    email: 'test@test.com'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(duplicateUser)
                    .expect(400, { error: `Username already taken` })
            })
            it(`responds with 400 'Email is invalid`, () => {
                const invalidEmailUser = {
                    user_name: 'test user name',
                    password: '11AAaa!!',
                    email: 'test'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(invalidEmailUser)
                    .expect(400, { error: `Not a valid email` })
            })
        })

        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcrypted password`, () => {
                const newUser = {
                    user_name: 'test user_name',
                    password: '11AAaa!!',
                    email: 'test@test.com'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.user_name).to.eql(newUser.user_name)
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)

                        const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                        const actualDate = new Date(res.body.date_created).toLocaleString()
                        expect(actualDate).to.eql(expectedDate)

                    })
                    .expect(res => 
                        db
                            .from('dr_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(res.body.user_name).to.eql(newUser.user_name)
                                expect(res.body.email).to.eql(newUser.email)
                                expect(res.body).to.not.have.property('password')
                                expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
        
                                const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                                const actualDate = new Date(res.body.date_created).toLocaleString()
                                expect(actualDate).to.eql(expectedDate)

                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                                    
                        
                    )
            })
        })
    })
})