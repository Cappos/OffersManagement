import {
    Component, ElementRef, OnDestroy, OnInit, Output, ViewContainerRef, ViewChildren, QueryList, ViewChild
} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {Location} from '@angular/common';
import {NgForm} from "@angular/forms";
import {MatDialog, DateAdapter} from "@angular/material";
import 'rxjs/Observable';
import 'rxjs/operator/take';

import {EditModuleDialogComponent} from "../../modules/edit-module-dialog/edit-module-dialog.component";
import {
    IUploadOptions, LoadingMode, LoadingType, TdDialogService, TdFileService,
    TdLoadingService
} from "@covalent/core";
import {ChapterDialogComponent} from "../../chapters/chapter-dialog/chapter-dialog.component";
import {ModuleListDialogComponent} from "../../modules/module-list-dialog/module-list-dialog.component";
import {ChapterListDialogComponent} from "../../chapters/chapter-list-dialog/chapter-list-dialog.component";
import {DragulaService} from "ng2-dragula";
import {DataService} from "../../shared/data.service";
import {PageListDialogComponent} from "../../additional-data/page-list-dialog/page-list-dialog.component";
import {PageEditDialogComponent} from "../../additional-data/page-edit-dialog/page-edit-dialog.component";
import {Apollo} from 'apollo-angular';
import getOffer from '../../queries/fetchOffer';
import * as _ from "lodash";
import updateOffer from "../../queries/updateOffer";
import getOffers from "../../queries/fetchOffers";

