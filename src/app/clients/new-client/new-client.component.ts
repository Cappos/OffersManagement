import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";

@Component({
    selector: 'app-new-client',
    templateUrl: './new-client.component.html',
    styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {

    pageTitle = 'Create new client';

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
        this.loadingService.resolveAll('modulesLoader');
    }

    onSave(form: NgForm) {
        const value = form.value;
        console.log(value);
    }
}
