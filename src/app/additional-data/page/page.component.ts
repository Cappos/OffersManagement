import {Component, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params} from "@angular/router";
import {NgForm} from "@angular/forms";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {DataService} from "../../shared/data.service";

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
    title;
    id: number;
    item;
    pageState: Observable<any>;
    @Output() editMode = false;
    rteData;

    constructor(private route: ActivatedRoute, private loadingService: TdLoadingService, private dataService: DataService) {
        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params: Params) => {
                if(params['id']){
                    this.id = +params['id'];
                    this.editMode = !!params['edit'];
                    this.pageState = this.dataService.getPageData();

                    this.pageState.take(1).subscribe((res) => {
                        this.item = res;
                        this.title = this.item.title;
                        this.rteData = this.item.bodytext;
                    })
                }
                else {
                    this.title = 'New page';
                    this.rteData = '';
                    this.editMode = true;
                }

                this.loadingService.resolveAll('modulesLoader');

            }
        );
    }

    onEdit() {
        console.log('edit');
        this.editMode = true;
    }

    onSave(form: NgForm){
        console.log(form.value);
        this.editMode = false;

    }

    keyupHandler(ev) {
        console.log(ev);
    }

}
