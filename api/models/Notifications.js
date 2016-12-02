/**
 * Notifications.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = {

  attributes: {
    id: { type: 'string', required: true,  primaryKey: true ,defaultsTo:function() {return uuid.v4();} },
    notification:{type: 'string', required: true},
    id_table:{type: 'string', required: true}
  }
};

