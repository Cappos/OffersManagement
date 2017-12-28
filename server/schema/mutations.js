const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLFloat, GraphQLList, GraphQLBoolean} = graphql;
const mongoose = require('mongoose');
const Sealer = mongoose.model('sealer');
const SealerType = require('./types/sealer_type');
const Module = mongoose.model('module');
const ModuleType = require('./types/module_type');
const CategoryType = require('./types/category_type');
const Category = mongoose.model('category');
const ClientType = require('./types/client_type');
const Client = mongoose.model('client');
const GroupType = require('./types/group_type');
const Group = mongoose.model('group');

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
                groupId: {type: GraphQLID},
                categoryId: {type: GraphQLID},
                moduleNew: {type: GraphQLBoolean}
            },
            resolve(parentValue, args) {
                return (new Module(args)).save()
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
                groupId: {type: GraphQLID},
                categoryId: {type: GraphQLID},
                moduleNew: {type: GraphQLBoolean}

            },
            resolve(parentValue, args) {
                return Module.findOneAndUpdate({_id: args.id}, {
                    $set: {
                        name: args.name,
                        bodytext: args.bodytext,
                        price: args.price,
                        groupId: args.groupId,
                        categoryId: args.categoryId
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
                value: {type: GraphQLString},
                tstamp: {type: GraphQLString}
            },
            resolve(parentValue, args) {
                return (new Category(args)).save()
            }
        },
        addClient: {
            type: ClientType,
            args: {
                contactPerson: {type: GraphQLString},
                companyName: {type: GraphQLString},
                address: {type: GraphQLString},
                contactPhone: {type: GraphQLString},
                mobile: {type: GraphQLString},
                mail: {type: GraphQLString},
                webSite: {type: GraphQLString},
                pib: {type: GraphQLString},
                tstmp: {type: GraphQLString},
                offers: {type: GraphQLID}
            },
            resolve(parentValue, args) {
                return (new Client(args)).save()
            }
        },
        editClient: {
            type: ClientType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                contactPerson: {type: GraphQLString},
                companyName: {type: new GraphQLNonNull(GraphQLString)},
                address: {type: GraphQLString},
                contactPhone: {type: GraphQLString},
                mobile: {type: GraphQLString},
                mail: {type: GraphQLString},
                webSite: {type: GraphQLString},
                pib: {type: GraphQLString},
                tstmp: {type: GraphQLString},
                offers: {type: GraphQLID}
            },
            resolve(parentValue, args) {
                return Client.findOneAndUpdate({_id: args.id}, {
                    $set: {
                        contactPerson: args.contactPerson,
                        companyName: args.companyName,
                        address: args.address,
                        contactPhone: args.contactPhone,
                        mobile: args.mobile,
                        mail: args.mail,
                        webSite: args.webSite,
                        pib: args.pib,
                        offers: args.offers
                    }
                }, { new: true });
            }
        },
        deleteClient: {
            type: ClientType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Client.findOneAndRemove({_id: id});
            }
        },
        addGroup: {
            type: GroupType,
            args: {
                name: {  type: GraphQLString },
                subTotal: {type: GraphQLFloat},
                tstamp: {  type: GraphQLString },
                modules: {type: GraphQLID}
            },
            resolve(parentValue, args) {
                return (new Group(args)).save()
            }
        },
        editGroup: {
            type: GroupType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                subTotal: {type: GraphQLFloat},
                modules: {type: GraphQLID}
            },
            resolve(parentValue, args) {
                return Group.findOneAndUpdate({_id: args.id}, {
                    $set: {
                        name: args.name,
                        subTotal: args.subTotal,
                        modules: args.modules
                    }
                }, { new: true });
            }
        },
        deleteGroup: {
            type: GroupType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Group.findOneAndRemove({_id: id});
            }
        },
    }
});

module.exports = mutation;
