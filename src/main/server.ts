import { app } from "./config/app";

const PORT = 3333;
app.listen(PORT, () =>
  console.info(`⚡️[server]: Server is running at https://localhost:${PORT}`)
);
