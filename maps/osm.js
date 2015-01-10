var layer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var view = new ol.View({
  center: [0, 0],
  zoom: 2
});

var map = new ol.Map({
  layers: [layer],
  target: 'map',
  view: view
});