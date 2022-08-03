// Local development

const db = process.env.NODE_ENV === 'test' ? 'postgres' : 'bulletinboard_ads_dev'

export default {
  app: {
    port: 8080
  },
  postgres: {
    connectionString: `postgresql://postgres:postgres@localhost:5432/${db}`
  },
  reviews: {
    endpoint: 'http://localhost:9090'
  }
}

// Cloud Foundry

// import cfenv from 'cfenv'

// const appEnv = cfenv.getAppEnv({
//   vcapFile: 'vcap.json'
// })

// const { app: { port } } = appEnv

// const { uri: connectionString, sslcert: cert, sslrootcert: ca } = appEnv.getServiceCreds('bulletinboard-postgres')

// const { REVIEWS_ENDPOINT: endpoint = 'http://localhost:9090' } = process.env

// export default {
//   app: {
//     port
//   },
//   postgres: {
//     connectionString,
//     ssl: (cert && ca) ? { cert, ca } : false
//   },
//   reviews: {
//     endpoint
//   }
// }

// Kubernetes

// const {
//   PORT: port = 3000,
//   POSTGRES_CONNECTION_STRING: connectionString = `postgresql://postgres:postgres@localhost:5432/${db}`,
//   REVIEWS_ENDPOINT: endpoint = 'http://localhost:9090'
// } = process.env

// export default {
//   app: {
//     port
//   },
//   postgres: {
//     connectionString
//   },
//   reviews: {
//     endpoint
//   }
// }
