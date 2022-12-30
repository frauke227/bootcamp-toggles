import migrate from './lib/storage/migrate-api.js'

await migrate('postgresql://postgres:postgres@localhost:5432/bulletinboard_ads_dev').run()
