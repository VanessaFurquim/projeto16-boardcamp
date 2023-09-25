import db from "../database/databaseConfig.js"

export async function getCustumers (request, response) {

    try {
        const listOfCustomers = await db.query(`SELECT *, to_char(birthday, 'YYYY-MM-DD') AS birthday FROM customers;`)

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

export async function addCustomer (request, response) {
    const { name, phone, cpf, birthday } = request.body

    try {
        const isClientCPFRegistered = await db.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf])
        if (isClientCPFRegistered.rowCount !== 0) return response.sendStatus(409)

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday])
        
        response.sendStatus(201)

    } catch (error) { response.status(500).send(error.message) }
}

export async function updateCustomersInformation (request, response) {
    const { id } = request.params
    const { name, phone, cpf, birthday } = request.body

    try {
        const isCPFRegistered = await db.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf])

        // if (isCPFRegistered.rowCount === 0) return response.status(404).send("Nenhum registro foi encontrado com esse CPF.")

        if (isCPFRegistered.rowCount !== 0 && isCPFRegistered.rows[0].id !== parseInt(id)) return response.sendStatus(409)
        // VALIDAÇÃO**:
        // OK > se CPF existir no banco e IDs forem iguais   >>> OK

        // ERRO > se CPF existir e IDs forem diferentes      >>> ERRO**
        //        se CPF não existir                         >>> OK

        await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;`, [name, phone, cpf, birthday, id])
        
        response.sendStatus(200)

    } catch (error) { response.status(500).send(error.message) }
}