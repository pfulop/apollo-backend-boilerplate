exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('roles', (table) => {
      table.increments();
      table.string('name');
    }),
    knex.schema.createTable('users', (table) => {
      table.increments();
      table.timestamps();
      table.string('email').unique();
      table.string('password');
      table.string('tempPassword');
      table.integer('roleId').unsigned().index().references('id')
      .inTable('roles');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('roles'),
  ]);
};
