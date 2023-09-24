import db from "../database/databaseConfig.js"
import dayjs from "dayjs"
// import advancedFormat from "dayjs/plugin/advancedFormat"

// dayjs.extend(advancedFormat)

export async function getListOfRentals (request, response) {

    try {
        const rentalsTableContent = await db.query(`SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName"
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id;`)

        const listOfRentals = rentalsTableContent.rows.map(singleRental => {
            return {
                id: singleRental.id,
                customerId: singleRental.customerId,
                gameId: singleRental.gameId,
                rentDate: dayjs(singleRental.rentDate).format("YYYY-MM-DD"),
                daysRented: singleRental.daysRented,
                returnDate: singleRental.returnDate,
                originalPrice: singleRental.originalPrice,
                delayFee: singleRental.delayFee,
                customer: {
                    id: singleRental.customerId,
                    name: singleRental.customerName
                },
                game: {
                    id: singleRental.gameId,
                    name: singleRental.gameName
                }
            }
        })

        response.send(listOfRentals)

    } catch (error) { response.status(500).send(error.message) }
}

export async function addRental (request, response) {
    const { customerId, gameId, daysRented } = request.body
    const rentDate = dayjs().format("YYYY-MM-DD")
    let originalPrice

    if (daysRented <= 0) return response.sendStatus(400)

    try {
        const isCustomerRgistered = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId])
        if (isCustomerRgistered.rowCount === 0) return response.sendStatus(400)

        const isGameExistent = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId])
        if (isGameExistent.rowCount === 0) return response.sendStatus(400)

        const numberOfSelectedGameRentals = await db.query(`SELECT COUNT(*) FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null;`, [gameId])
        if (numberOfSelectedGameRentals.rows[0].count >= isGameExistent.rows[0].stockTotal) return response.sendStatus(400)

        console.log(isGameExistent.rows[0].stockTotal)
        console.log(numberOfSelectedGameRentals.rows[0].count)

        const pricePerDayInfo_game = await db.query(`SELECT "pricePerDay" FROM games WHERE id = $1;`, [gameId])
        originalPrice = pricePerDayInfo_game.rows[0].pricePerDay * daysRented

        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`, [customerId, gameId, rentDate, daysRented, null, originalPrice, null])

        response.sendStatus(201)

    } catch (error) { return response.status(500).send(error.message) }
}

export async function finalizeRental (request, response) {
    const { id } = request.params
    const returnDate = dayjs().format("YYYY-MM-DD")
    let delayFee
    
    try {
        const isRentalExistent = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id])
        if (isRentalExistent.rowCount === 0) return response.sendStatus(404)

        const rentalRelatedDates = await db.query(`SELECT "returnDate", "rentDate", "daysRented" FROM rentals WHERE id = $1;`, [id])
         const isRentalFinalized = rentalRelatedDates.rows[0].returnDate
        if (isRentalFinalized !== null) return response.sendStatus(400)
        
        const pricePerDayInfo_game = await db.query(`SELECT "pricePerDay" FROM games WHERE id = $1;`, [isRentalExistent.rows[0].gameId])

        const returnDeadline = dayjs(rentalRelatedDates.rows[0].rentDate).add(rentalRelatedDates.rows[0].daysRented, "day")

        const isReturnDelayed = dayjs(returnDeadline).isBefore(dayjs(returnDate))

        // returnDeadline isBefore returnDate = true delayed
        // returnDeadline = returnDate (false) NOT delayed
        // returnDeardline isBefore returnDate = false NOT delayed

        const daysDelayedForReturn = dayjs(returnDate).diff(dayjs(returnDeadline), "day")

        if (isReturnDelayed === true) {
            delayFee = daysDelayedForReturn * pricePerDayInfo_game.rows[0].pricePerDay
        } else {
            delayFee = null
        }
        
        await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`, [returnDate, delayFee, id])

        response.sendStatus(200)

    } catch (error) { return response.status(500).send(error.message) }
}

export async function deleteRental (request, response) {
    const { id } = request.params

    try {
        const isRentalExistent = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id])
        if (isRentalExistent.rowCount === 0) return response.sendStatus(404)

        const isRentalFinalized = await db.query(`SELECT "returnDate" FROM rentals WHERE id = $1;`, [id])
        console.log(isRentalFinalized)
        if (isRentalFinalized.rows[0].returnDate === null) return response.sendStatus(400)

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id])

        response.sendStatus(200)

    } catch (error) { return response.status(500).send(error.message) }
}