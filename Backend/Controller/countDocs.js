import mongoose from "mongoose";
import Entry from "../models/Entry.js";



export default async function countDocs(req,res) {
  try {
    const counts = await Entry.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(counts)
  } catch (err) {
    console.log(err);
    res.status(500).json(err)
  }
}
