import { Router } from "express"
import { getCustomerById, getCustumers } from "../controllers/customersControllers.js"

const customersRouter = Router()

customersRouter.get("/customers", getCustumers)
customersRouter.get("/customers/:id", getCustomerById)

export default customersRouter