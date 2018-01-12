const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt} = graphql;
const GraphQLDate = require('graphql-date');

const PageType = new GraphQLObjectType({
    name: 'PageType',
    fields: () => ({
        _id: {type: GraphQLID},
        type: {type: GraphQLInt},
        title: {type: GraphQLString},
        subtitle: {type: GraphQLString},
        bodytext: {type: GraphQLString},
        tstamp: {type: GraphQLDate}
    })
});

module.exports = PageType;
