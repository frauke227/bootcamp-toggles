import pg from 'pg'

// REVISE do we need this file at all? It's not doing anything, files using it could as well use pg.Pool directly
const { Pool } = pg

export default Pool
