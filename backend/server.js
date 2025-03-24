require("dotenv").config(); 
const app = require("./app");
const path = require("path");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 8000; 


connectDatabase();


const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port: ${PORT} in ${process.env.NODE_ENV} mode`);
});


process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  console.log("🔴 Shutting down the server due to an unhandled promise rejection...");

  
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught exception error');
    server.close(()=>{
        process.exit(1);
    })
})



