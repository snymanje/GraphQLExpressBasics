---
title: A Basic Grapghql enpoint with nodejs and express 
excerpt: "Using Nodejs and Express to build a simple graphql endpoint"
date: 2019-09-22
tags: ["graphQL", "Javascript", "nodejs"]
keywords: "graphQL with nodejs"
cover_image: ""
---

# Creating a simple GraphQL backend with Node.js and Express
<br>
<hr>
<br>

1. First create a new nodejs project. And then install the required packages.  
I will use the json-server package to store and retrieve data from a data.json file.
```
npm init --y

npm install express graphql express-graphql axios json-server nodemon
```
<br>

2. Create a data.json file in the root of the project and add the below "customer" data to it. This data will be retrieved and updated using axios and json-server.

```json
{
  "customers": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@gmail.com",
      "age": 36
    },
    {
      "id": "2",
      "name": "Keith Wilson",
      "email": "kieth@gmail.com",
      "age": 50
    },
    {
      "id": "3",
      "name": "Tom Jones",
      "email": "tom@gmail.com",
      "age": 40
    },
    {
      "id": "5",
      "name": "Jen Thompson",
      "email": "jen@gmail.com",
      "age": 22
    },
    {
      "name": "Harry White",
      "email": "harry@gmail.com",
      "age": 34,
      "id": "rytP7hhUW"
    },
    {
      "name": "Harry White",
      "email": "jeansn@tfg.co.za",
      "age": 35,
      "id": "8XKZhXz"
    }
  ]
}
```

<br>

3. In the package.json file in the root of the project, add the below lines in the script section. The first one is to start the node server and the second one is to start the json server. 
```json
"scripts": {
    "dev": "nodemon server.js",
    "json-server": "json-server --watch data.json"
  },
```

<br>

1. Next, create a server.js file to initialize the express server.

```javascript
const express = require("express");
// Add expressGraphQL Middleware
const expressGraphQL = require("express-graphql");
// Import the graphQL Schema definition in the root of the project
const schema = require("./schema");

// Initializing the Express server
const app = express();

// Create one route called graphql and pass in the schema definition
app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    // This enable the graphql explorer where we can test queries. 
    graphiql: true
  })
);

// Start express app on port 4000
app.listen(4000, () => {
  console.log("Server is running on port 4000..");
});
```

<br>
5. Next, we need a schema.js file in the root of the project to create the graphql schema.

```javascript
// Require axios to make http requests to the json server to fetch data
const axios = require("axios");
// Use object destructuring to get the objects required to create definition
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

// Root Query
const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/customers/" + args.id)
          .then(res => res.data);
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      //not passing args so not needed
      resolve() {
        return axios
          .get("http://localhost:3000/customers")
          .then(res => res.data);
      }
    }
  }
});

// Mutations
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/customers", {
            name: args.name,
            email: args.email,
            age: args.age
          })
          .then(res => res.data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios
          .delete("http://localhost:3000/customers/" + args.id)
          .then(res => res.data);
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parentValue, args) {
        return axios
          .patch("http://localhost:3000/customers/" + args.id, args)
          .then(res => res.data);
      }
    }
  }
});

//Initialize a new GraphQLSchema instance to export, pass in the query and mutation objects.
module.exports = new GraphQLSchema({
  query,
  mutation
});

```

<br>

6. Now start the server by running the below 2 commands in separate command prompts.
```
npm run dev 

npm run json-server
```

<br>

7. Testing the endpoint by going to http://localhost:4000/graphql

<br>

Query customer by id 
```json
{
  customer(id: "1") {
    name,
    email
  }
}
```

<br>

Query all customers
```json
{
  customers {
    id,
    name,
    email,
    age
  }
}
```

<br>

Update customer by id
```json
mutation {
  editCustomer(id: "3", age: 40) {
    id,
    name,
    age
  }
}
```

<br >

Delete customer by id
```
mutation {
  deleteCustomer(id: "4") {id}
}
```
