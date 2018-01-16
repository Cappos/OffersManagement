import {Component, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {NgForm} from "@angular/forms";
import {MatDialog} from "@angular/material";
import 'rxjs/Observable';
import {Location} from '@angular/common';
import {Offer} from "../offers.model";
import {EditModuleDialogComponent} from "../../modules/edit-module-dialog/edit-module-dialog.component";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {ChapterDialogComponent} from "../../chapters/chapter-dialog/chapter-dialog.component";
import {ModuleListDialogComponent} from "../../modules/module-list-dialog/module-list-dialog.component";
import {ChapterListDialogComponent} from "../../chapters/chapter-list-dialog/chapter-list-dialog.component";
import {Apollo} from 'apollo-angular';
import createOffer from '../../queries/createOffer';
import getOffers from '../../queries/fetchOffers';
import getSealersClients from '../../queries/getSealersClients';



@Component({
    selector: 'app-new-offer',
    templateUrl: './new-offer.component.html',
    styleUrls: ['./new-offer.component.css']
})

export class NewOfferComponent implements OnInit {
    pageTitle = 'Offers';
    title = 'New offer';
    id: number;
    item: Offer;
    files: any[] = [];
    @Output() editMode = true;
    selectedSeller;
    selectedClient;
    sellers;
    clients;
    offersModules = [];
    offerPages = [];
    editModuleGroup: number;
    totalPrice;

    constructor(private sharedService: SharedService, private dialog: MatDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, private router: Router, private loadingService: TdLoadingService, private location: Location, private apollo: Apollo) {
        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');
        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.apollo.watchQuery<any>({
            query: getSealersClients
        }).valueChanges.subscribe(({data}) => {
            this.clients = data.clients;
            this.sellers = data.sealers;
            this.totalPrice = 0;
            this.loadingService.resolveAll('modulesLoader');
        });
    }

    onSave(form: NgForm) {
        const value = form.value;
        const client = this.clients.find(client => client._id == value.client);
        const seller = this.sellers.find(seller => seller.value == value.seller);
        let totalPrice = null;

        if (value.totalPrice) {
            totalPrice = value.totalPrice.replace(',', '');
        }

        if (!this.offersModules.length) {
            console.log('empty');
            this.apollo.mutate({
                mutation: createOffer,
                variables: {
                    offerNumber: value.offerNumber,
                    offerTitle: value.offerTitle,
                    totalPrice: totalPrice,
                    bodytext: value.bodytext,
                    client: client._id,
                    seller: seller._id,
                    groups: []
                },
                refetchQueries: [{
                    query: getOffers
                }],
            }).subscribe(() => {
                this.editMode = false;
                this.sharedService.sneckBarNotifications(`offer created.`);
                this.router.navigate(['/offers']);
            });
        }
        else {
            console.log('not null');
            this.apollo.mutate({
                mutation: createOffer,
                variables: {
                    offerNumber: value.offerNumber,
                    offerTitle: value.offerTitle,
                    totalPrice: totalPrice,
                    bodytext: value.bodytext,
                    client: client._id,
                    seller: seller._id,
                    groupsNew: this.offersModules,
                    offerPages: this.offerPages
                },
                refetchQueries: [{
                    query: getOffers
                }]
            }).subscribe(() => {
                this.editMode = false;
                this.sharedService.sneckBarNotifications(`offer created.`);
                // this.router.navigate(['/offers']);
            });
        }
    }

    onEdit() {
        console.log('edit');
        this.editMode = true
    }

    onModuleEdit(moduleUid: number, groupUid: number, module) {
        console.log(moduleUid, groupUid, 'edit');
        this.editModuleGroup = groupUid;
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                moduleUid: moduleUid,
                groupUid: groupUid,
                newOffer: true,
                moduleNew: module,
                edit: true
            } 
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let group = this.offersModules.filter(group => group._id === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);
                let module = this.offersModules[groupIndex].modules.filter(module => module._id === result._id)[0];
                let moduleIndex = this.offersModules[groupIndex].modules.indexOf(module);
                this.offersModules[groupIndex].modules[moduleIndex] = result;

                let modulePrices: any[] = [];
                let sum: number = 0;

                console.log(this.offersModules);

                // update chapter price
                for (let m in this.offersModules[groupIndex].modules) {
                    modulePrices.push(this.offersModules[groupIndex].modules[m].price);
                }
                sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.offersModules[groupIndex].subTotal = sum;



                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    modulesPrices.push(this.offersModules[g].subTotal);
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
        });
    }

    onModuleRemove(moduleUid: number, groupUid: number) {
        this._dialogService.openConfirm({
            message: 'Are you sure you want to remove this module?',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                let group = this.offersModules.filter(group => group._id === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);
                let module = this.offersModules[groupIndex].modules.filter(module => module._id === moduleUid)[0];
                let moduleIndex = this.offersModules[groupIndex].modules.indexOf(module);
                let modulePrices: any[] = [];
                let sum: number = 0;

                // remove module after delete
                this.offersModules[groupIndex].modules.splice(moduleIndex, 1);

                // update chapter price
                for (let m in this.offersModules[groupIndex].modules) {
                    modulePrices.push(this.offersModules[groupIndex].modules[m].price);
                }
                if (modulePrices.length) {
                    sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                }
                else {
                    sum = 0;
                }
                this.offersModules[groupIndex].subTotal = sum;

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    modulesPrices.push(this.offersModules[g].subTotal);
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
        });
    }

    addModule(groupUid) {
        this.editModuleGroup = groupUid;
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                groupUid: groupUid,
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let group = this.offersModules.filter(group => group._id === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);
                let modulePrices: any[] = [];
                let sum: number = 0;

                // update modules list after adding new
                this.offersModules[groupIndex].modules.push(result);

                // update chapter price
                for (let m in this.offersModules[groupIndex].modules) {
                    modulePrices.push(this.offersModules[groupIndex].modules[m].price);
                }
                sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.offersModules[groupIndex].subTotal = sum;

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    modulesPrices.push(this.offersModules[g].subTotal);
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
            this.editMode = true;
        });
    }

    addChapter() {
        console.log('Chapter add');
        let dialogRef = this.dialog.open(ChapterDialogComponent, {
            data: {
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // update chapters after adding new
                this.offersModules.push(result);

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    modulesPrices.push(this.offersModules[g].subTotal);
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
        });
        this.editMode = true;
    }

    addFromChapterList(offerUid) {
        console.log(offerUid);
        let dialogRef = this.dialog.open(ChapterListDialogComponent, {
            data: {
                offerId: offerUid,
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
                for (let c in result) {
                    let group = this.offersModules.filter(group => group._id === result[c].offerId)[0];
                    let groupIndex = this.offersModules.indexOf(group);

                    if (groupIndex > -1) {
                        this.sharedService.sneckBarNotifications('This chapter is already part of this offer!!!');
                    }
                    else {
                        this.offersModules.push(result[c]);
                    }

                    // update total price
                    let modulesPrices: any[] = [];
                    for (let g in this.offersModules) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                    this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                }
            }
            this.editMode = true;
        });
    }

    onChapterEdit(groupUid: number, chapter) {
        console.log('Edit Chapter');
        let dialogRef = this.dialog.open(ChapterDialogComponent, {
            data: {
                groupUid: groupUid,
                newOffer: true,
                chapterNew: chapter,
                edit: true
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let group = this.offersModules.filter(group => group._id === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);

                // update chapter after edit
                this.offersModules[groupIndex] = result;

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    modulesPrices.push(this.offersModules[g].subTotal);
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
        });
    }

    onChapterRemove(groupUid: number) {
        this._dialogService.openConfirm({
            message: 'Are you sure you want to remove this Chapter? If you continue all modules in this chapter will be removed too!!!',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                let group = this.offersModules.filter(group => group._id === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);

                // remove chapter after delete
                this.offersModules.splice(groupIndex, 1);

                // update total price
                let modulesPrices: any[] = [];

                // check if offers chapters is empty before update count
                if(this.offersModules.length > 0){
                    for (let g in this.offersModules) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                    this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                }
            }
        });
    }

    addFromModuleList(groupUid) {
        console.log(groupUid);
        let dialogRef = this.dialog.open(ModuleListDialogComponent, {
            data: {
                groupUid: groupUid
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                for (let e in result) {
                    let group = this.offersModules.filter(group => group._id === groupUid)[0];
                    let groupIndex = this.offersModules.indexOf(group);

                    // update modules list after adding new
                    this.offersModules[groupIndex].modules.push(result[e]);
                    let modulePrices: any[] = [];
                    let sum: number = 0;

                    // update chapter price
                    for (let m in this.offersModules[groupIndex].modules) {
                        modulePrices.push(this.offersModules[groupIndex].modules[m].price);
                    }
                    sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                    this.offersModules[groupIndex].subTotal = sum;
                }

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    modulesPrices.push(this.offersModules[g].subTotal);
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
        });
    }

    selectEvent(files: FileList | File): void {
        if (files instanceof FileList) {
            console.log(files);
        } else {
            console.log('else');
        }
    }

    uploadEvent(files: FileList | File): void {
        if (files instanceof FileList) {
            console.log(files);
        } else {
            console.log('else');
        }
    }

    cancelEvent(): void {
        console.log('cancel');
    }

    goBack() {
        this.location.back();
    }

}

