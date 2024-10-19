class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EmailAlreadyExists extends BaseError {
  constructor() {
    super("Email is already taken");
  }
}

export class InvalidCredentials extends BaseError {
  constructor() {
    super("Invalid Credentials");
  }
}

export class NoConversationFound extends BaseError {
  constructor() {
    super("No conversation was found");
  }
}

export class PermissionError extends BaseError {
  constructor() {
    super("No permission")
  }
}
