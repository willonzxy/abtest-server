/**
 * @ Author: 伟龙-willon
 * @ Create Time: 2019-07-30 15:36:33
 * @ Modified by: 伟龙-willon
 * @ Modified time: 2019-10-25 09:31:27
 * @ Description:
 */

const BaseService = require('./base_service/index.js')

class UserService extends BaseService{
    constructor(ctx){
        super(ctx,'user')
    }
}

module.exports = UserService;