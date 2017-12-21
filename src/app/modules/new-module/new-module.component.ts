import {Component, OnInit, Output} from '@angular/core';
import {SharedService} from "../../shared/shared.service";
import {NgForm} from "@angular/forms";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {Apollo} from 'apollo-angular';
import createModule from '../../queries/crateModule';
import {Router} from "@angular/router";

@Component({
    selector: 'app-new-module',
    templateUrl: './new-module.component.html',
    styleUrls: ['./new-module.component.css']
})
export class NewModuleComponent implements OnInit {
    pageTitle = 'Modules';
    @Output() editMode = true;
    rteData = '';
    groups: any[] = [
        {name: 'Technical', value: "1"},
        {name: 'Design', value: "2"},
        {name: 'Optimization', value: "3"},
        {name: 'SEO', value: "4"}

    ];
    selectedGroup;

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

    ngOnInit(){
        this.loadingService.resolveAll('modulesLoader');
    }

    keyupHandler(ev) {
        this.rteData = ev;
    }

    onSave(form: NgForm) {
        const value = form.value;
        console.log(value);
        this.apollo.mutate({
            mutation: createModule,
            variables: {
                name: value.name,
                bodytext: this.rteData,
                price: value.price,
                group: value.groupUid
            }
        }).subscribe(() => {
            this.editMode = false;
            this.sharedService.sneckBarNotifications(`module created.`);
            this.router.navigate(['/modules']);
        });

    }

}
