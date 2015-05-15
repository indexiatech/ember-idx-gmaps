/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-idx-gmaps',
  contentFor: function(type, config) {
    if (type === 'head') {
      return '<script src="http://maps.googleapis.com/maps/api/js?v=3&libraries=places"></script>'
    }
  }
};
