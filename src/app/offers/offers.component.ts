import {Component, HostBinding, OnInit, ViewContainerRef} from '@angular/core';
import {SharedService} from "../shared/shared.service";
import {
    IPageChangeEvent, ITdDataTableColumn, ITdDataTableSortChangeEvent, LoadingMode, LoadingType, TdDataTableService,
    TdDataTableSortingOrder,
    TdDialogService, TdLoadingService
} from "@covalent/core";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";

import * as fromOffers from './store/offers.reducers';
import * as OffersActions from "./store/offers.actions";
import {Offer} from "./offers.model";
import {MdDialog} from "@angular/material";
import {slideInDownAnimation} from "../_animations/app.animations";

@Component({
    selector: 'app-offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.css'],
    animations: [slideInDownAnimation]
})
export class OffersComponent implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

    pageTitle = 'Offers';

    title = 'List of all offers';
    color = 'grey';
    disabled = false;
    selectable = false;
    columns: ITdDataTableColumn[] = [
        {name: 'uid', label: 'No.', tooltip: 'No.'},
        {name: 'offerNumber', label: 'Offer number', tooltip: 'Offer number'},
        {name: 'clientName', label: 'Client', tooltip: 'Client'},
        {name: 'totalPrice', label: 'Price', tooltip: 'Price'},
        {name: 'tstamp', label: 'Created Date', tooltip: 'Date'},
        {name: 'action', label: 'Actions', tooltip: 'Actions'},
    ];

    offersState: Observable<fromOffers.State>;

    data: Offer[];
    filteredData;
    filteredTotal: number;
    searchTerm = '';
    fromRow = 1;
    currentPage = 1;
    pageSize = 10;
    sortBy = 'id';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

    constructor(private sharedService: SharedService, private _dataTableService: TdDataTableService, private router: Router, private store: Store<fromOffers.FeatureState>, private dialog: MdDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, private loadingService: TdLoadingService) {
        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');
        this.store.dispatch(new OffersActions.GetOffers());
        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.offersState = this.store.select('offersList');
        this.offersState.take(2).subscribe((fromOffers: fromOffers.State) => {
            this.data = fromOffers.offers;
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
        this.router.navigate(['/offers/' + id + '/edit']);

    }
    onDelete(row: any) {
        let id = +row['uid'];
        this._dialogService.openConfirm({
            message: 'Are you sure you want to remove this offer?',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                let offer = this.data.filter(offer => offer.uid === id)[0];
                let offerIndex = this.data.indexOf(offer);
                this.data.splice(offerIndex, 1);
                this.filteredData = this.data;
                this.filter();
            }
        });

    }

    onSelect(uid) {
        this.router.navigate(['/offers/' + uid]);
    }

}
