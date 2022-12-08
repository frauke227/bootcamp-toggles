import migrate from './lib/storage/migrate-api.js'

await migrate(process.argv[2], 'postgresql://postgres:postgres@localhost:5432/bulletinboard_ads_dev')
