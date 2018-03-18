const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
        id: String,
        offerNumber: String,
        offerTitle: String,
        bodytext: String,
        totalPrice: Number,
        signedPrice: {
            type: Number,
            default: 0
        },
        tstamp: {
            type: Date,
            default: Date.now
        },
        expDate: Date,
        signed: {
            type: Boolean,
            default: false
        },
        client: [{
            type: Schema.Types.ObjectId,
            ref: 'client'
        }],
        groups: [{
            type: Schema.Types.ObjectId,
            ref: 'group'
        }],
        pages: [{
            type: Schema.Types.ObjectId,
            ref: 'page'
        }],
        files: Array,
        sealer: [{
            type: Schema.Types.ObjectId,
            ref: 'sealer'
        }],
        internalHours: {
            type: Number,
            default: 0
        },
        externalHours: {
            type: Number,
            default: 0
        },
        comments: {
            type: String,
            default: "<h4>Bemerkungen</h4><ul><li>Alle Preise sind in Schweizer Franken exkl. Mehrwertsteuer angegeben.</li><li>Konditionen einmalige Kosten: 50% f&auml;llig nach Abschluss des Vertrags; Restbetrag f&auml;llig 12 Wochen nach Projektstart (Kickoff Meeting).</li><li>Die Nutzungsrechte sind f&uuml;r den Gebrauch der Webl&ouml;sung abgegolten.</li><li>Diese Offerte beh&auml;lt ihre G&uuml;ltigkeit bis zum 31. Juli 2017.</li><li>Alle Inhalte (Texte, Bilder, Logos) werden vom Kunden in digitaler Form sp&auml;testens eine Woche vor der Content-Eingabe geliefert.</li><li>Einmalige Content-Eingabe ist im Preis inbegriffen. Nachtr&auml;gliches Hinzuf&uuml;gen oder &Auml;ndern des Inhaltes wird nach Aufwand verrechnet.</li><li>Erst mit der vollst&auml;ndigen Bezahlung des vertraglich festgesetzten Preises wird das Nutzungsrecht erworben.</li></ul>"
        },
        version: {
            type: Number,
            default: 1.0
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        usePushEach: true
    });

OfferSchema.statics.findClient = function (id) {

    return this.findById(id)
        .populate({
            path: 'client',
            match: {
                deleted: false
            }
        }).then(offer => offer.client);
};

OfferSchema.statics.findGroups = function (id) {
    return this.findById(id)
        .populate({
            path: 'groups',
            match: {
                deleted: false
            }
        })
        .then(offer => offer.groups);
};

OfferSchema.statics.findPages = function (id) {
    return this.findById(id)
        .populate({
            path: 'pages',
            match: {
                deleted: false
            }
        })
        .then(offer => offer.pages);
};

OfferSchema.statics.findSealer = function (id) {
    return this.findById(id)
        .populate('sealer')
        .then(offer => offer.sealer);
};

