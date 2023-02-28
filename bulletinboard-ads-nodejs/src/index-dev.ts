import main, { Config } from './lib/main.js'

const config: Config = {
  app: {
    port: 8080
  },
  postgres: {
    connectionString: 'postgresql://postgres:postgres@localhost:5432/bulletinboard_ads_dev'
  },
  reviews: {
    endpoint: 'http://localhost:9090'
  }
}

main(config)
