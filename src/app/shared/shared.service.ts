import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class SharedService {
    titleChanged = new EventEmitter();

    changeTitle(title) {
        this.titleChanged.emit(title);
    }
}
