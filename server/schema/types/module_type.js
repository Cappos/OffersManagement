const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLBoolean } = graphql;
const GraphQLDate = require('graphql-date');
const GroupType = require('./group_type');
const Module = mongoose.model('module');

const ModuleType = new GraphQLObjectType({
  name:  'ModuleType',
  fields: () => ({
      _id: {type: GraphQLID},
      name: {type: GraphQLString},
      bodytext: {type: GraphQLString},
      price: {type: GraphQLInt},
      tstamp: {type: GraphQLDate},
      cruserId: {type: GraphQLInt},
      crdate:  {type: GraphQLDate},
      modify: {type: GraphQLBoolean},
      groupUid: {
          type: require('./group_type'),
          resolve(parentValue, args) {
              console.log(parentValue, args);
          }
      }
  })
});

module.exports = ModuleType;
