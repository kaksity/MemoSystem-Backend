import express from "express";
import  { Application } from "express";
import { IRoute } from "./interfaces/route.interfaces";

import cors from "cors";
import morgan from "morgan";

export class ExpressApplication{
    private application: Application;

    constructor(routes: IRoute[]) {
        this.application = express();
        this.InitializeMiddlewares();
        this.InitializeRoutes(routes);
    }

    private InitializeMiddlewares(): void
    {
        this.application.use(express.json());
        this.application.use(express.urlencoded({ extended:false }));
        this.application.use(morgan('combined'));
        this.application.use(cors({
            origin: '*'
        }));
    }
    private InitializeRoutes(routes: IRoute[]): void
    {
        routes.forEach(route => {
            this.application.use('/',route.router);
        });
    }
    public getApplicationInstance(): Application {
        return this.application;
    }
}