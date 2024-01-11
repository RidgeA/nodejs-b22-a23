class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
  }
}

class UniqueConstraintError extends Error {
  constructor(message = "Unique constraint violation") {
    super(message);
  }
}

class UserNotFoundError extends NotFoundError {
  login;

  constructor(login) {
    super(`User with login "${login}" not found`);
    this.login = login;
  }
}

class UserExitsError extends UniqueConstraintError {
  login;

  constructor(login) {
    super(`User with login "${login}" already exists`);
    this.login = login;
  }
}

module.exports = {
  NotFoundError,
  UniqueConstraintError,

  UserNotFoundError,
  UserExitsError,
};
