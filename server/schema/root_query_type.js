
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
const PageType =  require('./types/page_type');
const Page = mongoose.model('page');

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
                return Sealer.find({deleted: false});
            }
        },
        modules: {
            type: new GraphQLList(ModuleType),
            resolve(parentValue) {
                return Module.find({defaultModule: true, deleted: false});
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
                return Group.find({defaultGroup: true, deleted: false});
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
                return Category.find({deleted: false});
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
                return Client.find({deleted: false});
            }
        },
        client: {
            type: ClientType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Client.findById({_id: id});
            }
        },
        pages: {
            type: new GraphQLList(PageType),
            resolve(parentValue) {
                return Page.find({deleted: false});
            }
        },
        page: {
            type: PageType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Page.findById({_id: id});
            }
        }
    })
});

module.exports = RootQuery;
