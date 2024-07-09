const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, password, role } = request.body;

    if (!name || !email || !password) {
      throw new AppError("Todos campos são obrigatórios", 400);
    }

    const database = await sqliteConnection();
    const checkUserExist = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExist) {
      throw new AppError("E-mail já cadastrado.", 409);
    }

    const hashedPassword = await hash(password, 8);
    const userRole = role || "user";

    await database.run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, userRole]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password, role } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para atualizar a senha."
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError(
          "A senha antiga está incorreta. Por favor, verifique e tente novamente."
        );
      }

      user.password = await hash(password, 8);
    }

    // Permite atualização do campo "role" se fornecido
    // Você pode adicionar verificações adicionais aqui, como garantir que apenas administradores possam mudar o papel
    user.role = role ?? user.role;

    await database.run(
      `UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      role = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user.role, user_id]
    );

    return response.json();
  }
}

module.exports = UsersController;
