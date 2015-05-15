import Em from 'ember';

export default Em.Controller.extend({
  lat: 32.5743999,
  lng: 34.9540231,
  zoom: 18,

  markers: [
    Ember.Object.create({ lat: 32.5743999, lng: 34.9540231, info: '<p>hello</p>' })
  ]
});