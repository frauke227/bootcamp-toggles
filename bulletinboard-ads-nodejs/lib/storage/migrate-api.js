import dbmigrate from 'db-migrate'

export default function getInstance (pgConfig) {
  return dbmigrate.getInstance(true, {
    env: 'default',
    config: {
      default: {
        driver: 'pg',
        ...pgConfig
      }
    }
  })
}