OfferSchema.statics.createOffer = function (args) {
    const Offer = mongoose.model('offer');
    const Group = mongoose.model('group');
    const Client = mongoose.model('client');
    const Module = mongoose.model('module');
    const Page = mongoose.model('page');
    const GroupsNew = args.groupsNew;

    return this.count().then((count) => {
        args.offerNumber = '00' + (parseInt(count) + 1) + '/' + new Date().getFullYear();

        return (new Offer(args)).save().then(offer => {
            Client.findOneAndUpdate({_id: args.client},
                {
                    $push: {
                        offers: offer._id,
                    }
                }, {new: true}).then((res) => res);

            for (let e in GroupsNew) {
                if (GroupsNew.length > 0) {
                    // create new group
                    if (GroupsNew[e].type === 1) {
                        let group = new Group({
                            name: GroupsNew[e].name,
                            subTotal: GroupsNew[e].subTotal,
                            total: GroupsNew[e].total,
                            order: GroupsNew[e].order,
                            summary: GroupsNew[e].summary
                        });
                        group.save().then((res) => {
                            for (let m in GroupsNew[e].modules) {
                                if (GroupsNew[e].modules[m].moduleNew) {
                                    // create new modules form modules array
                                    let module = new Module({
                                        name: GroupsNew[e].modules[m].name,
                                        bodytext: GroupsNew[e].modules[m].bodytext,
                                        price: GroupsNew[e].modules[m].price,
                                        groupId: group._id,
                                        categoryId: GroupsNew[e].modules[m].categoryId,
                                        moduleNew: false,
                                        internalHours: GroupsNew[e].modules[m].internalHours,
                                        externalHours: GroupsNew[e].modules[m].externalHours,
                                        pricePerHour: GroupsNew[e].modules[m].pricePerHour,
                                        signed: GroupsNew[e].modules[m].signed
                                    });
                                    module.save();
                                    res.modules.push(module);
                                }
                            }
                            res.save()
                        });
                        offer.groups.push(group);
                    }
                    // create new page from pages array
                    else if (GroupsNew[e].type === 2) {
                        let page = new Page({
                            type: GroupsNew[e].type,
                            title: GroupsNew[e].title,
                            subtitle: GroupsNew[e].subtitle,
                            bodytext: GroupsNew[e].bodytext,
                            defaultPage: false,
                            order: GroupsNew[e].order
                        });
                        page.save().then((res) => res);
                        offer.pages.push(page);
                    }
                }
            }
            return Promise.all([offer.save()])
                .then(([offer]) => offer);
        });
    });
};

