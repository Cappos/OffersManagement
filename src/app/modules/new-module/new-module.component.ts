import {Component, Output} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {Module} from "../modules.model";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-new-module',
    templateUrl: './new-module.component.html',
    styleUrls: ['./new-module.component.css']
})
export class NewModuleComponent {
    pageTitle = 'Modules';
    @Output() editMode = false;
    rteData = '';
    groups: any[] = [
        {name: 'Technical', value: 1},
        {name: 'Design', value: 2},
        {name: 'Optimization', value: 3},
        {name: 'SEO', value: 4}

    ];
    selectedGroup;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private httpClient: HttpClient) {
        this.sharedService.changeTitle(this.pageTitle);
    }

    keyupHandler(ev) {
        this.rteData = ev;
    }

    onSave(form: NgForm) {
        const value = form.value;
        // const updateModule = new Module(this.item.uid, value.name, this.rteData, value.price, value.tstamp, this.item.cruserId, this.item.crdate, this.item.modify, value.groupUid);
        // this.store.dispatch(new ModulesActions.AddModule(updateModule));
        // console.log(updateModule);
    }

}
