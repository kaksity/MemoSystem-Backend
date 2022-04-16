import express from "express";
import  { Application } from "express";
import { IRoute } from "./interfaces/route.interfaces";

import cors from "cors";
import morgan from "morgan";
import path from "path";
export class ExpressApplication{
    private application: Application;

    constructor(routes: IRoute[]) {
        this.application = express();
        this.InitializeMiddlewares();
        this.InitializePublicFolder();
        this.InitializeRoutes(routes);
    }

    private InitializeMiddlewares(): void
    {
        this.application.use(express.json());
        this.application.use(express.urlencoded({ extended:false }));
        this.application.use(morgan('combined'));
        this.application.use(cors({
            origin: '*',
            methods: ['GET','POST','PUT','DELETE']
        }));
    }
    public InitializePublicFolder()
    {
        this.application.use('/public/uploads',express.static(path.join(__dirname,'..','uploads')));
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