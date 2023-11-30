const { pbkdf2 } = require("node:crypto");
const { promisify } = require("node:util");

const config = require("../../config");

const pbkdf2Promise = promisify(pbkdf2);

module.exports = {
  async hash(password) {
    const bytes = await pbkdf2Promise(password,
      config.auth.salt,
      config.auth.iterations,
      config.auth.length,
      config.auth.algo,
    );

    return bytes.toString("hex");
  },

  async verifyPassword({ password: passwordHash }, candidate) {
    const candidateHash = await this.hash(candidate);
    console.log(passwordHash, candidateHash)

    return passwordHash === candidateHash;
  }
};
