import {EventEmitter, Injectable} from '@angular/core';
import {MdSnackBar} from "@angular/material";

@Injectable()
export class SharedService {
    titleChanged = new EventEmitter();

    constructor(public snackBar: MdSnackBar){

    }

    changeTitle(title) {
        this.titleChanged.emit(title);
    }

    sneckBarNotifications(message){
        this.snackBar.open(message, null, {
            duration: 2000
        });
    }
}
