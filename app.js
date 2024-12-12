
const dotenv=require("dotenv")
const express = require("express");
dotenv.config()
const app = express();
app.use(express.json());
const PORT = process.env.PORT;
const enviroment = process.env.enviroment;

app.get("/hello", (reguest, response) => {
  console.log(`the port in use is: ${PORT} `);

  response.send("Hello World");
});

app.get("/status", (request, response) => {
  return response.status(200).json({
    port: PORT,
    enviroment: enviroment,
  });
});

app.listen(PORT, () => {
  console.log(` server listening on port ${PORT} `);
});
