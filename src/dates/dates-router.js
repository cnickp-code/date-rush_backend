const express = require('express');
const DatesService = require('./dates-service');
const { requireAuth } = require('../middleware/jwt-auth');

const datesRouter = express.Router();

const bodyParser = express.json();

datesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        const userId = req.user.id;

        DatesService.getDatesByUserId(knexInstance, userId)
            .then(dates => {
                const newDates = dates.map(date => {
                    return DatesService.serializeDateItem(date);
                })

                res.status(200).json(newDates);
            })
    })
    .post(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db');
        const user_id = req.user.id;
        const { name, location, place_id, meal_id, meal_type, drink_id, show_id, show_type } = req.body;
        const newDateItem = { name, location, place_id, meal_id, meal_type, drink_id, show_id, show_type, user_id };

        for(const [key, value] of Object.entries(newDateItem)) {
            if(value == null) {
                return res.status(404).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }

        DatesService.insertDate(knexInstance, newDateItem)
            .then(date => {
                res
                    .status(201)
                    .location(`/api/dates/${date.id}`)
                    .json(DatesService.serializeDateItem(date))
            })

    })

datesRouter
    .route('/:date_id')
    .all(requireAuth)
    .all((req, res, next) => {
        DatesService.getDateById(
            req.app.get('db'),
            req.params.date_id
        )
        .then(date => {
            if(!date) {
                return res.status(404).json({
                    error: { message: 'Date item does not exist.' }
                })
            }
            res.date = date;
            next();
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res
            .status(200)
            .json(DatesService.serializeDateItem(res.date));
    })
    .delete(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db');

        DatesService.deleteDateItem(knexInstance, req.params.date_id)
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(bodyParser, (req, res, next) => {
        const user_id = req.user.id;
        const { name, location, place_id, meal_id, meal_type, drink_id, show_id, show_type } = req.body;
        const dateToUpdate = { name, location, user_id, place_id, meal_id, meal_type, drink_id, show_id, show_type };
        const numberOfValues = Object.values(dateToUpdate).filter(Boolean).length

        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'name, place id, meal id, meal type, drink id, show id, or show type`
                }
            })
        }

        DatesService.updateDateItem(req.app.get('db'), req.params.date_id, dateToUpdate)
            .then(rows => {
                res.status(204).end()
            })
            .catch(next);
    })

module.exports = datesRouter;
