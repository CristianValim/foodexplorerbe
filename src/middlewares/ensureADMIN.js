const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");
const knex = require("../database/knex");

async function ensureADMIN(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token nao informado", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuario nao encontrado");
    }

    if (user.role !== "admin") {
      throw new AppError("Permissao negada");
    }
    request.user = {
      id: Number(user_id),
      role: user.role,
    };

    return next();
  } catch (error) {
    console.error("Erro na autenticacao:", error);
    throw new AppError("JWT token invalido");
  }
}

module.exports = ensureADMIN;
