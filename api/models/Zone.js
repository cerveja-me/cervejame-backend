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
   slack:{ type: 'string', required: false }
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
