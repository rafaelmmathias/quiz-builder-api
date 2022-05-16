type CustomError = {
  statusCode: number;
};
type QuizAppException = Error & CustomError;

export const UnauthorizedException: QuizAppException = {
  statusCode: 401,
  message: "unauthorized to perform this action",
  name: "UnauthorizedException",
};

export const UnhandledException: QuizAppException = {
  statusCode: 500,
  message: "an unhandled exception ocurred, please try again",
  name: "UnhandledException",
};

export const QuizNotFoundException: QuizAppException = {
  statusCode: 404,
  message: "quiz not found",
  name: "NotFound",
};

export const QuizAlreadyPublishedException: QuizAppException = {
  statusCode: 409,
  message: "this quiz is already published and cannot be updated",
  name: "QuizAlreadyPublishedException",
};

export const ForbiddenException: QuizAppException = {
  statusCode: 403,
  message: "you cannot perform this operation",
  name: "ForbiddenException",
};
