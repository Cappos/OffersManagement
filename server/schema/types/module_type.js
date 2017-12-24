const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLFloat } = graphql;
const GraphQLDate = require('graphql-date');
const CategoryType = require('./category_type');
const Module = mongoose.model('module');

const ModuleType = new GraphQLObjectType({
  name:  'ModuleType',
  fields: () => ({
      _id: {type: GraphQLID},
      name: {type: GraphQLString},
      bodytext: {type: GraphQLString},
      price: {type: GraphQLFloat},
      tstamp: {type: GraphQLDate},
      cruserId: {type: GraphQLInt},
      crdate:  {type: GraphQLDate},
      groupId: {
          type: new GraphQLList(CategoryType),
          resolve(parentValue) {
              return Module.findCategory(parentValue.id);
          }
      }
  })
});

module.exports = ModuleType;
