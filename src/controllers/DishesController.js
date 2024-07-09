const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class DishesController {

  // Método para criar um novo prato
  async create(request, response) {
    console.log("Iniciando criação de um novo prato...");
    console.log("Request body:", request.body);
    console.log("Request file:", request.file);

    const diskStorage = new DiskStorage();
    const { name, category, price, description, tags } = request.body;
    const { file } = request;

    if (!name || !category || !price || !description || !file) {
      console.log("Erro: Campos obrigatórios ausentes.");
      if (file) {
        await diskStorage.deleteFile(file.filename);
      }
      throw new AppError("Todos os campos são obrigatórios", 400);
    }

    const image = file.filename;

    const checkDishExist = await knex("dishes").where({ name }).first();
    if (checkDishExist) {
      console.log("Erro: Prato com o mesmo nome já existe.");
      await diskStorage.deleteFile(file.filename);
      throw new AppError("Prato com o mesmo nome cadastrado.", 409);
    }

    const filename = await diskStorage.saveFile(image);
    console.log("Imagem salva com sucesso:", filename);

    let parsedTags;
    try {
      parsedTags = JSON.parse(tags);
    } catch (error) {
      console.log("Erro ao parsear tags:", error.message);
      await diskStorage.deleteFile(file.filename);
      throw new AppError("Formato de tags inválido", 400);
    }

    const dish = await knex("dishes").insert({
      name,
      category,
      price,
      image: filename,
      description,
      tags: JSON.stringify(parsedTags),
    }, "id");

    const dish_id = dish[0].id;
    console.log("Prato criado com sucesso:", dish_id);

    if (parsedTags.length > 0) {
      const tagsInsert = parsedTags.map((tag) => ({
        dish_id,
        name: tag,
      }));
      await knex("tags").insert(tagsInsert);
      console.log("Tags inseridas com sucesso:", tagsInsert);
    }

    console.log("Prato criado com sucesso.");
    return response.status(201).json({ message: "Prato criado com sucesso." });
  }

  // Método para atualizar um prato existente
  async update(request, response) {
    console.log("Iniciando atualização de prato...");
    console.log("Request body:", request.body);
    console.log("Request params:", request.params);

    const { name, category, price, description, tags } = request.body;
    const { id } = request.params;

    try {
      let parsedTags = [];
      if (typeof tags === "string") {
        parsedTags = JSON.parse(tags);
      } else {
        parsedTags = tags;
      }

      if (!Array.isArray(parsedTags)) {
        console.log("Erro: Formato inválido para as tags.");
        return response.status(400).json({ message: "Formato inválido para as tags" });
      }

      const dish = await knex("dishes").where({ id }).first();
      if (!dish) {
        console.log("Erro: Prato não encontrado.");
        throw new AppError("Prato não encontrado.", 404);
      }

      dish.name = name ?? dish.name;
      dish.category = category ?? dish.category;
      dish.price = price ?? dish.price;
      dish.description = description ?? dish.description;
      dish.tags = JSON.stringify(parsedTags || dish.tags);

      await knex("dishes")
        .update({
          name: dish.name,
          category: dish.category,
          price: dish.price,
          description: dish.description,
          tags: dish.tags,
          updated_at: knex.fn.now(),
        })
        .where({ id });

      await knex("tags").where({ dish_id: id }).delete();
      if (parsedTags.length > 0) {
        const newTags = parsedTags.map((tag) => ({
          dish_id: id,
          name: tag,
        }));
        await knex("tags").insert(newTags);
      }

      console.log("Prato atualizado com sucesso:", id);
      return response.json({ message: "Prato atualizado com sucesso." });
    } catch (error) {
      console.error("Erro ao atualizar o prato:", error);
      return response.status(500).json({ message: "Erro ao atualizar o prato" });
    }
  }

  // Método para exibir detalhes de um prato específico
  async show(request, response) {
    console.log("Iniciando obtenção de detalhes do prato...");
    console.log("Request params:", request.params);

    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    if (!dish) {
      console.log("Erro: Prato não encontrado.");
      return response.status(404).json({ message: "Prato não encontrado." });
    }

    const tags = await knex("tags").where({ dish_id: id }).pluck("name");

    console.log("Prato encontrado:", dish);

    return response.json({ ...dish, tags });
  }

  // Método para listar todos os pratos
  async index(request, response) {
    console.log("Iniciando listagem de pratos...");

    try {
      const dishes = await knex("dishes").select("*");
      console.log("Pratos encontrados:", dishes.length);

      const dishesWithTags = await Promise.all(
        dishes.map(async (dish) => {
          const tags = await knex("tags").where({ dish_id: dish.id }).pluck("name");
          return { ...dish, tags };
        })
      );

      console.log("Pratos com tags retornados:", dishesWithTags.length);
      return response.json(dishesWithTags);
    } catch (error) {
      console.error("Erro ao buscar pratos:", error);
      throw new AppError("Erro ao buscar pratos.", 500);
    }
  }

  // Método para deletar um prato
  async delete(request, response) {
    console.log("Iniciando exclusao de prato...");
    console.log("Request params:", request.params);

    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    if (!dish) {
      console.log("Erro: Prato não encontrado.");
      throw new AppError("Prato não encontrado.", 404);
    }

    await knex("dishes").where({ id }).delete();
    await knex("tags").where({ dish_id: id }).delete();

    console.log("Prato deletado com sucesso:", id);
    return response.json({ message: "Prato deletado com sucesso." });
  }
}

module.exports = DishesController;
