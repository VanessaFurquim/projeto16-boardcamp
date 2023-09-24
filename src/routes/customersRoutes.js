import { Router } from "express"
import { addCustomer, getCustomerById, getCustumers, updateCustomersInformation } from "../controllers/customersControllers.js"
import { validateSchema } from "../middlewares/validateSchemaMiddlewares.js"
import { customersSchema } from "../schemas/customersSchemas.js"

const customersRouter = Router()

customersRouter.get("/customers", getCustumers)
customersRouter.get("/customers/:id", getCustomerById)
customersRouter.post("/customers", validateSchema(customersSchema), addCustomer)
customersRouter.put("/customers/:id", validateSchema(customersSchema), updateCustomersInformation)

export default customersRouter