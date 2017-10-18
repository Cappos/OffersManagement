import {
    Component, ElementRef, OnDestroy, OnInit, Output, ViewContainerRef, ViewChildren, QueryList
} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {Location} from '@angular/common';
import {NgForm} from "@angular/forms";
import {MdDialog} from "@angular/material";
import 'rxjs/Observable';
import 'rxjs/operator/take';

import {Offer} from "../offers.model";
import {Group} from "../groups.model";
import {EditModuleDialogComponent} from "../../modules/edit-module-dialog/edit-module-dialog.component";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {ChapterDialogComponent} from "../../chapters/chapter-dialog/chapter-dialog.component";
import {ModuleListDialogComponent} from "../../modules/module-list-dialog/module-list-dialog.component";
import {ChapterListDialogComponent} from "../../chapters/chapter-list-dialog/chapter-list-dialog.component";
import {DragulaService} from "ng2-dragula";

@Component({
    selector: 'app-offer',
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit, OnDestroy {
    pageTitle = 'Offers';
    id: number;
    item;
    offerState: Observable<any>;
    @Output() editMode = false;
    selectedSaler;
    offersModules: Group[];
    editModuleGroup: number;
    dragContainer = 'draggable-bag';
    totalPrice;
    @ViewChildren('accordionModule', {read: ElementRef}) accordionModule: QueryList<ElementRef>;
    chaptersOrder: any[] = [];

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private httpClient: HttpClient, private dialog: MdDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, private router: Router, private loadingService: TdLoadingService, private location: Location, private dragulaService: DragulaService) {

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
        this.route.params.subscribe(
            (params: Params) => {
                this.id = +params['id'];
                this.editMode = !!params['edit'];
                this.offerState = this.httpClient.get<Offer>('http://wrenchweb.com/http/offerData', {
                    observe: 'body',
                    responseType: 'json'
                });
                this.offerState.take(1).subscribe((res) => {
                    this.item = res; // Get data form server
                    this.selectedSaler = this.item.offerDescription.saler[1].value; // Set client data
                    this.offersModules = this.item.groups; // Set offer chapters
                    this.item.files = []; // Set related files
                    let modulesPrices: any[] = []; // Initial price array

                    // calculate offer total price
                    for (let g in this.offersModules) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                    this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));

                    // Enable drag and drop
                    this.dragulaService.setOptions(this.dragContainer, {
                        moves: function (el, container, handle) {
                            return handle.className === 'handle mat-icon material-icons';
                        }
                    });

                    // Enable ordering chapters
                    this.dragulaService.drop.subscribe((value) => {
                        this.accordionModule.changes.take(1).subscribe(children => {
                            this.chaptersOrder = [];
                            children.forEach(child => {
                                let index = +child.nativeElement.getAttribute('index') + 1;
                                let element = {uid: child.nativeElement.getAttribute('uid'), order: index};
                                this.chaptersOrder.push(element);
                            });
                            console.log(this.chaptersOrder, 'new order');
                        });
                    });
                    this.loadingService.resolveAll('modulesLoader');
                })
            }
        );
    }

    onSave(form: NgForm) {
        const value = form.value;
        this.editMode = false;
        this.sharedService.sneckBarNotifications('Offer saved!!!');
    }

    onEdit() {
        console.log('edit');
        this.editMode = true
    }

    onModuleEdit(moduleUid: number, groupUid: number) {
        console.log('edit');
        this.editModuleGroup = groupUid;
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                moduleUid: moduleUid,
                groupUid: groupUid,
                edit: true
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let group = this.offersModules.filter(group => group.uid === result.groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);
                let module = this.offersModules[groupIndex].modules.filter(module => module.name === result.name)[0];
                let moduleIndex = this.offersModules[groupIndex].modules.indexOf(module);
                let modulePrices: any[] = [];
                let sum: number = 0;

                // update module after edit if parent group not change
                if (result.groupUid === this.editModuleGroup) {
                    this.offersModules[groupIndex].modules[moduleIndex] = result;
                }
                // update module after edit if parent group change
                else {
                    let groupOld = this.offersModules.filter(group => group.uid === this.editModuleGroup)[0];
                    let groupOldIndex = this.offersModules.indexOf(groupOld);
                    let moduleOld = this.offersModules[groupOldIndex].modules.filter(module => module.name === result.name)[0];
                    let moduleOldIndex = this.offersModules[groupOldIndex].modules.indexOf(moduleOld);

                    this.offersModules[groupOldIndex].modules.splice(moduleOldIndex, 1);
                    this.offersModules[groupIndex].modules.push(result);
                }
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
                let group = this.offersModules.filter(group => group.uid === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);
                let module = this.offersModules[groupIndex].modules.filter(module => module.uid === moduleUid)[0];
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
                this.sharedService.sneckBarNotifications('Module removed!!!');
            }
        });
    }

    addModule(groupUid: number) {
        console.log(groupUid, 'module add');
        this.editModuleGroup = groupUid;
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                groupUid: groupUid,
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result, 'chapter moduel');
                let group = this.offersModules.filter(group => group.uid === result.groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);
                let modulePrices: any[] = [];
                let sum: number = 0;

                console.log(group, 'grupa');
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
                this.sharedService.sneckBarNotifications('Module added!!!');
            }
        });
    }

    addChapter(offerUid: number) {
        console.log(offerUid, 'Chapter add');
        let dialogRef = this.dialog.open(ChapterDialogComponent, {
            data: {
                offerUid: offerUid,
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
                this.sharedService.sneckBarNotifications('Chapter added!!!');
            }
        });
    }

    addFromChapterList(offerUid: number) {
        console.log(offerUid);
        let dialogRef = this.dialog.open(ChapterListDialogComponent, {
            data: {
                offerUid: offerUid,
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                for (let c in result) {
                    let group = this.offersModules.filter(group => group.uid === result[c].uid)[0];
                    let groupIndex = this.offersModules.indexOf(group);

                    if (groupIndex > -1) {
                        this.sharedService.sneckBarNotifications('Chapter is already part of this offer!!!');
                    }
                    else {
                        this.offersModules.push(result[c]);
                        this.sharedService.sneckBarNotifications('Chapters added!!!');
                    }

                    // update total price
                    let modulesPrices: any[] = [];
                    for (let g in this.offersModules) {
                        modulesPrices.push(this.offersModules[g].subTotal);
                    }
                    this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                }
            }
        });
    }

    onChapterEdit(groupUid: number) {
        console.log('Edit Chapter');
        let dialogRef = this.dialog.open(ChapterDialogComponent, {
            data: {
                groupUid: groupUid,
                edit: true
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let group = this.offersModules.filter(group => group.uid === result.groupUid)[0];
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
                let group = this.offersModules.filter(group => group.uid === groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);

                // remove chapter after delete
                this.offersModules.splice(groupIndex, 1);

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    modulesPrices.push(this.offersModules[g].subTotal);
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.sharedService.sneckBarNotifications('Chapter removed!!!');
            }
        });
    }

    addFromModuleList(groupUid: number) {
        console.log(groupUid);
        let dialogRef = this.dialog.open(ModuleListDialogComponent, {
            data: {
                groupUid: groupUid
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                for (let e in result) {
                    let group = this.offersModules.filter(group => group.uid === result[e].groupUid)[0];
                    let groupIndex;
                    if (group) {
                        groupIndex = this.offersModules.indexOf(group);
                    }
                    else {
                        let group = this.offersModules.filter(group => group.uid === groupUid)[0];
                        groupIndex = this.offersModules.indexOf(group);
                    }

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
                this.sharedService.sneckBarNotifications('Modules added!!!');
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

    onPrint() {
        console.log('print');
    }

    ngOnDestroy() {
        this.dragulaService.destroy(this.dragContainer);
    }


}
