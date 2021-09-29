import express, { Express, Router, Request, Response } from "express";
import {AuthenticationController} from "../controller/AuthenticationController";

const authenticationRouter: Router = express.Router();


authenticationRouter.post("/login",new AuthenticationController().login)