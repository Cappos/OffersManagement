import {Component, OnInit, Output} from '@angular/core';
import {SharedService} from "../shared/shared.service";
import {ITdDataTableColumn, ITdDataTableSortChangeEvent, TdDataTableSortingOrder} from "@covalent/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
    selector: 'app-additional-data',
    templateUrl: './additional-data.component.html',
    styleUrls: ['./additional-data.component.css']
})
export class AdditionalDataComponent implements OnInit {
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

    constructor(private sharedService: SharedService, private httpClient: HttpClient, private router: Router) {
        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.pageState = this.httpClient.get<any>('http://wrenchweb.com/http/pagesData', {
            observe: 'body',
            responseType: 'json'
        });
        this.pageState.take(1).subscribe((res) => {
            this.data = res;
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
