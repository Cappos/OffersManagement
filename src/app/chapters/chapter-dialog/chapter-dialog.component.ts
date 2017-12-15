import {Component, Inject, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material";
import 'rxjs/Observable';
import 'rxjs/operators';

import {EditModuleDialogComponent} from "../../modules/edit-module-dialog/edit-module-dialog.component";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {Group} from "../../offers/groups.model";
import {Module} from "../../modules/modules.model";
import {ModuleListDialogComponent} from "../../modules/module-list-dialog/module-list-dialog.component";

@Component({
    selector: 'app-chapter-dialog',
    templateUrl: './chapter-dialog.component.html',
    styleUrls: ['./chapter-dialog.component.css']
})

export class ChapterDialogComponent implements OnInit {
    pageTitle = 'Offers';
    id: number;
    item: Group;
    chapterState: Observable<any>;
    @Output() editMode = false;
    chaptersModules: Module[];
    editModuleGroup: number;
    chapterPrice: number = 0;
    savedChapterData;
    itemSaved = false;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private httpClient: HttpClient, private dialog: MatDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, @Inject(MAT_DIALOG_DATA) private data: any, private loadingService: TdLoadingService, ) {
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
        if (this.data.edit) {
            this.id = this.data.groupUid;
            this.chapterState = this.httpClient.get<Group>('http://wrenchweb.com/http/chapterData', {
                observe: 'body',
                responseType: 'json'
            });
            this.chapterState.take(1).subscribe((res) => {
                this.item = res;
                this.chaptersModules = this.item.modules;
                this.chapterPrice = this.item.subTotal;
            })
        }
        else {
            this.chaptersModules = [];
        }
        this.loadingService.resolveAll('modulesLoader');
    }

    onSave(form: NgForm) {
        const value = form.value;
        this.savedChapterData = form.value;
        this.savedChapterData.modules = this.chaptersModules;
        this.savedChapterData.subTotal = 0;
        this.savedChapterData.uid = this.id || 100;
        this.savedChapterData.type = 1;
        this.itemSaved = true;
    }

    onModuleEdit(moduleUid: number, groupUid: number) {
        console.log(moduleUid, groupUid);
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
                let module = this.chaptersModules.filter(module => module.name === result.name)[0];
                let moduleIndex = this.chaptersModules.indexOf(module);
                let modulePrices: any[] = [];
                let sum: number = 0;

                if (result.groupUid === this.editModuleGroup) {
                    this.chaptersModules[moduleIndex] = result;
                    for (let m in this.chaptersModules) {
                        modulePrices.push(this.chaptersModules[m].price);
                    }
                }
                else {
                    let moduleOld = this.chaptersModules.filter(module => module.name === result.name)[0];
                    let moduleOldIndex = this.chaptersModules.indexOf(moduleOld);

                    this.chaptersModules.splice(moduleOldIndex, 1);

                    for (let m in this.chaptersModules) {
                        modulePrices.push(this.chaptersModules[m].price);
                    }
                }

                sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.chapterPrice = sum;
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
                let module = this.chaptersModules.filter(module => module.uid === moduleUid)[0];
                let moduleIndex = this.chaptersModules.indexOf(module);

                this.chaptersModules.splice(moduleIndex, 1);

                let modulePrices: any[] = [];
                let sum: number = 0;

                for (let m in this.chaptersModules) {
                    modulePrices.push(this.chaptersModules[m].price);
                }

                if(modulePrices.length){
                    sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                }
                else {
                    sum = 0;
                }

                this.chapterPrice = sum;
            }
        });
    }

    addModule() {
        // this.editModuleGroup = groupUid;
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let modulePrices: any[] = [];
                let sum: number = 0;

                this.chaptersModules.push(result);

                for (let m in this.chaptersModules) {
                    modulePrices.push(this.chaptersModules[m].price);
                }

                sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.chapterPrice = sum;
            }
        });
    }

    addFromModuleList() {
              let dialogRef = this.dialog.open(ModuleListDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                for(let e in result) {
                    // update modules list after adding new
                    this.chaptersModules.push(result[e]);
                    let modulePrices: any[] = [];
                    let sum: number = 0;

                    // update chapter price
                    for (let m in this.chaptersModules) {
                        modulePrices.push(this.chaptersModules[m].price);
                    }

                    sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                    this.chapterPrice = sum;
                }
            }
        });
    }

    closeDialog() {
        this._dialogService.closeAll();
    }

}

