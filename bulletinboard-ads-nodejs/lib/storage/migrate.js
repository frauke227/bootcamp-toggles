import dbmigrate from 'db-migrate'

const migrate = async () => {
  try {
    const action = process.argv[2]
    const configFile = process.argv[3]
    const { config } = (await import(configFile))
    const dbm = dbmigrate.getInstance(true, {
      env: 'default',
      config: {
        default: {
          driver: 'pg',
          ...config.postgres
        }
      }
    })
    await dbm[action]()
  } catch ({ stack }) {
    console.error(stack)
    process.exit(1)
  }
}

migrate()
