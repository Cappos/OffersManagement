
const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull} = graphql;
const OfferType = require('./types/offer_type');
const SealerType = require('./types/sealer_type');
const offer = mongoose.model('offer');
const Sealer = mongoose.model('sealer');
const ModuleType = require('./types/module_type');

const Modules = mongoose.model('module');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        offers: {
            type: new GraphQLList(OfferType),
            resolve(parentValue) {
                console.log('test');
            }
        },
        offer: {
            type: OfferType,
            args: {_id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, args) {
                console.log('test');
            }
        },
        sealers: {
            type: new GraphQLList(SealerType),
            resolve(parentValue) {
                return Sealer.find({});
            }
        },
        modules: {
            type: new GraphQLList(ModuleType),
            resolve(parentValue) {
                return Modules.find({});
            }
        },
        module: {
            type: new GraphQLList(ModuleType),
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Modules.findOne({_id: id});
            }
        },
    })
});

module.exports = RootQuery;
