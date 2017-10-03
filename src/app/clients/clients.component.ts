import {Component, OnInit} from '@angular/core';
import {SharedService} from "../shared/shared.service";
import {
    IPageChangeEvent,
    ITdDataTableColumn, ITdDataTableSortChangeEvent, TdDataTableService,
    TdDataTableSortingOrder
} from "@covalent/core";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromClients from './store/clients.reducers';
import * as ClientsActions from "./store/clients.actions";


@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
    pageTitle = 'Clients';
    title = 'List of all clients';
    columns: ITdDataTableColumn[] = [
        {name: 'uid', label: 'No.', tooltip: 'No.'},
        {name: 'companyName', label: 'Name', tooltip: 'Name'},
        {name: 'address', label: 'Address', tooltip: 'Address'},
        {name: 'contactPerson', label: 'Contact person', tooltip: 'Contact person'},
        {name: 'contactPhone', label: 'Phone', tooltip: 'Phone'},
        {name: 'mail', label: 'Mail', tooltip: 'Mail'},
        {name: 'tstamp', label: 'Date', tooltip: 'Date'},
        {name: 'action', label: 'Actions', tooltip: 'Actions'},
    ];

    clientsState: Observable<fromClients.State>;

    data: any[];
    filteredData;
    filteredTotal: number;
    searchTerm = '';
    fromRow = 1;
    currentPage = 1;
    pageSize = 10;
    sortBy = 'id';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

    constructor(private sharedService: SharedService, private _dataTableService: TdDataTableService, private router: Router, private store: Store<fromClients.FeatureState>) {
        //get data from backend
        this.store.dispatch(new ClientsActions.GetClients());
        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.clientsState = this.store.select('clientsList');
        this.clientsState.take(2).subscribe((fromClients: fromClients.State) => {
            this.data = fromClients.clients;
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
        this.router.navigate(['/clients/' + id + '/edit']);

    }

    onSelect(uid) {
        this.router.navigate(['/clients/' + uid]);
    }


}