OfferSchema.statics.updateOffer = function (args) {
    const Group = mongoose.model('group');
    const Client = mongoose.model('client');
    const Module = mongoose.model('module');
    const Page = mongoose.model('page');
    const GroupsNew = args.groupsNew;

    // Unset offer client
    Client.findOneAndUpdate({_id: args.oldClient},
        {
            $unset: {
                offers: args._id,
            }
        }, {new: true}).then((res) => res);

    return this.findOneAndUpdate({_id: args.id},
        {
            $set: {
                offerNumber: args.offerNumber,
                offerTitle: args.offerTitle,
                totalPrice: args.totalPrice,
                signedPrice: args.signedPrice,
                bodytext: args.bodytext,
                client: args.client,
                sealer: args.sealer,
                tstamp: args.tstamp,
                expDate: args.expDate,
                signed: args.signed,
                internalHours: args.internalHours,
                externalHours: args.externalHours,
                comments: args.comments,
                files: args.files
            }
        }, {new: true}).then(offer => {

        // Set new offer client
        Client.findOneAndUpdate({_id: args.client},
            {
                $addToSet: {
                    offers: offer._id,
                }
            }, {new: true}).then((res) => res);

        for (let e in GroupsNew) {
            if (GroupsNew.length > 0) {

                if (GroupsNew[e].type === 1) {
                    // create new group
                    if (GroupsNew[e].groupNew) {
                        let group = new Group({
                            name: GroupsNew[e].name,
                            subTotal: GroupsNew[e].subTotal,
                            total: GroupsNew[e].total,
                            order: GroupsNew[e].order,
                            summary: GroupsNew[e].summary
                        });
                        group.save().then((res) => {
                            for (let m in GroupsNew[e].modules) {
                                if (GroupsNew[e].modules[m].moduleNew) {
                                    // create new modules form modules array
                                    let module = new Module({
                                        name: GroupsNew[e].modules[m].name,
                                        bodytext: GroupsNew[e].modules[m].bodytext,
                                        price: GroupsNew[e].modules[m].price,
                                        groupId: group._id,
                                        categoryId: GroupsNew[e].modules[m].categoryId[0]._id,
                                        moduleNew: false,
                                        internalHours: GroupsNew[e].modules[m].internalHours,
                                        externalHours: GroupsNew[e].modules[m].externalHours,
                                        pricePerHour: GroupsNew[e].modules[m].pricePerHour,
                                        signed: GroupsNew[e].modules[m].signed
                                    });
                                    module.save();
                                    res.modules.push(module);
                                }
                            }
                            res.save()
                        });
                        offer.groups.push(group);
                    }
                    else {
                        Group.findOneAndUpdate({_id: GroupsNew[e]._id},
                            {
                                $set: {
                                    name: GroupsNew[e].name,
                                    subTotal: GroupsNew[e].subTotal,
                                    total: GroupsNew[e].total,
                                    order: GroupsNew[e].order,
                                    deleted: GroupsNew[e].deleted,
                                    summary: GroupsNew[e].summary
                                }
                            }, {new: true}).then((res) => {
                            for (let m in GroupsNew[e].modules) {
                                if (GroupsNew[e].modules[m].moduleNew) {
                                    // create new modules form modules array
                                    let module = new Module({
                                        name: GroupsNew[e].modules[m].name,
                                        bodytext: GroupsNew[e].modules[m].bodytext,
                                        price: GroupsNew[e].modules[m].price,
                                        groupId: res._id,
                                        categoryId: GroupsNew[e].modules[m].categoryId[0]._id,
                                        moduleNew: false,
                                        internalHours: GroupsNew[e].modules[m].internalHours,
                                        externalHours: GroupsNew[e].modules[m].externalHours,
                                        pricePerHour: GroupsNew[e].modules[m].pricePerHour,
                                        signed: GroupsNew[e].modules[m].signed
                                    });
                                    module.save();
                                    res.modules.push(module);
                                }
                                else {
                                    Module.findOneAndUpdate({_id: GroupsNew[e].modules[m]._id},
                                        {
                                            $set: {
                                                name: GroupsNew[e].modules[m].name,
                                                bodytext: GroupsNew[e].modules[m].bodytext,
                                                price: GroupsNew[e].modules[m].price,
                                                groupId: res._id,
                                                categoryId: GroupsNew[e].modules[m].categoryId[0]._id,
                                                moduleNew: false,
                                                deleted: GroupsNew[e].modules[m].deleted,
                                                internalHours: GroupsNew[e].modules[m].internalHours,
                                                externalHours: GroupsNew[e].modules[m].externalHours,
                                                pricePerHour: GroupsNew[e].modules[m].pricePerHour,
                                                signed: GroupsNew[e].modules[m].signed
                                            }
                                        }, {new: true}).then((res) => res).catch(err => console.log(err));
                                }
                            }
                            res.save()
                        }).catch(err => console.log(err));
                    }

                }
                // create new page from pages array
                else if (GroupsNew[e].type === 2) {

                    if (GroupsNew[e].pageNew) {
                        let page = new Page({
                            type: GroupsNew[e].type,
                            title: GroupsNew[e].title,
                            subtitle: GroupsNew[e].subtitle,
                            bodytext: GroupsNew[e].bodytext,
                            defaultPage: false,
                            order: GroupsNew[e].order
                        });
                        page.save().then((res) => res);
                        offer.pages.push(page);
                    }
                    else {
                        Page.findOneAndUpdate({_id: GroupsNew[e]._id},
                            {
                                $set: {
                                    type: GroupsNew[e].type,
                                    title: GroupsNew[e].title,
                                    subtitle: GroupsNew[e].subtitle,
                                    bodytext: GroupsNew[e].bodytext,
                                    defaultPage: false,
                                    order: GroupsNew[e].order,
                                    deleted: GroupsNew[e].deleted
                                }
                            }, {new: true}).then((res) => res);
                    }
                }
            }
        }
        return Promise.all([offer.save()])
            .then(([offer]) => offer);
    });
};

