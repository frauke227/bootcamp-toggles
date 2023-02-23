import cfenv from 'cfenv'
import main from './lib/main.js'

const appEnv = cfenv.getAppEnv()

const cfEnvCreds = appEnv.getServiceCreds('bulletinboard-postgres')
if (!cfEnvCreds) {
  throw new Error('Cf Env Creds not found')
}

if (!process.env.PORT) {
  throw new Error('Env variable PORT not specified')
}


const { uri: connectionString, sslcert: cert, sslrootcert: ca } = cfEnvCreds

const config = {
  app: {
    port: Number.parseInt(process.env.PORT)
  },
  postgres: {
    connectionString,
    ssl: (cert && ca) ? { cert, ca } : false
  }
}

main(config)
