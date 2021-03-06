import * as  uuid  from "uuid/v4";
import { GlobalConst } from "../environments/globalConstTypes";

export class SessionModel {
    id;
    name;
    description;
    tabs;
    lastAccessDate;
    createDate;
    static create(name, description) {
        return <SessionModel>{
            id: `${GlobalConst.sessionIdPrefix}${uuid()}`,
            name: name ? name : "",
            description: description ? description : "",
            tabs: [],
            createDate: Date.now(),
            lastAccessDate: Date.now(),
        };
    }
}
