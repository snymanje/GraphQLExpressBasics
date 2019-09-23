const express = require("express");
// Add add expressGraphQL Middleware
const expressGraphQL = require("express-graphql");
// The graphQL Schema definition
const schema = require("./schema");

// Initializing the Express server
const app = express();

// Create one route called graphql and pass in the schema definition
app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true
  })
);

// Start express app on port 4000
app.listen(4000, () => {
  console.log("Server is running on port 4000..");
});
