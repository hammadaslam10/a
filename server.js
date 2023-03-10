const app = require("./app");
const cloudinary = require("cloudinary");
// const dotenv = require("dotenv");

const connectDataBase = require("./config/database");

// Handling Uncaught Exception:

process.on("uncaughtException", (err)=>{
    console.log(`Error ${err.message}`);
    console.log(`Shutting down the server due to unhandled exception`);
    process.exit(1);
})


// Config:
if(process.env.NODE_ENV !== "PRODUCTION"){
   require("dotenv").config({path:"config/config.env"});
}

//Connecting to database:
connectDataBase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is working on port http:localhost:${process.env.PORT}`);
})



// Unhandled Promise Rejection:

process.on("unhandledRejection", (err)=>{
    console.log(`Error ${err.message}`);
    console.log(`Shutting down the server due to Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    })

})
