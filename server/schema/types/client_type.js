const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID} = graphql;
const Client = mongoose.model('client');

const ClientType = new GraphQLObjectType({
  name:  'ClientType',
  fields: () => ({
      _id: {type: GraphQLID},
      clientName: { type: GraphQLString }
  })
});

module.exports = ClientType;
