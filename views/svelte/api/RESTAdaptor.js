import BaseAdaptor from './BaseAdaptor';

class RestAdaptor extends BaseAdaptor {

    // This should set up the base URL for the
    constructor(url) {
        super();
        if (new.target === BaseAdaptor) {
            throw new Error("Cannot instantiate an abstract class.");
        }
        this.baseURL = url || process.env.AILTIRE_REST_URL || "http://localhost:8080";
        return this;
    }
    async get(pkg,model,id) {
        let url = `${this.baseURL}/${id}`;
    };
    async list(pkg,model) {

    }
    async search(pkg,model, q,p,s) {

    }
    async update(pkg,model,id, data) {

    }
    async remove(pkg,model,id) {

    }
    async addTo(pkg,model,pid, assoc, aid) {

    }
    async removeFrom(pkg,model,id,assoc, aid) {

    }
    async call(pkg,model,id,op,body) {

    }
    async getSchema(pkg,model) {

    }
}
module.exports = BaseAdaptor;