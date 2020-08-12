const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { makeDatesArray, makeUsersArray } = require('./test-helpers');
const { expect } = require('chai');

describe.only('Dates Endpoints', () => {
    let db;

    const testUsers = makeUsersArray();
    const testDates = makeDatesArray();
    const validUser = testUsers[0];

    before('setup db', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    }) 

    before('clean db', () => helpers.cleanTables(db));
    afterEach('clean db', () => helpers.cleanTables(db));
    after('end connection', () => db.destroy());

    describe('GET api/dates', () => {
        beforeEach('insert users', () => helpers.seedUsers(db, testUsers))

        it('Should return 200 and empty array', () => {
            return supertest(app)
                .get('/api/dates')
                .set('Authorization', helpers.makeAuthHeader(validUser))
                .expect(200, [])
        })

        context('With data in the table', () => {
            beforeEach('Insert dates', () => {
                return db
                    .into('dr_dates')
                    .insert(testDates)
            })

            let expectedDates = testDates.filter(date => date.user_id === validUser.id)

            it('Should return 200 and test data', () => {
                return supertest(app)
                    .get('/api/dates')
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, expectedDates)
            })
        })

        context('Given an XSS attack', () => {
            const { maliciousDate, cleanedDate } = helpers.makeMaliciousDate();

            beforeEach('insert malicious date and users', () => {
                return db
                    .into('dr_dates')
                    .insert(maliciousDate)
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get('/api/dates')
                    .expect(200)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(res => {
                        expect(res.body[0].name).to.eql(cleanedDate.name)
                    })
            })
        })
    })

    describe('GET /api/dates/:date_id', () => {
        beforeEach(() => helpers.seedUsers(db, testUsers))

        context('Given no dates', () => {
            it('responds with 404', () => {
                const dateId = 123456
                return supertest(app)
                    .get(`/api/dates/${dateId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(404, { error: { message: `Date item does not exist.` }})
            })
        })

        context('Given there are dates in database', () => {
            beforeEach('insert test dates', () => {
                return db
                    .into('dr_dates')
                    .insert(testDates)
            })

            it('responds with 200 and given date', () => {
                const dateId = 1;
                const expectedDate = testDates[dateId - 1];

                return supertest(app)
                    .get(`/api/dates/${dateId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(200, expectedDate)
            })
        })
    })

    describe('DELETE /api/dates/:date_id', () => {
        context('Given no date', () => {

            beforeEach('Insert test dates', () => {
                return helpers.seedDates(
                    db,
                    testUsers,
                    testDates
                )
            })

            it('Responds with 404', () => {
                const dateId = 123456;
                
                return supertest(app)
                    .delete(`/api/dates/${dateId}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(404)
            })
        })

        context('Given date is in database', () => {
            before('Insert test dates', () => {
                return helpers.seedDates(
                    db,
                    testUsers,
                    testDates
                )
            })

            it('Responds with 204 and removes date', () => {
                const idToDelete = 2;
                const expectedDates = testDates.filter(date => date.user_id === 1);
                const finalDates = expectedDates.filter(date => date.id !== 2);
                
                return supertest(app)
                    .delete(`/api/dates/${idToDelete}`)
                    .set('Authorization', helpers.makeAuthHeader(validUser))
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get('/api/dates')
                            .set('Authorization', helpers.makeAuthHeader(validUser))
                            .expect(finalDates)
                    })
            })
        })
    })

    describe('POST /api/dates', () => {
        beforeEach(() => helpers.seedUsers(db, testUsers))

        it('Should return 201 and the new date with valid data', () => {
            const newDate = {
                name: 'New Test Date!',
                user_id: 1,
                location: 'Los Angeles',
                place_id: 'ChIJ7U-BHeuzwoARAvYAqFtEc2A',
                meal_id: '52906',
                meal_type: "In",
                drink_id: '14229',
                show_id: '32669',
                show_type: "Movie"
            }

            return supertest(app)
                .post('/api/dates')
                .set('authorization', helpers.makeAuthHeader(validUser))
                .send(newDate)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.be.an('object')
                    expect(res.body.user_id).to.be.eql(newDate.user_id)
                    expect(res.body.location).to.be.eql(newDate.location)
                    expect(res.body.place_id).to.be.eql(newDate.place_id)
                    expect(res.body.meal_id).to.be.eql(newDate.meal_id)
                    expect(res.body.meal_type).to.be.eql(newDate.meal_type)
                    expect(res.body.drink_id).to.be.eql(newDate.drink_id)
                    expect(res.body.show_id).to.be.eql(newDate.show_id)
                    expect(res.body.show_type).to.be.eql(newDate.show_type)
                    expect(res.body.name).to.be.eql(newDate.name)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/dates/${res.body.id}`)
                        .set('Authorization', helpers.makeAuthHeader(validUser))
                        .expect(res.body)
                })
        })
    })
})