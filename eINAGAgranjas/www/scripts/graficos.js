function Graficos() {
    /*
    * Función que es llamada cuando finaliza el renderizado de la coordenada
    * acto seguido, con la coordenada almacenada, se llama automáticamente a la función que realiza el análisis
    */

    var addGraphic = function (geom, sym) {
        var template, g, s, attrs;
        attrs = { "type": "Geodesic" };
        poligonoConsulta = geom;
        template = new esri.InfoTemplate("", "Type: ${type}");
        g = map.getLayer("Geodesic");
        g.add(
            new esri.Graphic(geom, sym, attrs, template)
        );
        if (g.graphics.length > 0) {
            map.setExtent(esri.graphicsExtent([g.graphics[g.graphics.length - 1]]).expand(0.9), true);
        }
    };


    // addpoint

    this.addPoint4326 = function (geometry) {
        var attrs, sym;
        attrs = { "type": "Geodesic" };
        symbol = new esri.symbol.SimpleMarkerSymbol("square", 10, new esri.symbol.SimpleLineSymbol("solid", new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
        var graphic = new esri.Graphic(geometry, symbol);
        map.graphics.add(graphic);
        map.centerAndZoom(graphic.geometry, 18);
    };

    this.addCircle = function (point, distancia, color) {
        var circleGeometry = new esri.geometry.Circle({
            center: point,
            radius: distancia,
            geodesic: true
        });
        var sym = new esri.symbol.SimpleFillSymbol();
        sym.setColor(null);
        sym.setOutline(new esri.symbol.SimpleLineSymbol("solid", color, 2));
        addGraphic(circleGeometry, sym);
    };

    this.clearGraphics = function(){
        map.graphics.clear();
        g = map.getLayer("Geodesic");
        g.clear();
    };
}