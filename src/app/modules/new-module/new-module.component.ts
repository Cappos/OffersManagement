import {Component, OnInit, Output} from '@angular/core';
import {SharedService} from "../../shared/shared.service";
import {NgForm} from "@angular/forms";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {Apollo} from 'apollo-angular';
import createModule from '../../queries/crateModule';
import {Router} from "@angular/router";
import fetchCategories from '../../queries/fetchCategories';
import getModulesData from '../../queries/fetchModules';

@Component({
    selector: 'app-new-module',
    templateUrl: './new-module.component.html',
    styleUrls: ['./new-module.component.css']
})
export class NewModuleComponent implements OnInit {
    pageTitle = 'Modules';
    @Output() editMode = true;
    rteData = '';
    categories: any[];

    constructor(private sharedService: SharedService, private loadingService: TdLoadingService, private apollo: Apollo, private router: Router) {
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
        this.apollo.watchQuery<any>({
            query: fetchCategories
        }).valueChanges.subscribe(({data}) => {
            console.log(data);
            this.categories = data.categories;
            this.loadingService.resolveAll('modulesLoader');
        });

    }

    keyupHandler(ev) {
        this.rteData = ev;
    }

    onSave(form: NgForm) {
        const value = form.value;
        const category = this.categories.find(category => category.value == value.categoryId);
        const group = null;

        console.log(value);
        this.apollo.mutate({
            mutation: createModule,
            variables: {
                name: value.name,
                bodytext: this.rteData,
                price: value.price,
                groupId: group,
                categoryId: category._id
            },
            refetchQueries: [{
                query: getModulesData
            }]
        }).subscribe(() => {
            this.editMode = false;
            this.sharedService.sneckBarNotifications(`module created.`);
            this.router.navigate(['/modules']);
        });
    }
}
