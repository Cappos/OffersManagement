import { Component } from '@angular/core';
import {SharedService} from "../shared/shared.service";

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent {
  pageTitle = 'Modules';

  constructor(private sharedService: SharedService){
    this.sharedService.changeTitle(this.pageTitle);
  }

}
