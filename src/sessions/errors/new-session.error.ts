export class NewSessionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NewSessionError';
  }
}
