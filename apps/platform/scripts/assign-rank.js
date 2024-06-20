import mongoose from "mongoose";
import ResultModel from "src/models/result";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}
const opts = {
  dbName,
};

// Function to update the rank based on the given criteria
const updateRank = async (criteria, rankType) => {
  try {
    // Sort the documents based on the latest CGPI in descending order
    const sortedResults = await ResultModel.find(criteria)
      .sort({ "semesters.cgpi": -1 })
      .lean();

    console.log(`updating ${rankType} ranks...`);
    // Update the rank for each document
    for (let i = 0; i < sortedResults.length; i++) {
      const result = sortedResults[i];
      console.log(`updating rank for ${result.rollNo}`);
      await ResultModel.updateOne(
        { _id: result._id },
        { $set: { [`rank.${rankType}`]: i + 1 } }
      );
      console.log(`Updated rank for ${result.rollNo}`);
    }

    console.log(`${rankType} ranks updated successfully.`);
  } catch (error) {
    console.error(`Error updating ${rankType} ranks:`, error);
  }
};

// Function to update all ranks
const updateAllRanks = async () => {
  try {
    await mongoose
      .connect(
        `${MONGODB_URI} + "?retryWrites=true&w=majority&appName=nith"`,
        opts
      )
      .then(() => console.log("Connected to database"))
      .catch((error) =>
        console.error("Error connecting to database:", error.message)
      );

    // Update college rank (based on the entire collection)
    await updateRank({}, "college");

    // Update batch rank (based on the batch)
    const batches = await ResultModel.distinct("batch");
    for (const batch of batches) {
      await updateRank({ batch }, "batch");
    }

    // Update branch rank (based on the branch)
    const branches = await ResultModel.distinct("branch");
    for (const branch of branches) {
      await updateRank({ branch }, "branch");
    }

    // Update class rank (based on both branch and batch)
    for await (const batch of batches) {
      for await (const branch of branches) {
        await updateRank({ branch, batch }, "class");
      }
    }

    console.log("All ranks updated successfully.");
  } catch (error) {
    console.error("Error updating ranks:", error);
  }
};

// Call the function to update all ranks
updateAllRanks();
