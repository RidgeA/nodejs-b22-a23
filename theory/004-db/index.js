/**
 * https://www.npmjs.com/package/pg
 * https://knexjs.org/
 * https://sequelize.org/
 */

const {setTimeout} = require("node:timers/promises");

(async () => {

  const knex = require("knex")({
    client: "pg",
    debug: true,
    connection: "postgres://postgres:root@localhost:5432",
  });

  await knex.schema.dropTableIfExists("friends");
  await knex.schema.dropTableIfExists("users");

  await knex.schema.createTable("users", function(table) {
    table.increments("id").index();
    table.text("name").index();
    table.timestamp("created_at").defaultTo("NOW");
  });

  await knex.schema.createTable("friends", function(table) {
    table.integer("user_1_id").unsigned();
    table.integer("user_2_id").unsigned();
    table.timestamp("updated_at").defaultTo("NOW")
    table.foreign("user_1_id").references("users.id");
    table.foreign("user_2_id").references("users.id");
    table.unique(["user_1_id", "user_2_id"]);
  });

  const tx = await knex.transaction()

  try {
    const ids = await tx("users").insert([
      { name: "user1" },
      { name: "user2" },
    ]).returning("id");

    await tx("friends").insert({
      user_1_id: ids[0].id,
      user_2_id: ids[1].id,
    });

    throw new Error("something went wrong")

    console.log(await tx("friends").select('*'))

    await setTimeout(100);

    await tx("friends").insert({
      user_1_id: ids[0].id,
      user_2_id: ids[1].id,
    }).onConflict(["user_1_id", "user_2_id"]).merge({"updated_at":"NOW"});

    console.log(await tx("friends").select('*'));
    tx.commit()
  } catch (e){
    tx.rollback()
    throw e;
  }

  // const toInsert = []
  // for (let i = 0; i < 10; i++) {
  //   toInsert.push({name: `name ${i}`})
  // }
  // await knex("test").insert(toInsert)

  // const result1 = await knex("test").select("id", "name");
  // console.log(result1);
  //
  // const result2 = await knex("test").select("id", "name", "created_at").where("id", ">=", 5);
  // console.log(result2);

  await knex.destroy();

})().catch(console.error);


