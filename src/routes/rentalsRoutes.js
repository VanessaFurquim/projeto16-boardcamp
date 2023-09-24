import { Router } from "express"
import { addRental, deleteRental, finalizeRental, getListOfRentals } from "../controllers/rentalsControllers.js"
import { validateSchema } from "../middlewares/validateSchemaMiddlewares.js"
import { rentalsSchema } from "../schemas/rentalsSchemas.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getListOfRentals)
rentalsRouter.post("/rentals", validateSchema(rentalsSchema), addRental)
rentalsRouter.post("/rentals/:id/return", finalizeRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter