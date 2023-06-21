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
  },
  toggle: {
    isOrderByNoOfViewsEnabled: Boolean(process.env.ORDERED_TOGGLE)
    //passed a string so always results in true when exported
  }
}

main(config)
