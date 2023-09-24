import BaseJoi from 'joi'
import JoiDate from '@joi/date'

const joi = BaseJoi.extend(JoiDate)

export const customersSchema = joi.object( {
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().length(11).alphanum().required(),
    birthday: joi.date().format("YYYY-MM-DD").required()
})