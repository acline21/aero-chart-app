import express from "express";
import cors from "cors";
import { getAirport, searchAirports } from "./airports.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/airports/search", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  res.json(searchAirports(q));
});

app.get("/api/airports/:ident", (req, res) => {
  const airport = getAirport(req.params.ident);
  if (!airport) {
    res.status(404).json({ error: "Airport not found" });
    return;
  }
  res.json(airport);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});