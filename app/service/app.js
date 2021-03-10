const BaseService = require('./base_service/index.js')

class AppService extends BaseService{
    constructor(ctx){
        super(ctx,'app')
    }
}

module.exports = AppService;