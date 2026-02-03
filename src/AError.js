// src/Error.js

class ActionError extends Error {
  constructor(message, { exit = 'rest', httpStatus = 500, rpcCode = -32000 } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.exit = exit;             // exit key to invoke
    this.httpStatus = httpStatus; // HTTP status for REST
    this.rpcCode = rpcCode;       // JSON-RPC error code for MCP
  }
}

class BadRequestError extends ActionError {
  constructor(msg) { super(msg, { exit: 'badRequest',    httpStatus: 400, rpcCode: -32600 }); }
}

class UnauthorizedError extends ActionError {
  constructor(msg) { super(msg, { exit: 'unauthorized',   httpStatus: 401, rpcCode: -32001 }); }
}

class ForbiddenError extends ActionError {
  constructor(msg) { super(msg, { exit: 'forbidden',      httpStatus: 403, rpcCode: -32003 }); }
}

class NotFoundError extends ActionError {
  constructor(msg) { super(msg, { exit: 'notFound',      httpStatus: 404, rpcCode: -32004 }); }
}

class ConflictError extends ActionError {
  constructor(msg) { super(msg, { exit: 'conflict',      httpStatus: 409, rpcCode: -32005 }); }
}

class ValidationError extends ActionError {
  constructor(msg) { super(msg, { exit: 'validationError',httpStatus: 422, rpcCode: -32006 }); }
}

class TimeoutError extends ActionError {
  constructor(msg) { super(msg, { exit: 'timeout',       httpStatus: 504, rpcCode: -32007 }); }
}

class InternalError extends ActionError {
  constructor(msg) { super(msg, { exit: 'internalError', httpStatus: 500, rpcCode: -32603 }); }
}

class UnavailableError extends ActionError {
  constructor(msg) { super(msg, { exit: 'unavailable',   httpStatus: 503, rpcCode: -32008 }); }
}

// Attach to global for easy developer access
global.AError = {
  BadRequest:  BadRequestError,
  Unauthorized: UnauthorizedError,
  Forbidden:    ForbiddenError,
  NotFound:     NotFoundError,
  Conflict:     ConflictError,
  Validation:   ValidationError,
  Timeout:      TimeoutError,
  Internal:     InternalError,
  Unavailable:  UnavailableError
};

module.exports = global.AError;
