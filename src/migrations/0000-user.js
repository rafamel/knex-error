exports.up = (knex, Promise) => {
  return knex.schema.createTable('user', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table
      .string('username')
      .unique()
      .notNullable();
    table
      .string('email')
      .unique()
      .notNullable();
    table.string('hash').notNullable();
    table.boolean('locked').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('user');
};
