/**
 * Location.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 var uuid = require('uuid');

 module.exports = {
  autoPK: false,
  attributes: {
    id: { type: 'string', required: true,  primaryKey: true},
    device:{model:'device',required:true},
    zone:{model:'zone',required:false},
    lat:{ type: 'string', required: true},
    long:{ type: 'string', required: true},
    address:{ type: 'string', required: false}
  },
  prepareData: function(params) {
    var l = {};
    l.device = params.device;
    l.id = uuid.v4();
    l.zone = params.zone;
    l.lat = params.location.split(",")[0];
    l.long = params.location.split(",")[1];
    l.address = params.address;

    return l;
  },
}
