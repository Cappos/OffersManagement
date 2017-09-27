import { Component } from '@angular/core';
import {SharedService} from "../shared/shared.service";

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  pageTitle = 'Clients';

  constructor(private sharedService: SharedService){
    this.sharedService.changeTitle(this.pageTitle);
  }

}
