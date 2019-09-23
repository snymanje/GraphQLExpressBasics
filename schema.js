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