@Component({
    selector: 'app-offer',
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit, OnDestroy {
    pageTitle = 'Offers';
    id: number;
    item;
    @Output() editMode = false;
    selectedSeller;
    selectedClient;
    offersModules = [];
    offersUpdate = [];
    files: any[] = [];
    file: File;
    editModuleGroup: number;
    dragContainer = 'draggable-bag';
    totalPrice;
    @ViewChildren('accordionModule', {read: ElementRef}) accordionModule: QueryList<ElementRef>;
    @ViewChild("fileUpload", {read: ElementRef}) fileUpload: ElementRef;
    chaptersOrder: any[] = [];
    dropSubscription;
    newDate;
    expDate;
    clients;
    sellers;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private dialog: MatDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, private loadingService: TdLoadingService, private location: Location, private dragulaService: DragulaService, private dataService: DataService, private dateAdapter: DateAdapter<Date>, private apollo: Apollo, private fileUploadService: TdFileService) {

        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');
        this.sharedService.changeTitle(this.pageTitle);
        this.dateAdapter.setLocale('de');
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params: Params) => {
                this.id = params['id'];
                this.editMode = !!params['edit'];

                // Get data form server
                this.apollo.watchQuery<any>({
                    query: getOffer,
                    variables: {
                        id: this.id
                    },
                    fetchPolicy: 'network-only'
                }).valueChanges.subscribe(({data}) => {
                    this.item = _.cloneDeep(data.offer);
                    this.sellers = data.sealers; // Set seller data
                    this.selectedSeller = this.item.sealer[0].value;
                    this.selectedClient = this.item.client[0]._id;
                    this.clients = data.clients; // Set client data
                    // Set offer chapters and pages
                    for (let g of this.item.groups) {
                        this.offersModules.push(g)
                    }
                    for (let p of this.item.pages) {
                        this.offersModules.push(p)
                    }
                    this.offersModules.sort(function (a, b) {
                        return a.order - b.order;
                    });

                    this.offersUpdate = _.cloneDeep(this.offersModules);


                    console.log(this.offersUpdate);
                    // format date for datePicker
                    this.totalPrice = this.item.totalPrice;
                    this.newDate = this.item.tstamp;
                    this.expDate = this.item.expDate;

                    // Enable drag and drop
                    this.dragulaService.setOptions(this.dragContainer, {
                        moves: function (el, container, handle) {
                            return handle.className === 'handle mat-icon material-icons';
                        }
                    });

                    // Enable ordering chapters
                    this.dropSubscription = this.dragulaService.drop.subscribe((value) => {
                        this.accordionModule.changes.subscribe(children => {
                            this.chaptersOrder = [];
                            children.forEach(child => {
                                let index = +child.nativeElement.getAttribute('index') + 1;
                                let id = child.nativeElement.getAttribute('id');
                                let element = {id: id, order: index};
                                let offerData = this.offersUpdate.filter(offerData => offerData._id === id)[0];
                                let group = this.offersModules.filter(group => group._id === id)[0];
                                offerData.order = index;
                                group.order = index;
                                this.chaptersOrder.push(element);
                            });
                        });
                    });
                    this.loadingService.resolveAll('modulesLoader');
                });
            }
        );
    }

    onSave(form: NgForm) {
        const value = form.value;
        this.editMode = false;
        const client = this.clients.find(client => client._id == value.client);
        const seller = this.sellers.find(seller => seller.value == value.seller);
        let totalPrice = null;

        if (value.totalPrice) {
            totalPrice = value.totalPrice.replace(',', '');
        }

        this.apollo.mutate({
            mutation: updateOffer,
            variables: {
                id: this.id,
                offerNumber: value.offerNumber,
                offerTitle: value.offerTitle,
                totalPrice: totalPrice,
                bodytext: value.bodytext,
                client: client._id,
                seller: seller._id,
                groupsNew: !this.offersUpdate.length ? [] : this.offersUpdate,
                files: this.files,
                expDate: value.expDate
            }
        }).subscribe(() => {
            this.editMode = false;
            console.log(this.offersUpdate, 'saved data');
            this.sharedService.sneckBarNotifications('Offer saved!!!');
            // this.router.navigate(['/offers']);
        });
    }

    onEdit() {
        console.log('edit');
        this.editMode = true
    }

    onModuleEdit(moduleUid, groupUid, module) {
        this.editModuleGroup = groupUid;
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                moduleUid: moduleUid,
                groupUid: groupUid,
                moduleNew: module,
                edit: true
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                // Data update
                let offerData = this.offersUpdate.filter(offerData => offerData._id === groupUid)[0];
                let offerIndex = this.offersUpdate.indexOf(offerData);
                let moduleData = this.offersUpdate[offerIndex].modules.filter(moduleData => moduleData._id === result._id)[0];
                let moduleDataIndex = this.offersUpdate[offerIndex].modules.indexOf(moduleData);

                this.offersUpdate[offerIndex].modules[moduleDataIndex] = result;

                // View data update
                let group = this.offersModules.filter(group => group._id === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);
                let module = this.offersModules[groupIndex].modules.filter(module => module._id === result._id)[0];
                let moduleIndex = this.offersModules[groupIndex].modules.indexOf(module);

                this.offersModules[groupIndex].modules[moduleIndex] = result;

                let modulePrices: any[] = [];
                let sum: number = 0;

                // update chapter price
                for (let m in this.offersModules[groupIndex].modules) {
                    modulePrices.push(this.offersModules[groupIndex].modules[m].price);
                }
                sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.offersUpdate[offerIndex].subTotal = sum;
                this.offersModules[groupIndex].subTotal = sum;

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    if (this.offersModules[g].subTotal) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.editMode = true
            }
        });

    }

    onModuleRemove(moduleUid, groupUid) {
        this._dialogService.openConfirm({
            message: 'Are you sure you want to remove this module?',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {

                // Data update
                let offerData = this.offersUpdate.filter(offerData => offerData._id === groupUid)[0];
                let offerIndex = this.offersUpdate.indexOf(offerData);
                let moduleData = this.offersUpdate[offerIndex].modules.filter(moduleData => moduleData._id === moduleUid)[0];
                let moduleDataIndex = this.offersUpdate[offerIndex].modules.indexOf(moduleData);

                if (moduleData.moduleNew) {
                    console.log('if');
                    this.offersUpdate[offerIndex].modules.splice(moduleDataIndex, 1);
                }
                else {

                    console.log('else');
                    moduleData.deleted = true;
                    console.log(moduleData);
                    this.offersUpdate[offerIndex].modules[moduleDataIndex] = moduleData;
                    console.log(this.offersUpdate);
                }

                // View data update
                let group = this.offersModules.filter(group => group._id === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);
                let module = this.offersModules[groupIndex].modules.filter(module => module._id === moduleUid)[0];
                let moduleIndex = this.offersModules[groupIndex].modules.indexOf(module);
                let modulePrices: any[] = [];
                let sum: number = 0;

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
                this.offersUpdate[offerIndex].subTotal = sum;
                this.offersModules[groupIndex].subTotal = sum;

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    if (this.offersModules[g].subTotal) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.editMode = true
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

                // Data update
                let offerData = this.offersUpdate.filter(offerData => offerData._id === groupUid)[0];
                let offerIndex = this.offersUpdate.indexOf(offerData);

                this.offersUpdate[offerIndex].modules.push(result);

                // View data update
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
                this.offersUpdate[offerIndex].subTotal = sum;
                this.offersModules[groupIndex].subTotal = sum;

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    if (this.offersModules[g].subTotal) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
            this.editMode = true;
        });
    }

    addChapter() {
        let dialogRef = this.dialog.open(ChapterDialogComponent, {
            data: {
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // update chapters after adding new
                let orderNo = this.offersModules.length + 1;
                result.order = orderNo;
                result.type = 1;
                result.groupNew = true;

                // Update data
                this.offersUpdate.push(result);

                // View data update
                this.offersModules.push(result);

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    if (this.offersModules[g].subTotal) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
        });
        this.editMode = true;
    }

    addFromChapterList(offerUid) {
        let dialogRef = this.dialog.open(ChapterListDialogComponent, {
            data: {
                offerId: offerUid,
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                for (let c in result) {

                    // Data update
                    let offerData = this.offersUpdate.filter(offerData => offerData._id === result[c].offerUid)[0];

                    // View data update
                    let group = this.offersModules.filter(group => group._id === result[c].offerUid)[0];
                    let groupIndex = this.offersModules.indexOf(group);

                    if (groupIndex > -1) {
                        this.sharedService.sneckBarNotifications('This chapter is already part of this offer!!!');
                    }
                    else {
                        let orderNo = this.offersModules.length + 1;
                        result[c].order = orderNo;
                        result[c].type = 1;
                        result[c].groupNew = true;

                        // Data update
                        this.offersUpdate.push(result[c]);

                        // View data update
                        this.offersModules.push(result[c]);
                    }

                    // update total price
                    let modulesPrices: any[] = [];
                    for (let g in this.offersModules) {
                        if (this.offersModules[g].subTotal) {
                            modulesPrices.push(this.offersModules[g].subTotal);
                        }
                    }
                    this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                }
            }
            this.editMode = true;
        });
    }

    onChapterEdit(groupUid, chapter) {
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
                // Data update
                let offerData = this.offersUpdate.filter(offerData => offerData._id === groupUid)[0];
                let offerIndex = this.offersUpdate.indexOf(offerData);

                this.offersUpdate[offerIndex] = result;

                // View data update
                let group = this.offersModules.filter(group => group._id === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);

                // update chapter after edit
                this.offersModules[groupIndex] = result;

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    if (this.offersModules[g].subTotal) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
            this.editMode = true;
        });
    }

    onChapterRemove(groupUid) {
        this._dialogService.openConfirm({
            message: 'Are you sure you want to remove this Chapter? If you continue all modules in this chapter will be removed too!!!',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                // Data update
                let offerData = this.offersUpdate.filter(offerData => offerData._id === groupUid)[0];
                let offerIndex = this.offersUpdate.indexOf(offerData);

                if (offerData.groupeNew) {
                    this.offersUpdate.splice(offerIndex, 1);
                }
                else {
                    offerData.deleted = true;
                    this.offersUpdate[offerIndex] = offerData;
                }

                // View data update
                let group = this.offersModules.filter(group => group._id === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);

                // remove chapter after delete
                this.offersModules.splice(groupIndex, 1);

                // update total price
                let modulesPrices: any[] = [];

                // check if offers chapters is empty before update count
                if (this.offersModules.length > 0) {
                    // update total price
                    let modulesPrices: any[] = [];
                    for (let g in this.offersModules) {
                        if (this.offersModules[g].subTotal) {
                            modulesPrices.push(this.offersModules[g].subTotal);
                        }
                    }
                    this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                }
            }
            this.editMode = true;
        });
    }

    addFromModuleList(groupUid)     {
        let dialogRef = this.dialog.open(ModuleListDialogComponent, {
            data: {
                groupUid: groupUid
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                for (let e in result) {

                    // Data update
                    let offerData = this.offersUpdate.filter(offerData => offerData._id === groupUid)[0];
                    let offerIndex = this.offersUpdate.indexOf(offerData);

                    this.offersUpdate[offerIndex].modules.push(result[e]);

                    // View data update
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

                    this.offersUpdate[offerIndex].subTotal = sum;
                    this.offersModules[groupIndex].subTotal = sum;
                }

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    if (this.offersModules[g].subTotal) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
            this.editMode = true;
        });
    }

    addFromPagesList(offerUid) {
        console.log('addPage from list');
        let dialogRef = this.dialog.open(PageListDialogComponent, {
            data: {
                offerUid: offerUid,
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                for (let c in result) {

                    let orderNo = this.offersModules.length + 1;
                    result[c].order = orderNo;
                    result[c].pageNew = true;
                    result[c].type = 2;
                    // Data update
                    this.offersUpdate.push(result[c]);
                    // View data update
                    this.offersModules.push(result[c]);
                    this.sharedService.sneckBarNotifications('Pages added!!!');

                    // update total price
                    let modulesPrices: any[] = [];
                    for (let g in this.offersModules) {
                        if (this.offersModules[g].subTotal) {
                            modulesPrices.push(this.offersModules[g].subTotal);
                        }
                    }
                    if (modulesPrices.length > 0) {
                        this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                    }

                }
            }
            this.editMode = true;
        });
    }

    addPage(offerUid) {
        console.log('addPage');
        let dialogRef = this.dialog.open(PageEditDialogComponent, {
            data: {
                offerUid: offerUid
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // update chapters after adding new
                let orderNo = this.offersModules.length + 1;
                result.order = orderNo;
                result.type = 2;

                // Data update
                this.offersUpdate.push(result);

                // View data update
                this.offersModules.push(result);

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    if (this.offersModules[g].subTotal) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.sharedService.sneckBarNotifications('Chapter added!!!');
                this.editMode = true;
            }

        });
    }

    onPageEdit(pageUid, page) {
        let dialogRef = this.dialog.open(PageEditDialogComponent, {
            data: {
                pageNew: page,
                pageUid: pageUid,
                edit: true
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
                // Data update
                let offerData = this.offersUpdate.filter(offerData => offerData._id === pageUid)[0];
                let offerIndex = this.offersUpdate.indexOf(offerData);

                this.offersUpdate[offerIndex] = result;

                let group = this.offersModules.filter(group => group._id === pageUid)[0];
                let groupIndex = this.offersModules.indexOf(group);

                // update chapter after edit
                this.offersModules[groupIndex] = result;

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    if (this.offersModules[g].subTotal) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.editMode = true;
            }
        });
    }

    onPageRemove(pageUid) {
        this._dialogService.openConfirm({
            message: 'Are you sure you want to remove this Page?',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                // Data update
                let offerData = this.offersUpdate.filter(offerData => offerData._id === pageUid)[0];
                let offerIndex = this.offersUpdate.indexOf(offerData);

                if (offerData.groupeNew) {
                    this.offersUpdate.splice(offerIndex, 1);
                }
                else {
                    offerData.deleted = true;
                    this.offersUpdate[offerIndex] = offerData;
                }

                // View data update
                let group = this.offersModules.filter(group => group._id === pageUid)[0];
                let groupIndex = this.offersModules.indexOf(group);

                // remove chapter after delete
                this.offersModules.splice(groupIndex, 1);

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    if (this.offersModules[g].subTotal) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.sharedService.sneckBarNotifications('Page removed!!!');
                this.editMode = true;
            }
        });
    }

    uploadEvent(files: FileList | File): void {
        if (files instanceof FileList) {
            console.log(files);
        } else {
            let options: IUploadOptions = {
                url: 'http://localhost:3000/upload',
                method: 'post',
                file: files
            };
            this.fileUploadService.upload(options).subscribe((data) => {
                let file = JSON.parse(data);
                file.tstamp = new Date();
                this.files.push(file);
                let event = new MouseEvent('click', {bubbles: true});
                this.fileUpload.nativeElement.children[0].children[1].dispatchEvent(event);
            });
            this.editMode = true;
        }
    }

    cancelEvent(): void {
        console.log('cancel');
    }

    goBack() {
        this.location.back();
    }

    onPrint() {
        console.log('print');
    }

    ngOnDestroy() {
        this.dragulaService.destroy(this.dragContainer);
        this.dropSubscription.unsubscribe();
    }
}
