import { env } from "../../config";

export const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Resource ${req.originalUrl} not found.`);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : req.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: env === "development" ? err.stack : "Stack",
  });
};
