export class TrendDataInsufficientError extends Error {
  constructor(message? : string) {
    super(message);
    this.name = "TrendDataInsufficientError";
  }
}
