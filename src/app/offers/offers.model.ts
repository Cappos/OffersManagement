import {Group} from "./groups.model";

export class Offer {
    constructor(public uid: number,
                public offerNumber: string,
                public bodytext: string,
                public totalPrice: number,
                public tstamp: string,
                public cruserId: number,
                public crdate: string,
                public groups: Group[]) {
    }
}
