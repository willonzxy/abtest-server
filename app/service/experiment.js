const BaseService = require('./base_service/index.js')

class ExpService extends BaseService{
    constructor(ctx){
        super(ctx,'experiment')
    }
}

module.exports = ExpService;