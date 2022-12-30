import main from './lib/main.js'

const config = {
  app: {
    port: 9090
  },
  postgres: {
    connectionString: 'postgresql://postgres:postgres@localhost:6543/bulletinboard_reviews_dev'
  }
}

main(config)
