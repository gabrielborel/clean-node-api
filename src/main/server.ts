import express from "express";

const app = express();
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
