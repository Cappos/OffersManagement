const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } = graphql;
const GraphQLDate = require('graphql-date');
const ModuleType = require('./module_type');
const Group = mongoose.model('group');

const GroupType = new GraphQLObjectType({
  name:  'GroupType',
  fields: () => ({
      _id: {type: GraphQLID},
      name: {type: GraphQLString},
      bodytext: {type: GraphQLString},
      subTotal: {type: GraphQLInt},
      tstamp: {type: GraphQLDate},
      cruserId: {type: GraphQLInt},
      crdate: {type: GraphQLDate},
      modules: {
          type: new GraphQLList(ModuleType),
          resolve(parentValue, args) {
              console.log(parentValue, args);
          }
      }
  })
});

module.exports = GroupType;
