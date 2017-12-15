import {Component, OnInit} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material";
import {Observable} from "rxjs/Observable";
import {
    IPageChangeEvent,
    ITdDataTableColumn, ITdDataTableSortChangeEvent, LoadingMode, LoadingType, TdDataTableService,
    TdDataTableSortingOrder,
    TdLoadingService
} from "@covalent/core";
import {SharedService} from "../../shared/shared.service";
import {DataService} from "../../shared/data.service";

@Component({
    selector: 'app-page-list-dialog',
    templateUrl: './page-list-dialog.component.html',
    styleUrls: ['./page-list-dialog.component.css']
})


export class PageListDialogComponent implements OnInit {

    pageTitle = 'Default text data';
    title = 'Select option';
    columns: ITdDataTableColumn[] = [
        {name: 'uid', label: 'No.', tooltip: 'No.'},
        {name: 'title', label: 'Page title', tooltip: 'Page title', width: 600},
        {name: 'tstamp', label: 'Date', tooltip: 'Date', width: 150},
    ];

    data: any[];
    sortBy = 'uid';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
    pageState: Observable<any>;
    filteredData;
    filteredTotal: number;
    searchTerm = '';
    fromRow = 1;
    currentPage = 1;
    pageSize = 5;
    selectedPage;
    selectedRows: any[] = [];

    constructor(private sharedService: SharedService, private loadingService: TdLoadingService, public dialog: MatDialog, private dataService: DataService, private _dataTableService: TdDataTableService, public dialogRef: MatDialogRef<PageListDialogComponent>) {
        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });

        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.pageState = this.dataService.getPagesData();

        this.pageState.take(1).subscribe((res) => {
            this.data = res;
            this.filteredData = this.data;
            this.filteredTotal = this.data.length;
            this.filter();
            this.loadingService.resolveAll('modulesLoader');
        })
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

    onSelect(uid) {
        this.selectedPage = uid;
    }

    addPage(){
        console.log(this.selectedRows);
        this.dialogRef.close(this.selectedRows);
    }

}

