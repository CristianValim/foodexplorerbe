const sqliteConnection = require("../database/sqlite");

class UserRepository {
  async findByEmail(email) {
    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    return user;
  }

  async create({name, email, password, role}) {
    const database = await sqliteConnection();

    const userId = await database.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",[name, email, password, role]);

    return { id : userId, email: email, password: password, role: role };
  }
}

module.exports = UserRepository;
