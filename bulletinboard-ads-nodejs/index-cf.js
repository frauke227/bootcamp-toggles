import cfenv from 'cfenv'
import main from './lib/main.js'

const appEnv = cfenv.getAppEnv({
  vcapFile: 'vcap.json'
})

const { app: { port } } = appEnv

const { uri: connectionString, sslcert: cert, sslrootcert: ca } = appEnv.getServiceCreds('bulletinboard-postgres')

const { REVIEWS_ENDPOINT: endpoint = 'http://localhost:9090' } = process.env

const config = {
  app: {
    port
  },
  postgres: {
    connectionString,
    ssl: (cert && ca) ? { cert, ca } : false
  },
  reviews: {
    endpoint
  }
}

main(config)
