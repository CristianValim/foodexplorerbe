const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");
const UserRepository = require("../repositories/UserRepository");

class UsersController {
	async create(request, response) {
		const { name, email, password, role } = request.body;

		const userRepository = new UserRepository();

		if (!name || !email || !password) {
			throw new AppError("Todos campos são obrigatórios", 400);
		}

		const checkUserExist = await userRepository.findByEmail(email);

		if (checkUserExist) {
			throw new AppError("E-mail já cadastrado.", 409);
		}

		const hashedPassword = await hash(password, 8);
		const userRole = role || "user";

		userRepository.create({ name, email, password: hashedPassword, userRole });

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
			[email],
		);

		if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
			throw new AppError("Este e-mail já está em uso");
		}

		user.name = name ?? user.name;
		user.email = email ?? user.email;

		if (password && !old_password) {
			throw new AppError(
				"Você precisa informar a senha antiga para atualizar a senha.",
			);
		}

		if (password && old_password) {
			const checkOldPassword = await compare(old_password, user.password);

			if (!checkOldPassword) {
				throw new AppError(
					"A senha antiga está incorreta. Por favor, verifique e tente novamente.",
				);
			}

			user.password = await hash(password, 8);
		}

		user.role = role ?? user.role;

		await database.run(
			`UPDATE users SET 
      name = ?,
      email = ?,
      password = ?,
      role = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
			[user.name, user.email, user.password, user.role, user_id],
		);

		return response.json();
	}

	async favorite(request, response) {
		const { dish_id } = request.body;
		const user_id = request.user.id;

		const database = await sqliteConnection();

		try {
			const favorite = await database.get(
				"SELECT * FROM favorites WHERE user_id = ? AND dish_id = ?",
				[user_id, dish_id],
			);
			if (favorite) {
				await database.run(
					"DELETE FROM favorites WHERE user_id = ? AND dish_id = ?",
					[user_id, dish_id],
				);
				return response
					.status(200)
					.json({ message: "Favorite removed successfully" });
			}
			await database.run(
				"INSERT INTO favorites (user_id, dish_id) VALUES (?, ?)",
				[user_id, dish_id],
			);
			return response
				.status(201)
				.json({ message: "Favorite added successfully" });
		} catch (error) {
			console.error("Error toggling favorite:", error);
			return response.status(500).json({ error: "Failed to toggle favorite" });
		}
	}

	async getFavorites(request, response) {
		const user_id = request.user.id;

		const database = await sqliteConnection();

		try {
			const favorites = await database.all(
				"SELECT dish_id FROM favorites WHERE user_id = ?",
				[user_id],
			);
			return response.status(200).json(favorites);
		} catch (error) {
			console.error("Error fetching favorites:", error);
			return response.status(500).json({ error: "Failed to fetch favorites" });
		}
	}
}

module.exports = UsersController;
