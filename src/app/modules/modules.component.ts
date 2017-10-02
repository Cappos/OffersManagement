import {Component, OnInit} from '@angular/core';
import {SharedService} from '../shared/shared.service';
import {Store} from "@ngrx/store";
import 'rxjs';
import 'rxjs/add/operator/take';

import {
    IPageChangeEvent,
    ITdDataTableColumn, ITdDataTableSortChangeEvent, TdDataTableService,
    TdDataTableSortingOrder
} from '@covalent/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

import * as fromModules from '../modules/store/modules.reducers';
import * as ModulesActions from "./store/modules.actions";

@Component({
    selector: 'app-modules',
    templateUrl: './modules.component.html',
    styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
    pageTitle = 'Modules';
    title = 'List of all modules';
    color = 'grey';
    disabled = false;
    selectable = false;
    columns: ITdDataTableColumn[] = [
        {name: 'uid', label: 'No.', tooltip: 'No.'},
        {name: 'name', label: 'Name', tooltip: 'Name'},
        {name: 'bodytext', label: 'Description', tooltip: 'Description'},
        {name: 'price', label: 'Price', tooltip: 'Price'},
        {name: 'tstamp', label: 'Date', tooltip: 'Date'},
        {name: 'action', label: 'Actions', tooltip: 'Actions'},
    ];

    modulesState: Observable<fromModules.State>;

    data: any[];
    filteredData;
    filteredTotal: number;
    searchTerm = '';
    fromRow = 1;
    currentPage = 1;
    pageSize = 5;
    sortBy = 'id';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

    constructor(private sharedService: SharedService, private _dataTableService: TdDataTableService, private router: Router, private store: Store<fromModules.FeatureState>) {
        //get data from backend
        this.store.dispatch(new ModulesActions.GetModules());
        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.modulesState = this.store.select('modulesList');
        this.modulesState.take(2).subscribe((fromModules: fromModules.State) => {
            this.data = fromModules.modules;
            this.filteredData = this.data;
            this.filteredTotal = this.data.length;
            this.filter();
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
        this.router.navigate(['/modules/' + id + '/edit']);

    }

    onSelect(uid){
        this.router.navigate(['/modules/' + uid ]);
    }

}
