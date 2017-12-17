const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt} = graphql;
const Sealer = mongoose.model('sealer');

const SealerType = new GraphQLObjectType({
    name: 'SealerType',
    fields: () => ({
        _id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        mobile: {type: GraphQLString},
        value: {type: GraphQLInt},
        active: {
            type: require('./offer_type'),
            resolve(parentValue, args) {
                console.log(parentValue, args);
            }
        }
    })
});

module.exports = SealerType;
