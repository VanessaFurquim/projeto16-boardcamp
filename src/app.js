import express, { json } from "express"
import cors from "cors"
import db from "./database/databaseConfig.js"
import boardGamesRouter from "./controllers/routes/BoardGamesRoutes.js"

const app = express()
app.use(json())
app.use(cors())

app.use(boardGamesRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))