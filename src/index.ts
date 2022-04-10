import "reflect-metadata";

import { config } from "dotenv"; 
config();
import {createConnection} from "typeorm";
import { ExpressApplication } from "./app";
import http from "http";

import resolveContainer from "./container";

async function startApplication(){

    try {
        await createConnection();
        console.log("Connected to the Database successfully");

        
        const expressApplication = new ExpressApplication(resolveContainer());
        const server = http.createServer(expressApplication.getApplicationInstance());

        const hostname = process.env.HOST_NAME || "localhost";
        const port = process.env.PORT_NUMBER || 15000;

        await server.listen({hostname,port});
        console.log(`HTTP Server is up and running at http://${hostname}:${port}`);

    

    } catch (error) {
        console.log("Unable to start application");
        console.log(error);
    }
}

startApplication();