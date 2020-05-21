import { Advert } from "./Advert";
import { format } from "../shared/day";

export class Conversation {
    constructor(c) {
        Object.entries(c).forEach(([k, v]) => {
            if (k === 'advert') {
                this[k] = new Advert(v);
                return;
            }

            if (k === 'updated_at') {
                this[k] = format(v);
                return;
            }

            this[k] = v;
        })
    }
}