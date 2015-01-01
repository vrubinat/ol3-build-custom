var layers = [new ol.layer.Tile({
    visible: true,
    preload: Infinity,
    source: new ol.source.BingMaps({
      key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',
      imagerySet: 'Road'
    })
  })];



var map = new ol.Map({
  controls: [new ol.control.Zoom()],
  layers: layers,
  target: 'map',
  view: new ol.View({
    center: [-6655.5402445057125, 6709968.258934638],
    zoom: 13
  })
});
