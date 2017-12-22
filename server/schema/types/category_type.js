const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt} = graphql;
const GraphQLDate = require('graphql-date');
const Category = mongoose.model('category');

const CategoryType = new GraphQLObjectType({
  name:  'CategoryType',
  fields: () => ({
      _id: {type: GraphQLID},
      name: { type: GraphQLString },
      value: {type: GraphQLInt},
      tstamp: {type: GraphQLDate}
  })
});

module.exports = CategoryType;
