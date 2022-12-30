import cfenv from 'cfenv'
import main from './lib/main.js'

const appEnv = cfenv.getAppEnv()

const { uri: connectionString, sslcert: cert, sslrootcert: ca } = appEnv.getServiceCreds('bulletinboard-postgres')

const config = {
  app: {
    port: process.env.PORT
  },
  postgres: {
    connectionString,
    ssl: (cert && ca) ? { cert, ca } : false
  }
}

main(config)
