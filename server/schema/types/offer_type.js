const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } = graphql;
const GraphQLDate = require('graphql-date');
const ClientType = require('./client_type');
const GroupType = require('./group_type');
const OfferDescriptionType = require('./offerDescription_type');
const Offer = mongoose.model('offer');

const OfferType = new GraphQLObjectType({
  name:  'OfferType',
  fields: () => ({
      _id: {type: GraphQLID},
      offerNumber: { type: GraphQLString },
      bodytext: { type: GraphQLString },
      totalPrice: { type: GraphQLInt },
      tstamp: { type: GraphQLDate },
      crdate: { type: GraphQLDate },
      client: {
          type: new GraphQLList(ClientType),
          resolve(parentValue, args) {
             console.log(parentValue, args);
          }
      },
      offerDescription: {
          type: new GraphQLList(OfferDescriptionType),
          resolve(parentValue, args) {
              console.log(parentValue, args);
          }
      },
      groups: {
          type: new GraphQLList(GroupType),
          resolve(parentValue, args) {
              console.log(parentValue, args);
          }
      }
  })
});

module.exports = OfferType;
