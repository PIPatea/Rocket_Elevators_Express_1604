const agents=[ 
    {first_name:"Orlando",last_name:"Perez",email:"perez@rocket.elv",region:"north",rating:"95",fee:"10000"},
    {first_name:"Brutus",last_name:"Konway",email:"brutus@rocket.elv",region:"north",rating:"92",fee:"9000"},
    {first_name:"Bob",last_name:"Boberson",email:"bob@rocket.elv",region:"east",rating:"85",fee:"10000"},
    {first_name:"John",last_name:"Johnson",email:"john@rocket.elv",region:"south",rating:"75",fee:"8000"},
    {first_name:"Jeff",last_name:"Lebow",email:"carpet@rocket.elv",region:"north",rating:"92",fee:"10000"},
    {first_name:"Elmar",last_name:"Fade",email:"elmar@rocket.elv",region:"south",rating:"95",fee:"10000"},
    {first_name:"Zed",last_name:"Roles",email:"zebra@rocket.elv",region:"north",rating:"100",fee:"4321"},
    {first_name:"Dee",last_name:"Omega",email:"omega@rocket.elv",region:"east",rating:"78",fee:"7000"},
    {first_name:"Aaron",last_name:"De Silva",email:"aaron@rocket.elv",region:"east",rating:"89",fee:"8900"},
    {first_name:"Brian",last_name:"Bossman",email:"papi@rocket.elv",region:"south",rating:"100",fee:"10001"},
    {first_name:"Bob",last_name:"Robertson",email:"bob2@rocket.elv",region:"east",rating:"85",fee:"10000"},
    {first_name:"George",last_name:"Cleese",email:"monty@rocket.elv",region:"south",rating:"85",fee:"5000"},
    {first_name:"Tanim",last_name:"Homaini",email:"tanim@rocket.elv",region:"south",rating:"96",fee:"10000"},
    {first_name:"Roger",last_name:"Babbel",email:"loons@rocket.elv",region:"north",rating:"60",fee:"5000"},
    {first_name:"Zach",last_name:"Van Den Zilch",email:"zach@rocket.elv",region:"north",rating:"70",fee:"6000"},
    {first_name:"Al",last_name:"Stein",email:"relative@rocket.elv",region:"south",rating:"54",fee:"4000"}
  ]



  module.exports={agents}




//creates a region average route
app.get('/region-avg', (req,res) => {
    //gets the region from query parameters
    const region = req.query.region;
    // checks if the region variable has a value
    if (!region) {
      return res.status(500).json({ message: "Request Query Region not received." });
    }
    if(region !== "north"||
      region !== "south"||
      region !== "east"||
      region !== "west"){
        return res.status(500).json({ message: "Invalid region recieved" });
    }
    // filters the list of agents based on the specified region.
    const filteredAgents = agents.filter(agent => agent.region.toLowerCase() === region.toLowerCase());
    //checks for any agents from the specified a region.
    if (filteredAgents.length === 0) {
      return res.json(500)({ message: `No agents found in the supplied region: ${region}.` });
    }
    //calculates the total rating of all agents within filter agents
    const totalRating = filteredAgents.reduce((sum, agent) => sum + agent.rating, 0);
    //calculates the total fee for all agents
    const totalFee = filteredAgents.reduce((sum, agent) => sum + agent.fee, 0);
      //calculates the total fee for all agents in the specified region.
    const averageRating = ((totalRating / filteredAgents.length).toFixed(2));
      //calculates the average fee of the agents in the specified region
    const averageFee = ((totalFee / filteredAgents.length).toFixed(2));
    //sends the final response back to the client
    res.json(200)({
      region: region,
       // Convert to float for proper JSON
      averageRating: parseFloat(averageRating),
       // Convert to float for proper JSON
      averageFee: parseFloat(averageFee),
    });
  });