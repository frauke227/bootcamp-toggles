import migrate from './lib/storage/migrate-api.js'

await migrate({ connectionString: 'postgresql://postgres:postgres@localhost:5432/bulletinboard_ads_dev' }).run()
