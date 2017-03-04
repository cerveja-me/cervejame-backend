/**
 * Zone.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 var uuid = require('node-uuid');

 module.exports = {
  autoPK: false,
  attributes: {
   id: { type: 'string', required: true,  primaryKey: true  },
   name: { type: 'string', required: true },
   description: { type: 'string', required: false },
   latNorth:{ type: 'string', required: true },
   longNorth:{ type: 'string', required: true },
   latSouth:{ type: 'string', required: true },
   longSouth:{ type: 'string', required: true },
   active: {type: 'boolean',required: false, defaultsTo: true},
   slack:{ type: 'string', required: false },
   telegram:{ type: 'string', required: false , defaultsTo:'-1001071922830'},
   schedule:{ type: 'string', required: false, defaultsTo:'{0:{start:0, end:0},1:{start:1, end:18},2:{start:1, end:18},3:{start:1, end:18},4:{start:1, end:18},5:{start:1, end:18},6:{start:0, end:0}}'}
 },
 prepareData: function(params) {
  var z = {};
  z.id = uuid.v4();
  z.name = params.name;
  z.description = params.description;
  z.latNorth = params.north.split(",")[0];
  z.longNorth = params.north.split(",")[1];
  z.latSouth  = params.south.split(",")[0];
  z.longSouth = params.south.split(",")[1];
  z.slack = params.slack;
  return z;
}
};
