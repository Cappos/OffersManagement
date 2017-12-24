const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLFloat, GraphQLList} = graphql;
const mongoose = require('mongoose');
const Sealer = mongoose.model('sealer');
const SealerType = require('./types/sealer_type');
const Module = mongoose.model('module');
const ModuleType = require('./types/module_type');
const CategoryType = require('./types/category_type');
const Category = mongoose.model('category');

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
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Sealer.findOneAndRemove({_id: id});
            }
        },
        editSealer: {
            type: SealerType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLString},
                mobile: {type: GraphQLString}
            },
            resolve(parentValue, args) {
                return Sealer.findOneAndUpdate({_id: args.id}, {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                        mobile: args.mobile
                    }
                }, { new: true });
            }
        },
        addModule: {
            type: ModuleType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                bodytext: {type: GraphQLString},
                price: {type: GraphQLFloat},
                tstmp: {  type: GraphQLString },
                groupId: {type: GraphQLID}
            },
            resolve(parentValue, { name, bodytext, price, tstmp,  groupId}) {
                return Module.addCategory(name, bodytext, price, tstmp,  groupId);
            }
        },
        editModule: {
            type: ModuleType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                bodytext: {type: GraphQLString},
                price: {type: GraphQLFloat},
                tstmp: {  type: GraphQLString },
                groupId: {type: GraphQLID}
            },
            resolve(parentValue, args) {
                return Sealer.findOneAndUpdate({_id: args.id}, {
                    $set: {
                        name: args.name,
                        email: args.email,
                        phone: args.phone,
                        mobile: args.mobile
                    }
                }, { new: true });
            }
        },
        deleteModule: {
            type: ModuleType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Module.findOneAndRemove({_id: id});
            }
        },
        addCategory: {
            type: CategoryType,
            args: {
                name: {type: GraphQLString},
                value: {type: GraphQLInt},
                tstamp: {type: GraphQLString}
            },
            resolve(parentValue, args) {
                return (new Category(args)).save()
            }
        },
    }
});

module.exports = mutation;
