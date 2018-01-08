
const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull} = graphql;
const OfferType = require('./types/offer_type');
const SealerType = require('./types/sealer_type');
const offer = mongoose.model('offer');
const Sealer = mongoose.model('sealer');
const ModuleType = require('./types/module_type');
const Module = mongoose.model('module');
const GroupType = require('./types/group_type');
const Group = mongoose.model('group');
const CategoryType = require('./types/category_type');
const Category = mongoose.model('category');
const ClientType =  require('./types/client_type');
const Client = mongoose.model('client');

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
                return Module.find({defaultModule: true});
            }
        },
        module: {
            type: ModuleType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Module.findById({_id: id});
            }
        },
        groups: {
            type: new GraphQLList(GroupType),
            resolve(parentValue) {
                return Group.find({});
            }
        },
        group: {
            type: GroupType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Group.findById({_id: id});
            }
        },
        categories: {
            type: new GraphQLList(CategoryType),
            resolve(parentValue) {
                return Category.find({});
            }
        },
        category: {
            type: CategoryType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Category.findById({_id: id});
            }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parentValue) {
                return Client.find({});
            }
        },
        client: {
            type: ClientType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Client.findById({_id: id});
            }
        },
    })
});

module.exports = RootQuery;
