export class YelpApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "YelpApiError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, YelpApiError.prototype);
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "DatabaseError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
