import express from "express";
import mongoose from "mongoose";
import Entry from "../models/Entry.js";
import { globalSearch } from "../Controller/globalSearch.js";

const router = express.Router();

router.get('/',globalSearch)

export default router;
