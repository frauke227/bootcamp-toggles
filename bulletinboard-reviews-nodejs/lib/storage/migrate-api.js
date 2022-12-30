import dbmigrate from 'db-migrate'

export default function getInstance (pgConnectionString) {
  return dbmigrate.getInstance(true, {
    env: 'default',
    config: {
      default: {
        driver: 'pg',
        connectionString: pgConnectionString
      }
    }
  })
}
