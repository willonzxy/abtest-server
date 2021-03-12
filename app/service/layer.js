const BaseService = require('./base_service/index.js')

class LayerService extends BaseService{
    constructor(ctx){
        super(ctx,'layer')
    }
}

module.exports = LayerService;