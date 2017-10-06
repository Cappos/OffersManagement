import {Component, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

    pageTitle = 'Modules';
    title;
    id: number;
    item;
    pageState: Observable<any>;
    @Output() editMode = false;
    rteData;

    constructor(private httpClient: HttpClient, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params: Params) => {
                if(params['id']){
                    this.id = +params['id'];
                    this.editMode = !!params['edit'];
                    this.pageState = this.httpClient.get<any>('http://wrenchweb.com/http/pageData', {
                        observe: 'body',
                        responseType: 'json'
                    });
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
