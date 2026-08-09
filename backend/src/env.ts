import 'dotenv/config'

export const env = {
    port: Number(process.env.PORT) || 5000,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
    accessKey: process.env.CHAVE_ACESSO || "chaveSuperSecreta123456",
    cookieName: process.env.COOKIE_NOME || "faxina_token",
    dbHost: process.env.DB_HOST || "localhost",
    dbPort: Number(process.env.DB_PORT) || 5432,
    dbUser: process.env.DB_USUARIO || "postgres",
    dbPassword: process.env.DB_SENHA || "",
    dbName: process.env.DB_NOME || "faxina_db"
}
