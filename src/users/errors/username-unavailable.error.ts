export class UsernameUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UsernameUnavailableError';
  }
}
