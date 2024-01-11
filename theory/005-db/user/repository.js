const knex = require("knex");
const cfg = require("../knexfile");
const { UserExitsError } = require("../errors/errors");

const db = knex(cfg);

module.exports = {
  async create({ login, password }) {

    let insertResult;
    try {
      insertResult = await db("users")
        .insert({ login, password })
        .returning("id");
    } catch (e) {
      if (e.code === "23505") {
        throw new UserExitsError(login);
      }
      throw e;
    }

    return {
      id: insertResult[0].id,
      login,
    };
  }
};
