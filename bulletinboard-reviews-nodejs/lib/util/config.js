// Static

const db = process.env.NODE_ENV === 'test' ? 'postgres' : 'bulletinboard_reviews_dev'

export default {
  app: {
    port: 9090
  },
  postgres: {
    connectionString: `postgresql://postgres:postgres@localhost:6543/${db}`
  }
}

// Cloud Foundry

// import cfenv from 'cfenv'

// const appEnv = cfenv.getAppEnv({
//   vcapFile: 'vcap.json'
// })

// const { app: { port } } = appEnv

// const { uri: connectionString, sslcert: cert, sslrootcert: ca } = appEnv.getServiceCreds('bulletinboard-postgres')

// export default {
//   app: {
//     port
//   },
//   postgres: {
//     connectionString,
//     ssl: (cert && ca) ? { cert, ca } : false
//   }
// }

// Kubernetes

// const {
//   PORT: port = 9090,
//   POSTGRES_CONNECTION_STRING: connectionString =  `postgresql://postgres:postgres@localhost:6543/${db}`
// } = process.env

// export default {
//   app: {
//     port
//   },
//   postgres: {
//     connectionString
//   }
// }
