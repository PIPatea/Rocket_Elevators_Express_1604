const dotenv = require("dotenv");
const express = require("express");
//how to implement file from file
const { agents } = require("./agents");
dotenv.config();
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

app.get("/error", (request, response) => {
  console.log(`error`);
  return response.status(500).send("error cant not enter");
});

app.get("/email-list", (req, res) => {
  // Create comma-delimited email list
  const emailList = agents.map((agent) => agent.email).join(", ");
  //sends a response back to the client
  return res.json({ emails: emailList });
});

app.get("/region-avg", (reg, res) => {
  //to extract the value of a specific query parameter (region) so that the application can use it for processing,
  //such as filtering data, performing calculations, or generating a response
  const recievedRegion = req.query.region;
  // the server is correctly receiving the query parameter and sending it back.

  //This code ensures that the region query parameter is required. If the parameter is not included in the request,
  // the server responds with a clear error message and stops further processing.
  if (!recievedRegion) {
    return res.status(400).json({
      message: "region query not recieved ",
    });
  }
  // filters the list of agents based on the specified region.
  const filteredAgents = agents.filter(
    //oking lowercase and or upper case wording
    (agent) => agent.region.toLocaleLowerCase() === recievedRegion.toLowerCase()
  );
  //checks for any agents from the specified a region.
  if (filteredAgents.length === 0) {
    return res.json(500)({
      message: `No agents found in the supplied region: ${recievedRegion}.`,
    });
  }
  //finds agents true rating
  const totalrating = filteredAgents.reduce(
    (sum, agent) => sum + agent.rating,
    0
  );
  //finds agents true fee
  const totalfee = filteredAgents.reduce((sum, agent) => sum + agent.fee, 0);
  //recieves the average rating while also making sure no more then 2 decimals places are present
  const averageRating = (totalrating / filteredAgents.length).toFixed(2);
  //recieves the average fee while also making sure no more then 2 decimals places are present
  const averageFee = (totalfee / filteredAgents.length).toFixed(2);
  //send the final response to the client
  res.status(200).json({
    region: region,
    //ensures its floating numbers
    average: parseFloat(averageRating),
    //ensures its floating numbers
    average: parseFloat(averageFee),
  });
});

app.listen(PORT, () => {
  console.log(` server listening on port ${PORT} `);
});
