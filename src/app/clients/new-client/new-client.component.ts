import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {

  pageTitle = 'Create new client';

  constructor(private sharedService: SharedService, private httpClient: HttpClient, private router: Router) {
    this.sharedService.changeTitle(this.pageTitle);
  }

  ngOnInit() {
  }

  onSave(form: NgForm) {
    const value = form.value;
    console.log(value);
  }
}
