export class InvalidSessionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidSessionError';
  }
}
