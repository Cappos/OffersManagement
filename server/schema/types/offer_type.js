const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLBoolean } = graphql;
const GraphQLDate = require('graphql-date');
const ClientType = require('./client_type');
const SelerType = require('./sealer_type');
const GroupType = require('./group_type');
const PageType = require('./page_type');
const Offer = mongoose.model('offer');


const OfferType = new GraphQLObjectType({
  name:  'OfferType',
  fields: () => ({
      _id: {type: GraphQLID},
      offerNumber: { type: GraphQLString },
      offerTitle: { type: GraphQLString },
      bodytext: { type: GraphQLString },
      totalPrice: { type: GraphQLInt },
      tstamp: { type: GraphQLDate },
      client: {
          type: new GraphQLList(ClientType),
          resolve(parentValue) {
              return Offer.findClient(parentValue._id);
          }
      },
      groups: {
          type: new GraphQLList(GroupType),
          resolve(parentValue) {
              return Offer.findGroups(parentValue._id);
          }
      },
      pages: {
          type: new GraphQLList(PageType),
          resolve(parentValue) {
              return Offer.findPages(parentValue._id);
          }
      },
      sealer: {
          type: new GraphQLList(SelerType),
          resolve(parentValue) {
              return Offer.findSealer(parentValue._id);
          }
      },
      deleted: {type: GraphQLBoolean}
  })
});

module.exports = OfferType;
