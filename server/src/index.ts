// Use ES module imports
import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

// For env File - needs to be configured at the top
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server using ES Modules!");
});

app.get("/api/greet", (req: Request, res: Response) => {
  const name = req.query.name || "World";
  res.json({ message: `Hello, ${name}!` });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  // We can use a template literal for the URL
  console.log(`Server is running at http://localhost:${port}`);
});
