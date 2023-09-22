import BaseJoi from 'joi'
import JoiDate from '@joi/date'

const joi = BaseJoi.extend(JoiDate)

export const boardGamesSchema = joi.object( {
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().positive().integer().required(),
    pricePerDay: joi.number().positive().integer().required()
})