const xss = require('xss');

const DatesService = {
    getDatesByUserId(knex, id) {
        return knex
            .from('dr_dates')
            .select('*')
            .where('user_id', id)
            .orderBy('id')
    },
    getDateById(knex, id) {
        return knex
            .from('dr_dates')
            .select('*')
            .where('id', id)
            .first();
    },
    insertDate(knex, newDate) {
        return knex
            .insert(newDate)
            .into('dr_dates')
            .returning('*')
            .then(rows => {
                return rows[0]
            });
    },
    deleteDateItem(knex, id) {
        return knex('dr_dates')
            .where({ id })
            .delete();
    },
    updateDateItem(knex, id, newDateFields) {
        return knex('dr_dates')
            .where({ id })
            .update(newDateFields)
    },
    serializeDateItem(item) {
        return {
            id: item.id,
            name: xss(item.name),
            location: xss(item.location),
            user_id: item.user_id,
            place_id: item.place_id,
            meal_id: item.meal_id,
            meal_type: item.meal_type,
            drink_id: item.drink_id,
            show_id: item.show_id,
            show_type: item.show_type
        }
    }
}

module.exports = DatesService;