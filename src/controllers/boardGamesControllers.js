import db from "../database/databaseConfig.js"

export async function getBoardGames (request, response) {

    try {
        const boardGames = await db.query(`SELECT * FROM games;`)
        response.send(boardGames.rows)

    } catch (error) { response.status(500).send(error.message) }
}

export async function addBoardGame (request, response) {
    const { name, image, stockTotal, pricePerDay } = request.body

    const isBoardGameNameExistent = await db.query(`SELECT * FROM games WHERE name = $1;`, [name])
    if (isBoardGameNameExistent.rowCount !== 0) return response.sendStatus(409)

    //validate if name is "presente e não vazio" (schema string().required() ?) (error 400)
    //validate if stockTotal and pricePerDay > 0 (schema .number().positive() ?) (error 400)

    try {
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`, [name, image, stockTotal, pricePerDay])

        response.sendStatus(201)

    } catch (error) { response.status(500).send(error.message) }
}