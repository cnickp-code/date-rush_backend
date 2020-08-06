const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const { makeDatesArray, makeUsersArray } = require('./test-helpers');

describe('Auth Endpoints', function () {
    let db;

    const testUsers = makeUsersArray();
    const testDates = makeDatesArray();

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

    describe('Protected endpoints', () => {
        beforeEach('insert data into tables', () => {
            return helpers.seedDates(
                db,
                testUsers,
                testDates
            )
        });

        const protectedEndpoints = [
            {
                name: 'GET /api/dates/:date_id',
                path: '/api/dates/1'
            },
            {
                name: 'GET /api/dates',
                path: '/api/dates'
            },
        ];

        protectedEndpoints.forEach(endpoint => {
            describe(endpoint.name, () => {
              it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
                return supertest(app)
                  .get(endpoint.path)
                  .expect(401, { error: `Missing Bearer Token.` })
              })
      
              it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return supertest(app)
                  .get(endpoint.path)
                  .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                  .expect(401, { error: `Unauthorized Request` })
              })
      
              it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { user_name: 'user-not-existy', id: 1}
                return supertest(app)
                  .get(endpoint.path)
                  .set('Authorization', helpers.makeAuthHeader(invalidUser))
                  .expect(401, { error: `Unauthorized Request` })
              })
            })
          })
    })
})
