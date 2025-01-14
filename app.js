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

app.get("/region-avg", (req, res) => {
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
    region: recievedRegion,
    //ensures its floating numbers
    averageRating: averageRating,
    //ensures its floating numbers
    averagefee: averageFee,
  });
});
app.get("/calc-residential", (req, res) => {
  //to extract the value of a specific query parameter (tier) so that the application can use it for processing,
  //such as filtering data, performing calculations, or generating a response
  const Recievedtier = req.query.tier;
  const apartmentsrecieved = req.query.number_of_apartments;
  const floorsrecieved = req.query.number_of_floors;

  if (!Recievedtier) {
    return res.status(400).json({
      message: "region query not recieved ",
    });
  }

  console.log("Tier Recieved from request query: ", Recievedtier);
  console.log(apartmentsrecieved);
  console.log(floorsrecieved);

  //average apartment per floor
  const averageapartment = Math.ceil(apartmentsrecieved / floorsrecieved);

  //Get the number of required elevators
  const requiredeleavator = Math.ceil(averageapartment / 6);

  //get the number of elevator floors
  const requiredbanks = Math.ceil(floorsrecieved / 20);

  //get the total number of elevators by multiplying the required elevators by the number of floors
  const allelavators = Math.ceil(requiredeleavator * requiredbanks);

  //STANDARD
  //elevator cost is 8000
  //insilattion fee is 10%

  //PREMIUM
  //elevator cost is 12000
  //insillation fee is 15%

  //EXCELIUM
  //elevator cost is 15000
  //instillation fee is 20%

  //MATH DEPENDS ON Recievedtier

  // let totalcost =
  let elavatorcost = 0;
  let elavatorfees = 0;

  if (Recievedtier === "standard") {
    elavatorcost = 8000;
    elavatorfees = 0.1;
  } else if (Recievedtier === "premium") {
    elavatorcost = 12000;
    elavatorfees = 0.15;
  } else if (Recievedtier === "excelium") {
    elavatorcost = 15000;
    elavatorfees = 0.2;
  }

  //Get the pre instillation cost by multplying elevator cost by number of elevators
  const prefee = Math.ceil(elavatorcost * allelavators);

  //Get instillation cost by multiplying pre insitillation cost by the elevator fees
  const installcost = Math.ceil(prefee * elavatorfees);

  //Get the final cost by adding the insitillation cost and pre instillation cost together
  const finalcost = Math.ceil(installcost + prefee);

  res.status(200).json({
    Recievedtier,
    prefee,
    finalcost,
  });
});

app.use(express.json());

app.post("/contact-us", (req, res) => {
 


  const firstname = req.body.first_name;
  const lastname = req.body.last_name;
  const messageback = req.body.message_back;

  //USE AN IF STATEMENT TO CONFIRM YOU RECIEVED ALL DATA
  if ( !firstname ) {
    return res.status(400).json({
      message: "Action not possible",
    });
  }
  
 else if  (!lastname) {
    return res.status(400).json({
      message: "Action not possible",
    });
  }

 else if (!messageback) {
    return res.status(400).json({
      message: "Action not possible",
    });
 }
  
  //if you did not send back an error message

  console.log(lastname)
  console.log(firstname)
  console.log(messageback)

  //include information sent by the user
 res.status(200).json({
  firstname,
   lastname,
  messageback,
  message:"thank you for your service"
    });
});



app.listen(PORT, () => {
  console.log(` server listening on port ${PORT} `);
});
