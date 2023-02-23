import pg from 'pg'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dbmigrate from 'db-migrate'

export default function getInstance(pgConfig: pg.ClientConfig) {
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
