import express, { Request, Response } from "express";
import { Db, MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
const PASSWORD = "gHbfyIXU6Jt5FSVN";
const uri = `mongodb+srv://paarth1204rastogi:${PASSWORD}@tricard-tussle.7kdxeva.mongodb.net/Tricard?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  writeConcern: { w: "majority", j: true, wtimeout: 1000 },
});

let db: Db;

async function run() {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB");

    // Get the reference to the database
    db = client.db("Tricard");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Terminate the server if unable to connect to MongoDB
  }
}

run().catch(console.error);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, TypeScript Express Server!");
});

app.post("/submit", async (req: Request, res: Response) => {
  try {
    const { name, age, role } = req.body;

    // Check if the required data is present
    if (!name || !age || !role) {
      return res
        .status(400)
        .json({ error: "Name, age, and role are required fields." });
    }

    // Age validation
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18) {
      return res.status(400).json({ error: "Age should be 18 or older." });
    }

    // Save data to MongoDB
    await db.collection("users").insertOne({ name, age: parsedAge, role });

    return res.status(200).json({ message: "Data saved successfully." });
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.put("/update/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, age, role } = req.body;

    // Check if the required data is present
    if (!name || !age || !role) {
      return res
        .status(400)
        .json({ error: "Name, age, and role are required fields." });
    }

    // Age validation
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18) {
      return res.status(400).json({ error: "Age should be 18 or older." });
    }

    // Update user data in MongoDB
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: { name, age: parsedAge, role },
      }
    );

    if (result.matchedCount === 1) {
      return res.status(200).json({ message: "User updated successfully." });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error updating user in MongoDB:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/data", async (_req: Request, res: Response) => {
  try {
    // Fetch data from MongoDB
    const userData = await db.collection("users").find().toArray();

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Delete user from MongoDB
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      return res.status(200).json({ message: "User deleted successfully." });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user from MongoDB:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
