import db from "../database/databaseConfig.js"

export async function getCustumers (request, response) {

    try {
        const listOfCustomers = await db.query(`SELECT * FROM customers;`)
        response.send(listOfCustomers.rows)

    } catch (error) { response.status(500).send(error.message) }
}

export async function getCustomerById (request, response) {
    const { id } = request.params

    try {
        const isClientIdExistent = await db.query(`SELECT * FROM customers WHERE id = $1`, [id])
        if (isClientIdExistent.rowCount === 0) return response.sendStatus(404)

        response.send(isClientIdExistent.rows[0])

    } catch (error) { response.status(500).send(error.message) }
}