import {Component, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {MdDialog} from "@angular/material";
import 'rxjs/Observable';

import {Offer} from "../offers.model";
import {Group} from "../groups.model";
import {EditModuleDialogComponent} from "../../modules/edit-module-dialog/edit-module-dialog.component";
import {TdDialogService} from "@covalent/core";
import {ChapterDialogComponent} from "../../chapters/chapter-dialog/chapter-dialog.component";

@Component({
    selector: 'app-offer',
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {
    pageTitle = 'Offers';
    id: number;
    item;
    offerState: Observable<any>;
    @Output() editMode = false;
    selectedSaler;
    offersModules: Group[];
    editModuleGroup: number;
    totalPrice;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private httpClient: HttpClient, private dialog: MdDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, private router: Router) {
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
                    this.item = res;
                    this.selectedSaler = this.item.offerDescription.saler[1].value;
                    this.offersModules = this.item.groups;
                    let modulesPrices: any[] = [];

                    // calculate offer total price
                    for (let g in this.offersModules) {
                        for (let m in this.offersModules) {
                            modulesPrices.push(this.offersModules[g].modules[m].price);
                        }
                    }
                    this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
                })
            }
        );
    }

    onSave(form: NgForm) {
        const value = form.value;
        this.editMode = false;
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
                    for (let m in this.offersModules) {
                        modulesPrices.push(this.offersModules[g].modules[m].price);
                    }
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
                    for (let m in this.offersModules) {
                        modulesPrices.push(this.offersModules[g].modules[m].price);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
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
                let group = this.offersModules.filter(group => group.uid === result.groupUid)[0];
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
                    for (let m in this.offersModules) {
                        modulesPrices.push(this.offersModules[g].modules[m].price);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
        });
    }

    addChapter(offerUid: number) {
        console.log(offerUid, 'module add');
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
                    for (let m in this.offersModules) {
                        modulesPrices.push(this.offersModules[g].modules[m].price);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
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
            console.log(result, 'edit chapter');
            if (result) {
                let group = this.offersModules.filter(group => group.uid === result.groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);

                // update chapter after edit
                this.offersModules[groupIndex] = result;

                // update total price
                let modulesPrices: any[] = [];
                for (let g in this.offersModules) {
                    for (let m in this.offersModules) {
                        modulesPrices.push(this.offersModules[g].modules[m].price);
                    }
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
                    for (let m in this.offersModules) {
                        modulesPrices.push(this.offersModules[g].modules[m].price);
                    }
                }
                this.totalPrice = modulesPrices.reduce((a, b) => parseInt(a) + parseInt(b));
            }
        });
    }

}
