class BaseAdaptor {

    constructor() {
        if (new.target === BaseAdaptor) {
            throw new Error("Cannot instantiate an abstract class.");
        }
    }
    async get(pkg,model,id) {

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