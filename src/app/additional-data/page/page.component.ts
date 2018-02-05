import {Component, OnInit, Output} from '@angular/core';
import { Location } from '@angular/common';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {SharedService} from "../../shared/shared.service";
import {Apollo} from "apollo-angular";
import fetchPage from '../../queries/fetchPage';
import getPagesData from '../../queries/fetchPages';
import updatePage from '../../queries/updatePage';
import  createPage from '../../queries/createPage';
import * as _ from "lodash";

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
    title;
    id: number;
    item;
    @Output() editMode = false;
    rteData = '';

    constructor(private route: ActivatedRoute, private loadingService: TdLoadingService, private apollo: Apollo, private sharedService: SharedService, private location: Location, private router: Router) {
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
                    this.id = params['id'];
                    this.editMode = !!params['edit'];

                    this.apollo.watchQuery<any>({
                        query: fetchPage,
                        variables: {
                            id: this.id
                        },
                        fetchPolicy: 'network-only'
                    }).valueChanges.subscribe(({data}) => {
                        this.item = _.cloneDeep(data.page);
                        this.title = this.item.title;
                        this.rteData = this.item.bodytext;
                        this.loadingService.resolveAll('modulesLoader');
                    });

                } else {
                    this.title = 'New page';
                    this.rteData = ' ';
                    this.editMode = true;
                    this.loadingService.resolveAll('modulesLoader');
                }

            }
        );
    }

    onEdit() {
        this.editMode = true;
    }

    onSave(form: NgForm){
        const value = form.value;
        if(this.id){
            this.apollo.mutate({
                mutation: updatePage,
                variables: {
                    id: this.id,
                    title: value.title,
                    subtitle: value.subtitle,
                    bodytext: this.rteData
                },
                refetchQueries: [{
                    query: getPagesData
                }]
            }).subscribe(() => {
                this.sharedService.sneckBarNotifications(`page updated.`);
                this.editMode = false;
            });
        }
        else {
            this.apollo.mutate({
                mutation: createPage,
                variables: {
                    title: value.title,
                    subtitle: value.subtitle,
                    bodytext: this.rteData
                },
                refetchQueries: [{
                    query: getPagesData
                }]
            }).subscribe(() => {
                this.sharedService.sneckBarNotifications(`page created.`);
                this.editMode = false;
                this.router.navigate(['/additionalData']);
            });
        }


    }

    keyupHandler(ev) {
        this.rteData = ev;
    }

    goBack(){
        this.location.back();
    }
}
