import fs from "fs";
import path from "path";
import dbConnect from "../apps/platform/src/lib/dbConnect"; // Adjust the path to your dbConnect file
import Result from "../apps/platform/src/lib/models/result"; // Adjust the path to your Result model

(async () => {
  try {
    // Connect to the database
    await dbConnect();

    // Path to the JSON file
    const filePath = path.join(__dirname, "./data.json");

    // Read the file
    const data = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(data);

    // Save the data to the database
    const result = await Result.insertMany(jsonData); // Use insertMany for an array of objects
    console.log("Data saved to MongoDB:", result);

    process.exit(0); // Exit the process after successful execution
  } catch (error) {
    console.error("Error:", error);
    process.exit(1); // Exit with error
  }
})();
