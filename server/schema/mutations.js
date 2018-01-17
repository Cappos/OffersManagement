const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLFloat, GraphQLList, GraphQLBoolean} = graphql;
const GraphQLJSON = require('graphql-type-json');
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
const PageType = require('./types/page_type');
const Page = mongoose.model('page');
const OfferType = require('./types/offer_type');
const Offer = mongoose.model('offer');


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
                return Sealer.findOneAndUpdate({_id: id}, {
                    $set: {
                        deleted: true
                    }
                }, {new: true});
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
                }, {new: true});
            }
        },
        addModule: {
            type: ModuleType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                bodytext: {type: GraphQLString},
                price: {type: GraphQLFloat},
                tstmp: {type: GraphQLString},
                groupId: {type: GraphQLID},
                categoryId: {type: GraphQLID},
                moduleNew: {type: GraphQLBoolean},
                defaultModule: {type: GraphQLBoolean}
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
                tstmp: {type: GraphQLString},
                groupId: {type: GraphQLID},
                categoryId: {type: GraphQLID}

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
                }, {new: true});
            }
        },
        deleteModule: {
            type: ModuleType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Module.findOneAndUpdate({_id: id}, {
                    $set: {
                        deleted: true
                    }
                }, {new: true});
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
                }, {new: true});
            }
        },
        deleteClient: {
            type: ClientType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Client.findOneAndUpdate({_id: id}, {
                    $set: {
                        deleted: true
                    }
                }, {new: true});
            }
        },
        addGroup: {
            type: GroupType,
            args: {
                name: {type: GraphQLString},
                subTotal: {type: GraphQLFloat},
                tstamp: {type: GraphQLString},
                modulesNew: {type: GraphQLJSON}
            },
            resolve(parentValue, args) {
                return Group.createGroup(args);
            }
        },
        editGroup: {
            type: GroupType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                subTotal: {type: GraphQLFloat},
                modulesNew: {type: GraphQLJSON}
            },
            resolve(parentValue, args) {
                return Group.updateGroup(args);
            }
        },
        deleteGroup: {
            type: GroupType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Group.findOneAndUpdate({_id: id}, {
                    $set: {
                        deleted: true
                    }
                }, {new: true});
            }
        },
        addPage: {
            type: PageType,
            args: {
                type: {type: GraphQLInt},
                title: {type: GraphQLString},
                subtitle: {type: GraphQLString},
                bodytext: {type: GraphQLString},
                tstamp: {type: GraphQLString}
            },
            resolve(parentValue, args) {
                return (new Page(args)).save()
            }
        },
        deletePage: {
            type: PageType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Page.findOneAndUpdate({_id: id}, {
                    $set: {
                        deleted: true
                    }
                }, {new: true});
            }
        },
        editPage: {
            type: PageType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                title: {type: new GraphQLNonNull(GraphQLString)},
                subtitle: {type: GraphQLString},
                bodytext: {type: GraphQLString}
            },
            resolve(parentValue, args) {
                return Page.findOneAndUpdate({_id: args.id}, {
                    $set: {
                        title: args.title,
                        subtitle: args.subtitle,
                        bodytext: args.bodytext
                    }
                }, {new: true});
            }
        },
        addOffer: {
            type: OfferType,
            args: {
                offerTitle: {type: new GraphQLNonNull(GraphQLString)},
                offerNumber: {type: GraphQLString},
                totalPrice: {type: GraphQLFloat},
                tstamp: {type: GraphQLString},
                bodytext: {type: GraphQLString},
                client: {type: GraphQLID},
                sealer: {type: GraphQLID},
                groups: {type: GraphQLID},
                groupsNew: {type: GraphQLJSON}
            },
            resolve(parentValue, args) {
                return Offer.createOffer(args);
            }
        },
        deleteOffer: {
            type: OfferType,
            args: {id: {type: new GraphQLNonNull(GraphQLID)}},
            resolve(parentValue, {id}) {
                return Offer.findOneAndUpdate({_id: id}, {
                    $set: {
                        deleted: true
                    }
                }, {new: true});
            }
        }
    }
});

module.exports = mutation;
