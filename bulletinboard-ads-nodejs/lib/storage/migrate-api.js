import dbmigrate from 'db-migrate'

export default function migrate (action, pgConnectionString) {
  const dbm = dbmigrate.getInstance(true, {
    env: 'default',
    config: {
      default: {
        driver: 'pg',
        connectionString: pgConnectionString
      }
    }
  })
  return dbm[action]()
}
