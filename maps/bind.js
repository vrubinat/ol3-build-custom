

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
  controls: ol.control.defaults({
    attributionOptions: ({
      collapsible: false
    })
  }),
  view: view
});

var visible = new ol.dom.Input(document.getElementById('visible'));
visible.bindTo('checked', layer, 'visible');

var opacity = new ol.dom.Input(document.getElementById('opacity'));
opacity.bindTo('value', layer, 'opacity')
    .transform(parseFloat, String);


var rotation = new ol.dom.Input(document.getElementById('rotation'));
rotation.bindTo('value', view, 'rotation').transform(parseFloat, String);

var resolution = new ol.dom.Input(document.getElementById('resolution'));
resolution.bindTo('value', view, 'resolution').transform(parseFloat, String);