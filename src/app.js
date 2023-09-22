import express, { json } from "express"
import cors from "cors"
import db from "./database/databaseConfig.js"
import boardGamesRouter from "./routes/boardGamesRoutes.js"
import customersRouter from "./routes/customersRoutes.js"

const app = express()
app.use(json())
app.use(cors())

app.use(boardGamesRouter)
app.use(customersRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))