import { Router } from "express"
import { addBoardGame, getBoardGames } from "../controllers/boardGamesControllers.js"
import { validateSchema } from "../middlewares/validateSchemaMiddlewares.js"
import { boardGamesSchema } from "../schemas/boardGamesSchemas.js"

const boardGamesRouter = Router()

boardGamesRouter.get("/games", getBoardGames)
boardGamesRouter.post("/games", validateSchema(boardGamesSchema), addBoardGame)

export default boardGamesRouter