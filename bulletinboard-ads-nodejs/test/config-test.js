export const config = {
  app: {
    port: 8080
  },
  postgres: {
    connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres'
  },
  reviews: {
    endpoint: 'http://localhost:9090'
  }
}
