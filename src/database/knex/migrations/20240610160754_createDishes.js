exports.up = async (knex) => {
  console.log("Running migration to create dishes table");
  await knex.schema.createTable("dishes", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.text("category").notNullable();
    table.text("price").notNullable();
    table.text("image").notNullable();
    table.text("description").notNullable();
    table.text("tags").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
  console.log("Migration completed: dishes table created");
};

exports.down = async (knex) => {
  console.log("Running migration to drop dishes table");
  await knex.schema.dropTable("dishes");
  console.log("Migration completed: dishes table dropped");
};
