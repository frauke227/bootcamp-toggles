import migrate from './lib/storage/migrate-api.js'

await migrate({ connectionString: 'postgresql://postgres:postgres@localhost:6543/bulletinboard_reviews_dev' }).run()
