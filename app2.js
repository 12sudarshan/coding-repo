const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const databasePath = path.join(__dirname, "covid19India.db");
const app = express();
app.use(express.json());

let database = null;
const initializeDbAndSever = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DBError:${error.message}`);
    process.exit(1);
  }
};
initializeDbAndSever();

const convertStateDbObjectToResponseObject = (dbObject) => {
  return {
    stateId: dbObject.state_id,
    stateName: dbObject.state_name,
    population: dbObject.population,
  };
};

const convertDistrictDbObjectToResponseObject = (dbObject) => {
  return {
    districtId: dbObject.district_id,
    districtName: dbObject.district_name,
    stateId: dbObject.state_id,
    cases: dbObject.cases,
    cured: dbObject.cured,
    active: dbObject.active,
    deaths: dbObject.deaths,
  };
};

app.get("/states/", async (request, response) => {
  const getStateQuery = `
    SELECT 
    *
    FROM
    state;`;
  const statesArray = await database.all(getStateQuery);
  response.send(statesArray);
});

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getStateIdQuery = `
    SELECT 
    state_id, 
    state_name, population 
    FROM 
    state 
    WHERE state_id = 8;`;
  const state = await database.get(getStateIdQuery);
  response.send(state);
});

app.post("/district", async (request, response) => {
  let districtName = req.body.districtName;
  let stateId = req.body.stateId;
  let cases = req.body.cases;
  let cured = req.body.cured;
  let active = req.body.active;
  let deaths = req.body.deaths;
  const postDistrictsQuery = `INSERT INTO 
    district_id (district_name, state_id, cases, cured, active, deaths) 
    VALUES ('${districtName}','${stateId}','${cases}','${cured}','${active}','${deaths}'),[districtName, stateId, cases, cured, active, deaths];`;

  const district = await database.run(postDistrictsQuery);
  response.send(district);
  response.send("District Successfully Added");
});
