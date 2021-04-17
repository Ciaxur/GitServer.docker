/**
 * Generically Handle thrown errors
 *  based on their Type, Status Code, and Message
 */
class GeneralError extends Error {
  public readonly message: string;
  public readonly debug?: {};
  
  constructor(message: string, debug?: {}) {
    super();
    this.message = message;
    this.debug = debug;
  }

  public getCode(): number {
    if (this instanceof BadRequest)
      return 400;
    else if (this instanceof NotFound)
      return 404;
    else if (this instanceof Conflict)
      return 409;
    else if (this instanceof InternalError)
      return 500;
  }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class InternalError extends GeneralError {}
class Conflict extends GeneralError {}

export {
  GeneralError,
  BadRequest,
  NotFound,
  InternalError,
  Conflict,
}