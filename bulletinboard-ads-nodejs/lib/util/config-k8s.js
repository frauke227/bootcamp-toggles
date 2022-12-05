const {
  PORT: port = 3000,
  POSTGRES_CONNECTION_STRING:
  connectionString = 'postgresql://postgres:postgres@localhost:5432/bulletinboard_ads_dev',
  REVIEWS_ENDPOINT: endpoint = 'http://localhost:9090'
} = process.env

export const config = {
  app: {
    port
  },
  postgres: {
    connectionString
  },
  reviews: {
    endpoint
  }
}
