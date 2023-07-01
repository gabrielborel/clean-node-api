import "module-alias/register";
import { MongoHelper } from "@/infra/db/mongodb/helpers/mongo-helper";
import { environment } from "./config/env";

MongoHelper.connect(environment.mongoUrl)
  .then(async () => {
    const { app } = await import("./config/app");
    app.listen(environment.port, () =>
      console.info(
        `⚡️[server]: Server is running at https://localhost:${environment.port}`
      )
    );
  })
  .catch(console.error);
