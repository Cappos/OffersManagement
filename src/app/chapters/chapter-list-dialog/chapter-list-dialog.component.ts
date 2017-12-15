import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {
    IPageChangeEvent,
    ITdDataTableColumn, ITdDataTableSortChangeEvent, LoadingMode, LoadingType, TdDataTableService,
    TdDataTableSortingOrder, TdDialogService,
    TdLoadingService
} from "@covalent/core";
import {Observable} from "rxjs/Observable";
import {SharedService} from "../../shared/shared.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {MatDialog, MatDialogRef} from "@angular/material";
import * as fromChapters from '../store/chapters.reducers';
import * as ChaptersActions from "../store/chapters.actions";

@Component({
    selector: 'app-chapter-list-dialog',
    templateUrl: './chapter-list-dialog.component.html',
    styleUrls: ['./chapter-list-dialog.component.css']
})
export class ChapterListDialogComponent implements OnInit {

    pageTitle = 'Chapters';
    title = 'List of all chapters';
    color = 'grey';
    disabled = false;
    selectable = false;

    columns: ITdDataTableColumn[] = [
        {name: 'uid', label: 'No.', tooltip: 'No.'},
        {name: 'name', label: 'Name', tooltip: 'Name', width: 350},
        {name: 'subTotal', label: 'Price', tooltip: 'Price'},
        {name: 'tstamp', label: 'Date', tooltip: 'Date', width: 150}
    ];

    modulesState: Observable<fromChapters.State>;

    data: any[];
    filteredData;
    filteredTotal: number;
    searchTerm = '';
    fromRow = 1;
    currentPage = 1;
    pageSize = 5;
    sortBy = 'uid';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
    selectedModule;
    selectedRows: any[] = [];

    constructor(private sharedService: SharedService, private _dataTableService: TdDataTableService, private store: Store<fromChapters.FeatureState>, private dialog: MatDialog, private loadingService: TdLoadingService, public dialogRef: MatDialogRef<ChapterListDialogComponent>) {
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
            console.log(this.data);
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

    addChapter(){
        this.dialogRef.close(this.selectedRows);
    }
}
