const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const db = new sqlite3.Database("./cricketTeam.db");

app.use(express.json());

app.get("/players/", (req, res) => {
  const sql =
    "SELECT player_id, player_name, jersey_number, role FROM cricket_team";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/players", (req, res) => {
  const sql =
    "INSERT INTO cricket_team (player_name, jersey_number, role) VALUES (?,?,?)";
  const params = [req.body.playerName, req.body.jerseyNumber, req.body.role];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Player added to team" });
  });
});

app.get("/players/:playerId", (req, res) => {
  const sql =
    "SELECT player_id, player_name, jersey_number, role FROM cricket_team WHERE player_id = ?";
  const params = [req.params.playerId];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

app.put("/players/:playerId", (req, res) => {
  const sql =
    "UPDATE cricket_team SET player_name = ?, jersey_number = ?, role = ? WHERE player_id = ?";
  const params = [
    req.body.playerName,
    req.body.jerseyNumber,
    req.body.role,
    req.params.playerId,
  ];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Player details updated" });
  });
});

app.delete("/players/:playerId", (req, res) => {
  const sql = "DELETE FROM cricket_team WHERE player_id = ?";
  const params = [req.params.playerId];
  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Player removed" });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