OfferSchema.statics.copyOffer = function (args) {
    const Offer = mongoose.model('offer');
    const Group = mongoose.model('group');
    const Client = mongoose.model('client');
    const Module = mongoose.model('module');
    const Page = mongoose.model('page');

    return this.count().then((count) => {
        return this.findById(args.id).then(doc => {
            let version = doc.version + 1;
            let offerTitle = doc.offerTitle + ' (Copy ' + version + ')';
            let groups = doc.groups;
            let pages = doc.pages;

            return (new Offer(args)).save().then(offer => {
                Client.findOneAndUpdate({_id: args.client},
                            {
                                $push: {
                                    offers: offer._id,
                                }
                            }, {new: true}).then((res) => res);

                for (let g in groups){
                    Group.findById(groups[g]).then(data => {
                        let group = new Group({
                            name: groups[g].name,
                            subTotal: groups[g].subTotal,
                            total: groups[g].total,
                            order: groups[g].order,
                            summary: groups[g].summary
                        });
                        group.save().then((res) => {
                            for (let m in groups[g].modules) {
                                Module.findById(groups[g].modules[m]).then(item => {
                                    let module = new Module({
                                        name: groups[g].modules[m].name,
                                        bodytext: groups[g].modules[m].bodytext,
                                        price: groups[g].modules[m].price,
                                        groupId: group._id,
                                        categoryId: groups[g].modules[m].categoryId,
                                        moduleNew: false,
                                        internalHours: groups[g].modules[m].internalHours,
                                        externalHours: groups[g].modules[m].externalHours,
                                        pricePerHour: groups[g].modules[m].pricePerHour,
                                        signed: groups[g].modules[m].signed
                                    });
                                    module.save();
                                    res.modules.push(module);
                                });
                            }
                            res.save()
                        });
                        offer.groups.push(group);

                    })
                }

            });



            // doc.version = version;
            // doc.offerTitle = offerTitle;
            // doc.client = args.client;
            // doc.isNew = true;


            // return this.count().then((count) => {
            //     args.offerNumber = '00' + (parseInt(count) + 1) + '/' + new Date().getFullYear();
            //
            //     return (new Offer(args)).save().then(offer => {
            //         Client.findOneAndUpdate({_id: args.client},
            //             {
            //                 $push: {
            //                     offers: offer._id,
            //                 }
            //             }, {new: true}).then((res) => res);
            //
            //         for (let e in GroupsNew) {
            //             if (GroupsNew.length > 0) {
            //                 // create new group
            //                 if (GroupsNew[e].type === 1) {
            //                     let group = new Group({
            //                         name: GroupsNew[e].name,
            //                         subTotal: GroupsNew[e].subTotal,
            //                         total: GroupsNew[e].total,
            //                         order: GroupsNew[e].order,
            //                         summary: GroupsNew[e].summary
            //                     });
            //                     group.save().then((res) => {
            //                         for (let m in GroupsNew[e].modules) {
            //                             if (GroupsNew[e].modules[m].moduleNew) {
            //                                 // create new modules form modules array
            //                                 let module = new Module({
            //                                     name: GroupsNew[e].modules[m].name,
            //                                     bodytext: GroupsNew[e].modules[m].bodytext,
            //                                     price: GroupsNew[e].modules[m].price,
            //                                     groupId: group._id,
            //                                     categoryId: GroupsNew[e].modules[m].categoryId,
            //                                     moduleNew: false,
            //                                     internalHours: GroupsNew[e].modules[m].internalHours,
            //                                     externalHours: GroupsNew[e].modules[m].externalHours,
            //                                     pricePerHour: GroupsNew[e].modules[m].pricePerHour,
            //                                     signed: GroupsNew[e].modules[m].signed
            //                                 });
            //                                 module.save();
            //                                 res.modules.push(module);
            //                             }
            //                         }
            //                         res.save()
            //                     });
            //                     offer.groups.push(group);
            //                 }
            //                 // create new page from pages array
            //                 else if (GroupsNew[e].type === 2) {
            //                     let page = new Page({
            //                         type: GroupsNew[e].type,
            //                         title: GroupsNew[e].title,
            //                         subtitle: GroupsNew[e].subtitle,
            //                         bodytext: GroupsNew[e].bodytext,
            //                         defaultPage: false,
            //                         order: GroupsNew[e].order
            //                     });
            //                     page.save().then((res) => res);
            //                     offer.pages.push(page);
            //                 }
            //             }
            //         }
            //         return Promise.all([offer.save()])
            //             .then(([offer]) => offer);
            //     });
            // });









            // doc._id = mongoose.Types.ObjectId();
            // doc.offerNumber = '00' + (parseInt(count) + 1) + '/' + new Date().getFullYear();
            // doc.offerTitle = offerTitle;
            // doc.version = version;
            // doc.isNew = true; //<--------------------IMPORTANT
            // doc.save().then(offer => {
            //     Client.findOneAndUpdate({_id: args.client},
            //         {
            //             $push: {
            //                 offers: offer._id,
            //             }
            //         }, {new: true}).then((res) => res);
            // });

        });
    });
};

mongoose.model('offer', OfferSchema);