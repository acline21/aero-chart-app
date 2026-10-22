import express from "express";
import cors from "cors";
import { getAirport, searchAirports } from "./airports.js";
import { getMetar } from "./metar.js";

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

app.get("/api/metar/:ident", async (req, res) => {
  const ident = req.params.ident;

  if (!/^[A-Za-z0-9]{3,4}$/.test(ident)) {
    res.status(400).json({ error: "Invalid airport identifier" });
    return;
  }

  try {
    const metar = await getMetar(ident);
    if (!metar) {
      res.status(404).json({ error: "No METAR available for this airport" });
      return;
    }
    res.json(metar);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Could not reach weather service" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});