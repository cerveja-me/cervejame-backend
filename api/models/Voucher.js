/**
 * Voucher.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var uuid = require('node-uuid');
 module.exports = {

  attributes: {
    id: {
        type: 'string',
        required: true,
        primaryKey: true,
        defaultsTo: function (){ return uuid.v4(); },
        unique: true,
        index: true,
        uuidv4: true
    },
    code:{type: 'string',unique: true, required: true},
    costumer:{model:'costumer',required:false},
    value : {type: 'float',required: true},
    unit:{type: 'string', required: true, defaultsTo:'money'},
    min_amount:{type: 'integer',required:true,defaultsTo:1},
    user_rule:{type: 'string', required: true,defaultsTo:'USER_LIMIT_1'},
    endAt:{type:'datetime', required:false},
    active: {type: 'boolean',required: false, defaultsTo: true},
    product:{model:'product',required:false},
    zone:{model:'product',required:false}
}
};

