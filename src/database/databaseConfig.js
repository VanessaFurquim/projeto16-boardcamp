import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

const databaseConfig = {
    connectionString: process.env.DATABASE_URL
} // mais coisas dentro do objeto (senha, usuário, ...)

if (process.env.NODE_ENV === "production") databaseConfig.ssl = true

const db = new Pool(databaseConfig)

export default db