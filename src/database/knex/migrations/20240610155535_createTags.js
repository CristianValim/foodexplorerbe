exports.up = async (knex) => {
  console.log("Running migration to create tags table");
  await knex.schema.createTable("tags", (table) => {
    table.increments("id");
    table.text("name").notNullable();
    table
      .integer("dish_id")
      .references("id")
      .inTable("dishes")
      .onDelete("CASCADE");
  });
  console.log("Migration completed: tags table created");
};

exports.down = async (knex) => {
  console.log("Running migration to drop tags table");
  await knex.schema.dropTable("tags");
  console.log("Migration completed: tags table dropped");
};
