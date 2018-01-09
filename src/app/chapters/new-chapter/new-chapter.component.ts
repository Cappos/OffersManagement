import {Component, OnInit, Output, ViewContainerRef} from '@angular/core';
import {SharedService} from "../../shared/shared.service";
import {NgForm} from "@angular/forms";
import {MatDialog} from "@angular/material";
import {EditModuleDialogComponent} from "../../modules/edit-module-dialog/edit-module-dialog.component";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {Group} from "../../offers/groups.model";
import {ModuleListDialogComponent} from "../../modules/module-list-dialog/module-list-dialog.component";
import {Router} from "@angular/router";
import {Apollo} from "apollo-angular";
import fetchGroups from '../../queries/fetchGroups';
import createGroup from '../../queries/createGroup';

@Component({
    selector: 'app-new-chapter',
    templateUrl: './new-chapter.component.html',
    styleUrls: ['./new-chapter.component.css']
})

export class NewChapterComponent implements OnInit {
    pageTitle = 'Chapters';
    title = 'New chapter';
    item: Group;
    id: number;
    @Output() editMode = true;
    chaptersModules = [];
    chapterPrice: number = 0;
    editModuleGroup: number;
    savedChapterData;
    itemSaved = false;
    modulesNew = [];
    modulesUpdate = [];
    modulesDeleted = [];
    modules: any[] = [];

    constructor(private sharedService: SharedService, private dialog: MatDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, private loadingService: TdLoadingService, private apollo: Apollo, private router: Router) {
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
        this.loadingService.resolveAll('modulesLoader');
    }

    onSave(form: NgForm) {
        const value = form.value;

        let subTotal = null;

        if (value.subTotal) {
            subTotal = value.subTotal.replace(',', '');
        }

        if (!this.modulesUpdate.length && !this.modulesNew.length) {
            console.log('empty');
            let modules = this.modules.length ? this.modules : [];
            this.apollo.mutate({
                mutation: createGroup,
                variables: {
                    name: value.name,
                    subTotal: subTotal,
                    modules: modules
                },
                refetchQueries: [{
                    query: fetchGroups
                }]
            }).subscribe(() => {
                this.editMode = false;
                this.sharedService.sneckBarNotifications(`chapter created.`);
                this.router.navigate(['/chapters']);
            });
        }
        else {
            console.log('not null');
            let modules = [];
            for (let item in this.modulesNew) {
                modules.push(this.modulesNew[item])
            }
            for (let item in this.modulesUpdate) {
                modules.push(this.modulesUpdate[item])
            }
            this.apollo.mutate({
                mutation: createGroup,
                variables: {
                    name: value.name,
                    subTotal: subTotal,
                    modulesNew: modules
                },
                refetchQueries: [{
                    query: fetchGroups
                }]
            }).subscribe(() => {
                this.editMode = false;
                this.sharedService.sneckBarNotifications(`chapter created.`);
                this.router.navigate(['/chapters']);
            });

        }
    }

    onModuleEdit(moduleUid: number, groupUid: number, moduleNew: boolean, moduleData: any) {
        this.editModuleGroup = groupUid;
        let moduleNewData = moduleNew ? moduleData : null;
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                moduleUid: moduleUid,
                groupUid: groupUid,
                edit: true,
                moduleNew: moduleNewData
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.editMode = true;
                if (result.moduleNew) {
                    let module = this.modulesNew.filter(module => module.id === result.id)[0];
                    let moduleIndex = this.modulesNew.indexOf(module);
                    if (moduleIndex >= 0) {
                        this.modulesNew[moduleIndex] = result;
                    }
                    else {
                        this.modulesNew.push(result);
                    }
                }
                else {
                    let module = this.modulesUpdate.filter(module => module.id === result.id)[0];
                    let moduleIndex = this.modulesUpdate.indexOf(module);

                    if (moduleIndex >= 0) {
                        this.modulesUpdate[moduleIndex] = result;
                    }
                    else {
                        console.log(moduleIndex, 'else');
                        this.modulesUpdate.push(result);
                    }
                }

                let module = this.chaptersModules.filter(module => module.name === result.name)[0];
                let moduleIndex = this.chaptersModules.indexOf(module);
                let modulePrices: any[] = [];
                let sum: number = 0;

                this.chaptersModules[moduleIndex] = result;

                // update chapter price
                for (let m in this.chaptersModules) {
                    modulePrices.push(this.chaptersModules[m].price);
                }
                sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.chapterPrice = sum;
            }
        });
    }

    onModuleRemove(moduleUid: number, groupUid: number, moduleData: any) {
        this._dialogService.openConfirm({
            message: 'Are you sure you want to remove this module?',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.editMode = true
                if (!moduleUid) {
                    let module = this.modulesNew.filter(module => module.id === moduleData.id)[0];
                    let moduleIndex = this.modulesNew.indexOf(module);
                    this.modulesNew.splice(moduleIndex, 1);
                }
                else {
                    let module = this.chaptersModules.filter(module => module.id === moduleUid)[0];
                    let moduleIndex = this.chaptersModules.indexOf(module);
                    console.log(module, 'test');
                    console.log(this.chaptersModules, 'chapter');

                    if (moduleIndex >= 0) {

                        module.deleted = true;
                        this.modulesUpdate.push(module);
                        console.log(this.modulesUpdate);
                        // update modules lis after module delete
                        this.chaptersModules.splice(moduleIndex, 1);
                    }
                }


                // let module = this.chaptersModules.filter(module => module.uid === moduleUid)[0];
                // let moduleIndex = this.chaptersModules.indexOf(module);
                let modulePrices: any[] = [];
                let sum: number = 0;



                // update chapter price
                for (let m in this.chaptersModules) {
                    modulePrices.push(this.chaptersModules[m].price);
                }
                if (modulePrices.length) {
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
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.editMode = true
                if (result.moduleNew) {
                    this.modulesNew.push(result)
                }
                else {
                    this.modulesUpdate.push(result)
                }

                let modulePrices: any[] = [];
                let sum: number = 0;

                // update modules lis after adding module
                this.chaptersModules.push(result);

                // update chapter price
                for (let m in this.chaptersModules) {
                    modulePrices.push(this.chaptersModules[m].price);
                }
                sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.chapterPrice = sum;
            }
        });
    }

    addFromModuleList() {
        let dialogRef = this.dialog.open(ModuleListDialogComponent, {
            data: {
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.editMode = true
                for (let e in result) {
                    // update modules list after adding new
                    this.modulesNew.push(result[e]);
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
                this.sharedService.sneckBarNotifications('Modules added!!!');
            }
        });
    }

}

