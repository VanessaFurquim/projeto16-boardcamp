import BaseJoi from 'joi'
import JoiDate from '@joi/date'

const joi = BaseJoi.extend(JoiDate)

export const rentalsSchema = joi.object( {
    customerId: joi.string().required(),
    gameId: joi.string().required(),
    daysRented: joi.string().required()
})