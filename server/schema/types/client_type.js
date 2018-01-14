const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean } = graphql;
const GraphQLDate = require('graphql-date');
const Client = mongoose.model('client');

const ClientType = new GraphQLObjectType({
  name:  'ClientType',
  fields: () => ({
      _id: {type: GraphQLID},
      contactPerson:  { type: GraphQLString },
      companyName:  { type: GraphQLString },
      address:  { type: GraphQLString },
      contactPhone:  { type: GraphQLString },
      mobile:  { type: GraphQLString },
      mail:  { type: GraphQLString },
      webSite:  { type: GraphQLString },
      pib:  { type: GraphQLString },
      tstamp: {type: GraphQLDate},
      offers:  {
          type: require('./offer_type'),
          resolve(parentValue) {
              return Client.findOffer(parentValue._id);
          }
      },
      deleted: {type: GraphQLBoolean}
  })
});

module.exports = ClientType;
