const BaseService = require('./base_service/index.js')

class LaunchService extends BaseService{
    constructor(ctx){
        super(ctx,'launch')
    }
}

module.exports = LaunchService;