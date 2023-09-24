import BaseJoi from 'joi'
import JoiDate from '@joi/date'

const joi = BaseJoi.extend(JoiDate)

export const rentalsSchema = joi.object( {
    customerId: joi.number().integer().required(),
    gameId: joi.number().integer().required(),
    daysRented: joi.number().integer().required()
})