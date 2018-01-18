const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt, GraphQLBoolean } = graphql;
const GraphQLDate = require('graphql-date');
const ModuleType = require('./module_type');
const Group = mongoose.model('group');

const GroupType = new GraphQLObjectType({
  name:  'GroupType',
  fields: () => ({
      _id: {type: GraphQLID},
      name: {type: GraphQLString},
      subTotal: {type: GraphQLInt},
      tstamp: {type: GraphQLDate},
      modules: {
          type: new GraphQLList(ModuleType),
          resolve(parentValue) {
              return Group.findModules(parentValue._id);
          }
      },
      type: {type: GraphQLInt},
      order: {type: GraphQLInt},
      groupNew: {type: GraphQLBoolean},
      defaultGroup: {type: GraphQLBoolean},
      deleted: {type: GraphQLBoolean}
  })
});

module.exports = GroupType;
