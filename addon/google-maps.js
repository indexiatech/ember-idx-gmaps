import Em from 'ember';
var on = Ember.on;
var observer = Em.observer;
var computed = Em.computed;

export default Em.Component.extend({
  lat: 0,
  lng: 0,
  map: undefined,
  zoom: 6,
  markers: [],
  markerCache: Em.A(),
  infoWindow: undefined,
  currentLocation: false,
  scrollwheel: true,
  classNames: ['map-canvas'],
  attributeBindings: ['style'],
  width: '600px',
  height: '400px',

  style: computed('width', 'height', function() {
    return Em.String.fmt('width: %@; height:%@;', this.get('width'), this.get('height'));
  }),

  getLocation: function() {
    var t = this;
    return new Promise(function(resolve, reject) {
      if (t.get('currentLocation')) {
        navigator.geolocation.getCurrentPosition(function(position) {
          resolve(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        });
      } else if (t.get('lat') && t.get('lng')) {
        resolve(new google.maps.LatLng(t.get("lat"), t.get("lng")));
      } else {
        reject('No position details given.');
      }
    });
  },

  initializeMap: on('didInsertElement', function() {
    var t = this;
    this.destroyMap();
    this.set('infoWindow', new google.maps.InfoWindow());
    //var container = this.$(".map-canvas");
    var container = this.$();
    var options = {
      zoom: this.get('zoom'),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: this.get('scrollwheel')
    };

    this.getLocation().then(function(pos) {
      options.center = pos;
      var map = new google.maps.Map(container[0], options);
      t.set('map', map);
      google.maps.event.addListener(map, 'zoom_changed', function() {
        var zoomLevel = map.getZoom();
        t.set('zoom', zoomLevel);
      });
      t.setMarkers();
    }, function(err) {
      //Handle error
    })
  }),

  destroyMap: on('willDestroyElement', function() {
    if (this.get('map')) {
      this.set('map', null);
    }
  }),

  coordinatesChanged: observer('lat', 'lng', function() {
    var map = this.get('map');
    if (map) map.setCenter(new google.maps.LatLng(this.get('lat'), this.get('lng')));
  }),

  zoomChanged: observer('zoom', function() {
    var map = this.get('map'), zoom = parseInt(this.get('zoom'));
    if (map) map.setZoom(zoom);
  }),

  setMarkers: observer('markers.@each.lat', 'markers.@each.lng', function() {
    var map = this.get('map'),
        markers = this.get('markers'),
        markerCache = this.get('markerCache'),
        infoWindow = this.get('infoWindow');

    markerCache.forEach(function(m) { m.setMap(null); }); // Remove all existing markers
    markers.forEach(function(m){
      var gMarker = new google.maps.Marker({
        position: new google.maps.LatLng(m.get('lat'), m.get('lng')),
        map: map
      });
      
      google.maps.event.addListener(gMarker, 'click', function() {
        infoWindow.setContent(m.info);
        infoWindow.open(map, this);
      });

      markerCache.pushObject(gMarker);
    }, this);
  })
});