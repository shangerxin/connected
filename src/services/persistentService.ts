import * as _ from "lodash";
import * as localforage from "localforage";

import { Injectable } from "@angular/core";
import "../extends/extendPromise";

@Injectable({
    providedIn: "root"
})
export class PersistentService {
    constructor() {
        this.init();
    }

    async save(key, data) {
        return localforage.setItem(key, data);
    }

    async isHas(key) {
        return null === (await localforage.getItem(key));
    }

    async get(key) {
        return localforage.getItem(key);
    }

    async delete(key) {
        return localforage.removeItem(key);
    }

    async getKeys() {}

    async getAll() {}

    async getAllValues(filter = null) {
        let items = [];
        return new Promise((res, rej) => {
            localforage.keys().then(keys => {
                Promise.sequenceHandleAll(keys, (k, callback) => {
                    localforage.getItem(k).then(v => {
                        if (filter) {
                            if (filter(v, k)) {
                                items.push(v);
                                callback();
                            } else {
                                callback();
                            }
                        } else {
                            items.push(v);
                            callback();
                        }
                    });
                }).then(()=>res(items)).catch(e=>rej(e));
            });
        });
    }

    protected init() {
        localforage.config({
            driver: localforage.INDEXEDDB,
            description: "Save data for web extension Connected"
        });
    }
}
