import { Express, Router } from "express";
import { readdir } from "fs/promises";

export const setupRoutes = async (app: Express): Promise<void> => {
  const router = Router();
  app.use("/api", router);

  await readdir(`${__dirname}/../routes`).then(async (files) => {
    for (const file of files) {
      if (file.includes(".test.")) continue;
      await import(`../routes/${file}`).then((module) => {
        module.default(router);
      });
    }
  });
};
