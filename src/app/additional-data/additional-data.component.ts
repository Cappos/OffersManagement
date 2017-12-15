import {
    Component, HostBinding, OnInit, Output, ElementRef, QueryList, ViewChildren, OnDestroy
} from '@angular/core';
import {SharedService} from '../shared/shared.service';
import {
    ITdDataTableColumn, ITdDataTableSortChangeEvent, LoadingMode, LoadingType, TdDataTableSortingOrder,
    TdLoadingService,
} from '@covalent/core';
import {Observable} from 'rxjs/observable';
import 'rxjs';
import {Router} from '@angular/router';
import {slideInDownAnimation} from '../_animations/app.animations';
import {DragulaService} from 'ng2-dragula';
import {MediaBrowserComponent} from '../media-browser/media-browser.component';
import {MatDialog} from '@angular/material';
import {DataService} from '../shared/data.service';

@Component({
    selector: 'app-additional-data',
    templateUrl: './additional-data.component.html',
    styleUrls: ['./additional-data.component.css'],
    animations: [slideInDownAnimation]
})
export class AdditionalDataComponent implements OnInit, OnDestroy {
    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('class.td-route-animation') classAnimation = true;

    pageTitle = 'Default text data';
    title = 'Select option';
    @Output() activeTab = 0;
    @ViewChildren('accordionModule', {read: ElementRef}) accordionModule: QueryList<ElementRef>;
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
    pagesOrder: any[] = [];
    dragContainer = 'pages-bag';
    media: any[] = [];
    dropSubscription;

    constructor(private sharedService: SharedService, private router: Router, private loadingService: TdLoadingService, private dragulaService: DragulaService, public dialog: MatDialog, private dataService: DataService) {
        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });

        this.sharedService.changeTitle(this.pageTitle);

        // Enable drag and drop
        this.dragulaService.setOptions(this.dragContainer, {
            moves: function (el, container, handle) {
                return handle.className === 'handle mat-icon material-icons';
            }
        });

        this.loadingService.register('modulesLoader');
    }

    ngOnInit() {
        this.pageState = this.dataService.getPagesData();

        this.pageState.take(1).subscribe((res) => {
            this.data = res;

            // Enable ordering chapters
            this.dropSubscription = this.dragulaService.drop.subscribe((value) => {
                this.accordionModule.changes.take(1).subscribe(children => {
                    this.pagesOrder = [];
                    children.forEach(child => {
                        const index = +child.nativeElement.getAttribute('index') + 1;
                        const element = {uid: child.nativeElement.getAttribute('uid'), order: index};
                        this.pagesOrder.push(element);
                    });
                    console.log(this.pagesOrder, 'new order');
                });
            });
            this.loadingService.resolveAll('modulesLoader');
        });
    }

    sort(sortEvent: ITdDataTableSortChangeEvent, name: string): void {
        this.sortBy = name;
        this.sortOrder = sortEvent.order === TdDataTableSortingOrder.Descending ? TdDataTableSortingOrder.Ascending : TdDataTableSortingOrder.Descending;
    }

    onSelectChange = ($event: any): void => {
        this.activeTab = $event.index;
        this.router.navigate(['/additionalData/']);
    }

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

    addGraph() {
        const dialogRef = this.dialog.open(MediaBrowserComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
                this.media.push(result);
            }
        });
    }

    onImgRemove(id: number) {
        this.media.splice(this.media.findIndex(el => el.id === id), 1);
    }

    ngOnDestroy() {
        this.dragulaService.destroy(this.dragContainer);
        this.dropSubscription.unsubscribe();
    }
}
