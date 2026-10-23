import express from "express";
import "dotenv/config"
import { ENV } from "./config/env.js";
const app = express();
const PORT=ENV.PORT || 5000;
app.get("/api/health",(req,res)=>{
  res.status(200).json({success:true})
})
app.listen(PORT, () => {
  console.log("server is  running on port:",PORT);
});
    