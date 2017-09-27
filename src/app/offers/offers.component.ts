import { Component } from '@angular/core';
import {SharedService} from "../shared/shared.service";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent {
  pageTitle = 'Offers';

  constructor(private sharedService: SharedService){
    this.sharedService.changeTitle(this.pageTitle);
  }

}
