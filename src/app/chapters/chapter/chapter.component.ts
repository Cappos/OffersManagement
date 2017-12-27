import {Component, HostBinding, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Params} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {NgForm} from "@angular/forms";
import {MatDialog} from "@angular/material";
import {EditModuleDialogComponent} from "../../modules/edit-module-dialog/edit-module-dialog.component";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {slideInDownAnimation} from "../../_animations/app.animations";
import {ModuleListDialogComponent} from "../../modules/module-list-dialog/module-list-dialog.component";
import {Apollo} from "apollo-angular";
import fetchGroup from '../../queries/fetchGroup';
import updateGroup from '../../queries/updateGroup';

@Component({
    selector: 'app-chapter',
    templateUrl: './chapter.component.html',
    styleUrls: ['./chapter.component.css'],
    animations: [slideInDownAnimation]
})

export class ChapterComponent implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

    pageTitle = 'Chapters';
    id: number;
    item;
    @Output() editMode = false;
    chaptersModules = [];
    editModuleGroup: number;
    chapterPrice: number;
    modulesNew = [];
    modulesUpdate = [];
    modules: any[];

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private dialog: MatDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, private loadingService: TdLoadingService, private location: Location, private apollo: Apollo) {
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
                this.id = params['id'];
                this.editMode = !!params['edit'];

                this.apollo.watchQuery<any>({
                    query: fetchGroup,
                    variables: {
                        id: this.id
                    },
                    fetchPolicy: 'network-only'
                }).valueChanges.subscribe(({data}) => {
                    this.item = data.group;
                    if (this.item.modules) {
                        this.chaptersModules = this.item.modules;
                    }
                    this.chapterPrice = this.item.subTotal;
                    this.loadingService.resolveAll('modulesLoader');
                });
            }
        );
    }

    onSave(form: NgForm) {
        const value = form.value;
        const modules = this.modules.length ? this.modules : null;
        let subTotal = null;

        if (value.subTotal) {
            subTotal = value.subTotal.replace(',', '');
        }

        this.apollo.mutate({
            mutation: updateGroup,
            variables: {
                id: this.id,
                name: value.name,
                bodytext: value.bodytext,
                subTotal: subTotal,
                modules: modules
            }
        }).subscribe(() => {
            this.editMode = false;
            this.sharedService.sneckBarNotifications(`chapter updated.`);
        });
    }

    onEdit() {
        console.log('edit');
        this.editMode = true
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
                let module = this.chaptersModules.filter(module => module.name === result.name)[0];
                let moduleIndex = this.chaptersModules.indexOf(module);
                let modulePrices: any[] = [];
                let sum: number = 0;

                // update module after edit if parent group not change
                if (result.groupUid === this.editModuleGroup) {
                    this.chaptersModules[moduleIndex] = result;
                }
                // update module after edit if parent group change
                else {
                    let moduleOld = this.chaptersModules.filter(module => module.name === result.name)[0];
                    let moduleOldIndex = this.chaptersModules.indexOf(moduleOld);

                    this.chaptersModules.splice(moduleOldIndex, 1);
                }

                // update chapter price
                for (let m in this.chaptersModules) {
                    modulePrices.push(this.chaptersModules[m].price);
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
                let modulePrices: any[] = [];
                let sum: number = 0;

                // update modules lis after module delete
                this.chaptersModules.splice(moduleIndex, 1);

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

    addModule(chapterId: number) {
        this.editModuleGroup = chapterId;
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                groupUid: chapterId,
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);

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
                this.sharedService.sneckBarNotifications('Modules added!!!');
            }
        });
    }

    goBack() {
        this.location.back();
    }

}
