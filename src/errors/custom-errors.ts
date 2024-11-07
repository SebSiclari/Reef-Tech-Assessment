export class BaseError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    name: string,
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, this.constructor.prototype);
  }
}

export class YelpApiError extends BaseError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "YelpApiError");
  }
}

export class MappingError extends BaseError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "MappingError");
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "DatabaseError");
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, "ValidationError");
  }
}
