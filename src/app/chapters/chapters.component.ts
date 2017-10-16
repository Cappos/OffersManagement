import {Component, HostBinding, OnInit, ViewContainerRef} from '@angular/core';
import {SharedService} from '../shared/shared.service';
import {Store} from "@ngrx/store";
import 'rxjs';
import 'rxjs/add/operator/take';

import {
    IPageChangeEvent,
    ITdDataTableColumn, ITdDataTableSortChangeEvent, LoadingMode, LoadingType, TdDataTableService,
    TdDataTableSortingOrder, TdDialogService, TdLoadingService
} from '@covalent/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

import * as fromChapters from './store/chapters.reducers';
import * as ChaptersActions from "./store/chapters.actions";
import {MdDialog} from "@angular/material";
import {slideInDownAnimation} from "../_animations/app.animations";

@Component({
    selector: 'app-chapters',
    templateUrl: './chapters.component.html',
    styleUrls: ['./chapters.component.css'],
    animations: [slideInDownAnimation]
})

export class ChaptersComponent implements OnInit {
    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;


    pageTitle = 'Chapters';
    title = 'List of all chapters';
    color = 'grey';
    disabled = false;
    selectable = false;

    columns: ITdDataTableColumn[] = [
        {name: 'uid', label: 'No.', tooltip: 'No.'},
        {name: 'name', label: 'Name', tooltip: 'Name'},
        {name: 'price', label: 'Price', tooltip: 'Price'},
        {name: 'tstamp', label: 'Date', tooltip: 'Date'},
        {name: 'action', label: 'Actions', tooltip: 'Actions'},
    ];

    modulesState: Observable<fromChapters.State>;

    data: any[];
    filteredData;
    filteredTotal: number;
    searchTerm = '';
    fromRow = 1;
    currentPage = 1;
    pageSize = 5;
    sortBy = 'id';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

    constructor(private sharedService: SharedService, private _dataTableService: TdDataTableService, private router: Router, private store: Store<fromChapters.FeatureState>, private dialog: MdDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, private loadingService: TdLoadingService) {
        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');
        //get data from backend
        this.store.dispatch(new ChaptersActions.GetChapters());
        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.modulesState = this.store.select('chaptersList');
        this.modulesState.take(2).subscribe((fromChapters: fromChapters.State) => {
            this.data = fromChapters.chapters;
            this.filteredData = this.data;
            this.filteredTotal = this.data.length;
            this.filter();
            this.loadingService.resolveAll('modulesLoader');
        });

    }

    sort(sortEvent: ITdDataTableSortChangeEvent, name: string): void {
        this.sortBy = name;
        this.sortOrder = sortEvent.order === TdDataTableSortingOrder.Descending ? TdDataTableSortingOrder.Ascending : TdDataTableSortingOrder.Descending;
        this.filter();
    }

    search(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.filter();
    }

    page(pagingEvent: IPageChangeEvent): void {
        this.fromRow = pagingEvent.fromRow;
        this.currentPage = pagingEvent.page;
        this.pageSize = pagingEvent.pageSize;
        this.filter();
    }

    filter(): void {
        let newData: any[] = this.data;
        const excludedColumns: string[] = this.columns
            .filter((column: ITdDataTableColumn) => {
                return ((column.filter === undefined && column.hidden === true) ||
                (column.filter !== undefined && column.filter === false));
            }).map((column: ITdDataTableColumn) => {
                return column.name;
            });
        newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
        this.filteredTotal = newData.length;
        newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
        newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
        this.filteredData = newData;
    }

    onEdit(row: any) {
        let id = +row['uid'];
        this.router.navigate(['/chapters/' + id + '/edit']);

    }

    onDelete(row: any) {
        let id = +row['uid'];
        this._dialogService.openConfirm({
            message: 'Are you sure you want to remove this Chapter?',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                let chapter = this.data.filter(chapter => chapter.uid === id)[0];
                let chapterIndex = this.data.indexOf(chapter);
                this.data.splice(chapterIndex, 1);
                this.filteredData = this.data;
                this.filter();
            }
        });

    }

    onSelect(uid) {
        this.router.navigate(['/chapters/' + uid]);
    }

}

