'use strict';

let dbm = null
let type = null // eslint-disable-line no-unused-vars
let seed = null // eslint-disable-line no-unused-vars

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */

// exports.setup = function ({ dbmigrate }, seedLink) {
//   dbm = dbmigrate
//   type = dbm.dataType
//   seed = seedLink
// }


exports.up = async function (db){
  await db.addColumn('ads', 'views', {
      type: 'int',
      defaultValue: 0
  })
}

// exports.down = async db => {
//   await db.dropTable('ads')
// }

// exports._meta = {
//   version: 1
// }
