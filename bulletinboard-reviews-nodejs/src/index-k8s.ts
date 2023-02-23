import main, { Config } from './lib/main.js'

if (!process.env.PORT) {
  throw new Error('Env variable PORT not specified')
}

if (!process.env.POSTGRES_CONNECTION_STRING) {
  throw new Error('Env variable POSTGRES_CONNECTION_STRING not specified')
}

const config: Config = {
  app: {
    port: Number.parseInt(process.env.PORT)
  },
  postgres: {
    connectionString: process.env.POSTGRES_CONNECTION_STRING
  }
}

main(config)
