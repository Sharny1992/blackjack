/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('connects', function (connecttable) {
        connecttable.integer('userid').notNullable();
        connecttable.integer('tableid').notNullable();
        connecttable.increments('id')
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
