module.exports = {
  client: "postgresql",
  connection: {
    database: "test1",
    user: "postgres",
    password: "postgres"
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "knex_migrations"
  }
};
