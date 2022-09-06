import express from "express";
// import forceSSL from 'express-force-ssl'
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
// import { errorHandler as queryErrorHandler } from "querymen";
// import { errorHandler as bodyErrorHandler } from "bodymen";
import { env } from "../../config";
import { notFound, errorHandler } from "../error handling/errorhandlers";

export default (apiRoot, routes) => {
  const app = express();

  /* istanbul ignore next */
  // if (env === "production") {
  //   app.set("forceSSLOptions", {
  //     enable301Redirects: false,
  //     trustXFPHeader: true,
  //   });
  //   app.use(forceSSL);
  // }

  /* istanbul ignore next */
  if (env === "production" || env === "development") {
    app.use(
      cors({
        origin: "http://localhost:8000",
        credentials: true,
      })
    );
    app.use(compression());
    app.use(morgan("dev"));
  }

  // app.use(bodyParser.urlencoded({ extended: false }));
  // app.use(bodyParser.json());
  app.use(express.json());
  app.use(apiRoot, routes);
  // app.set("views", path.join(__dirname, "../../../../client/src"));
  app.use(notFound);
  app.use(errorHandler);
  // app.use(queryErrorHandler());
  // app.use(bodyErrorHandler());

  return app;
};
