import db from "../database/databaseConfig.js"

export async function getBoardGames (request, response) {

    try {
        const listOfBoardGames = await db.query(`SELECT * FROM games;`)
        response.send(listOfBoardGames.rows)

    } catch (error) { response.status(500).send(error.message) }
}

export async function addBoardGame (request, response) {
    const { name, image, stockTotal, pricePerDay } = request.body

    try {
        const isBoardGameNameExistent = await db.query(`SELECT * FROM games WHERE name = $1;`, [name])
        if (isBoardGameNameExistent.rowCount !== 0) return response.sendStatus(409)

        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`, [name, image, stockTotal, pricePerDay])
        response.sendStatus(201)

    } catch (error) { response.status(500).send(error.message) }
}