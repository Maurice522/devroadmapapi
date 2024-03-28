const app = require("express")();
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const PORT = process.env.SERVER_PORT || 3000;
const fs = require("fs");
const overview = require("./function/overview");
const daytoday = require("./function/daytoday");

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  };
  app.use(cors(corsOptions));
  // app.options('*', cors())
  app.use(bodyParser.json());

  app.get("/", (req,res)=>{
    res.send("Hmm...")
  })

app.get("/logo.svg", (req, res) => {
    res.sendFile(path.join(__dirname, "logo.svg"));
  });
  app.get("/openai", (req,res)=>{
    res.send(process.env.OPENAI_API_KEY)
  })
  app.post('/overview', async (req, res) => {
    try {
      
      console.log(req.body);

      const {student, company, time, role} = req.body;
      
  
      if (!student || !company || !time) {
        return res.status(400).json({ error: 'content missing' });
      }
  
      
      const openAIResponse = await overview(student, company, time, role);
  
      if (openAIResponse) {

        var totaltime =0;
        var timeunit="";

        openAIResponse.roadmap.map(item=>{
          var duration = item.duration.split(/(\s+)/);
          if (duration[0] >= '0' && duration[0] <= '9') {
            totaltime = totaltime + parseInt(duration[0]);
          }
          if(timeunit.length<duration[2].length)
            timeunit = duration[2];
        })

        totaltime = `${totaltime} ${timeunit}`;

        openAIResponse.totalTime = totaltime;

        return res.status(200).json(openAIResponse);
      } else {
        return res.status(500).json({ error: 'Error processing data' });
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/daytoday', async (req, res) => {
    try {
      
      console.log(req.body);

      const {roadmap, generalTips} = req.body;

      // console.log(roadmap[0])

      
      
  
      if (!roadmap) {
        return res.status(400).json({ error: 'content missing' });
      }
      
      var plans = [];
      let promise = Promise.resolve()
      var maxday =0;
      roadmap.map((item,index)=>{
        promise = promise.then(async()=>{

          var plan=await daytoday(item, generalTips)
          plan.plan.map((item, index)=>{
            item.day=maxday+item.day;

            if(index==plan.plan.length-1){
              maxday = item.day;
            }
          })
          plans = [...plans, ...plan.plan]
          console.log("90 plans",plans)

          if(index == roadmap.length-1){
            const openAIResponse = plans;

            if (openAIResponse!=null || openAIResponse !=undefined || openAIResponse!="") {
              return res.status(200).json(openAIResponse);
            } else {
              return res.status(500).json({ error: 'Error processing data' });
            }
              }
            })
        
      })
      // const openAIResponse = await daytoday(roadmap[0]);
    
      
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

app.listen(PORT, () => {
    const date = new Date();
    console.log("Listening on " + PORT);
  });