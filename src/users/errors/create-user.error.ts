export class CreateUserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CreateUserError';
  }
}
