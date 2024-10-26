"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostOffice = void 0;
class PostOffice {
    constructor(id, address, location) {
        this.id = id;
        this.address = address;
        this.location = location;
    }
    static map(fileds) {
        return new PostOffice(fileds.id, fileds.address, fileds.location);
    }
}
exports.PostOffice = PostOffice;
