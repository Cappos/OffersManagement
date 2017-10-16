import {Component, HostBinding, OnInit, Output} from '@angular/core';
import {SharedService} from "../shared/shared.service";
import {
    ITdDataTableColumn, ITdDataTableSortChangeEvent, LoadingMode, LoadingType, TdDataTableSortingOrder,
    TdLoadingService
} from "@covalent/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {slideInDownAnimation} from "../_animations/app.animations";

@Component({
    selector: 'app-additional-data',
    templateUrl: './additional-data.component.html',
    styleUrls: ['./additional-data.component.css'],
    animations: [slideInDownAnimation]
})
export class AdditionalDataComponent implements OnInit {
    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

    pageTitle = 'Default text data';
    title = 'Select option';
    @Output() activeTab = 0;

    columns: ITdDataTableColumn[] = [
        {name: 'uid', label: 'No.', tooltip: 'No.'},
        {name: 'title', label: 'Page title', tooltip: 'Page title'},
        {name: 'tstamp', label: 'Date', tooltip: 'Date'},
        {name: 'action', label: 'Actions', tooltip: 'Actions'},
    ];

    data: any[];
    sortBy = 'id';
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
    pageState: Observable<any>;

    constructor(private sharedService: SharedService, private httpClient: HttpClient, private router: Router, private loadingService: TdLoadingService) {
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
        this.pageState = this.httpClient.get<any>('http://wrenchweb.com/http/pagesData', {
            observe: 'body',
            responseType: 'json'
        });
        this.pageState.take(1).subscribe((res) => {
            this.data = res;
            this.loadingService.resolveAll('modulesLoader');
        })

    }

    sort(sortEvent: ITdDataTableSortChangeEvent, name: string): void {
        this.sortBy = name;
        this.sortOrder = sortEvent.order === TdDataTableSortingOrder.Descending ? TdDataTableSortingOrder.Ascending : TdDataTableSortingOrder.Descending;
    }

    onSelectChange = ($event: any): void => {
        this.activeTab = $event.index;
        this.router.navigate(['/additionalData/']);
    };

    onEdit(row) {
        console.log(row);
        this.router.navigate(['/additionalData/page/' + row.uid + '/edit']);
    }

    onDelete(row) {
        console.log(row);
    }

    onSelect(uid) {
        console.log(uid);
    }

}
