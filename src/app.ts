import 'dotenv/config' 

import express from "express";

import { Router } from "./router";

// Create Express server
const app = express();
// Express configuration
app.set("port", process.env.APP_PORT);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

Router(app);

export default app;