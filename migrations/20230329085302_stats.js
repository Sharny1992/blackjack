/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('stats', function (table) {
        table.increments('id');
        table.integer('userid').notNullable();
        table.integer('win').notNullable();
        table.integer('lose').notNullable();
        
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
