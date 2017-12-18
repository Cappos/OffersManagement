const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLNonNull} = graphql;
const mongoose = require('mongoose');
const Sealer = mongoose.model('sealer');
const SealerType = require('./types/sealer_type');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addSealer: {
            type: SealerType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLString},
                mobile: {type: GraphQLString},
                value: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args) {
                return (new Sealer(args)).save()
            }
        },
        deleteSealer: {
            type: SealerType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parentValue, { id }) {
                return Sealer.findOneAndRemove({ _id: id });
            }
        }
    }
});

module.exports = mutation;
