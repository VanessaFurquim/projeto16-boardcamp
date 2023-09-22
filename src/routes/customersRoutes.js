import { Router } from "express"
import { addCustomer, getCustomerById, getCustumers } from "../controllers/customersControllers.js"
import { validateSchema } from "../middlewares/validateSchemaMiddlewares.js"
import { customersSchema } from "../schemas/customersSchemas.js"

const customersRouter = Router()

customersRouter.get("/customers", getCustumers)
customersRouter.get("/customers/:id", getCustomerById)
customersRouter.post("/customers", validateSchema(customersSchema), addCustomer)

export default customersRouter