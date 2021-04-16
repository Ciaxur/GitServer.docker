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
  }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}

export {
  GeneralError,
  BadRequest,
  NotFound,
}