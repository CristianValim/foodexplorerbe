exports.up = async (knex) => {
	console.log('Running migration to create favorites table');
	await knex.schema.createTable('favorites', (table) => {
		table.increments('id').primary();
		table.integer('user_id').notNullable();
		table.integer('dish_id').notNullable();

		table
			.foreign('user_id')
			.references('id')
			.inTable('users')
			.onDelete('CASCADE');
		table
			.foreign('dish_id')
			.references('id')
			.inTable('dishes')
			.onDelete('CASCADE');
	});
	console.log('Migration completed: favorites table created');
};

exports.down = async (knex) => {
	console.log('Running migration to drop favorites table');
	await knex.schema.dropTable('favorites');
	console.log('Migration completed: favorites table dropped');
};
