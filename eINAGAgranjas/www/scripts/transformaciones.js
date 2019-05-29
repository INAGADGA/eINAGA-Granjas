function Transformaciones() {

    var _herramientas = new Herramientas();
    var _graficos = new Graficos();
    var gsvc = new esri.tasks.GeometryService("https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer");
    /*
    * Función para transformar una cordenada a ETRS89
    */
    this.dameCoordEtrs89 = function (geom, abrirPanel) {
        _graficos.clearGraphics();
        var outSR = new esri.SpatialReference(25830);
        var params = new esri.tasks.ProjectParameters();
        params.geometries = [geom];
        params.outSR = outSR;
        gsvc.project(params, function (rtdos) {
            geometryProyectada = rtdos[0];            
            console.log(geometryProyectada);
            _herramientas.actualizaCoordTextBox(geom, geometryProyectada, abrirPanel);
            return geometryProyectada;
        });
        _graficos.addPoint4326(geom);
        tb.deactivate();
        //$("#myPanel").panel("open");
    };

    /*
    * Función para transformar una cordenada a geográficas
    */
    this.dameCoord4326 = function (geom, abrirPanel) {
        _graficos.clearGraphics();
        var outSR = new esri.SpatialReference(4326);
        var params = new esri.tasks.ProjectParameters();
        params.geometries = [geom]; //[pt.normalize()];
        params.outSR = outSR;
        var newurl = "";
        gsvc.project(params, function (rtdos) {
            _graficos.addPoint4326(rtdos[0]);
            tb.deactivate();
            _herramientas.actualizaCoordTextBox(rtdos[0], geom, abrirPanel);
            //if (abrirPanel) { $("#myPanel").panel("open"); }
        });
    };


    /*
    * Reproyecta la geometría arguments[0] y obtiene el punto en formato geojson para incluirlo al informe
    * 
    */
    this.dameGeomEtrs89 = function (geom, actualizaCoordEtrs) {
        var outSR = new esri.SpatialReference(25830);
        var params = new esri.tasks.ProjectParameters();
        var geomGoogle = geom; //arguments[0];
        params.geometries = [geomGoogle];
        params.outSR = outSR;
        var geometry;
        var newurl = "";
        gsvc.project(params, function (rtdos) {
            geometry = rtdos[0];
            var feature = L.esri.Util.arcgisToGeoJSON(geometry, "FID");
            stringGeoJson = JSON.stringify(feature);
            tb.deactivate();
            map.setInfoWindowOnClick(true);
            if (actualizaCoordEtrs) {
                coordx = geometry.x.toFixed(0);
                coordy = geometry.y.toFixed(0);
                $("#etrs").html("<hr /><b>Coordenada ETRS89 30N<br><table style='width:100%'><tr><th>X</th><th>Y</th></tr><tr><td>" + geometry.x.toFixed(0) + "</td><td>" + geometry.y.toFixed(0) + "</td></tr></table><hr />");
            }
        });
    };

    /*
    * Transforma las coordenadas al sistema de referencia 25830
    * Cuando retorna las coordenadas se actualizan los enlaces a otros visores, para que cuando realicen click sobre ellos se inicialicen con la misma extensión
    */
    this.dameCoord25830 = function () {
        var outSR = new esri.SpatialReference(25830);
        var params = new esri.tasks.ProjectParameters();
        params.geometries = [map.extent]; //[pt.normalize()];
        params.outSR = outSR;
        var pt;
        var newurl = "";
        gsvc.project(params, function (projectedPoints) {
            pt = projectedPoints[0];
            $("#sitar").attr("href","https://idearagondes.aragon.local:4063/visor/index.html?BOX=" + pt.xmin.toFixed(0) + ":" + pt.ymin.toFixed(0) + ":" + pt.xmax.toFixed(0) + ":" + pt.ymax.toFixed(0));
            $("#enlaceCapturaCoordenadas").attr("href", "https://www.aragon.es/estaticos/GobiernoAragon/Organismos/InstitutoAragonesGestionAmbiental/StaticFiles/cartografia/INAGAGEO.html?zoomEnvelope=" + pt.xmin.toFixed(0) + ":" + pt.ymin.toFixed(0) + ":" + pt.xmax.toFixed(0) + ":" + pt.ymax.toFixed(0));
            $("#enlaceParticipacion_Publica").attr("href", "https://www.aragon.es/estaticos/GobiernoAragon/Organismos/InstitutoAragonesGestionAmbiental/StaticFiles/cartografia/INAGA_Participacion_Publica.html?zoomEnvelope=" + pt.xmin.toFixed(0) + ":" + pt.ymin.toFixed(0) + ":" + pt.xmax.toFixed(0) + ":" + pt.ymax.toFixed(0));
            $("#enlaceResolucionesPublicas").attr("href","https://www.aragon.es/estaticos/GobiernoAragon/Organismos/InstitutoAragonesGestionAmbiental/StaticFiles/cartografia/INAGA_Resolucion_Publica.html?zoomEnvelope=" + pt.xmin.toFixed(0) + ":" + pt.ymin.toFixed(0) + ":" + pt.xmax.toFixed(0) + ":" + pt.ymax.toFixed(0));
        });
    };

    this.actualizaCoordsCatastro = function (geom, layerx, layery){
        _graficos.clearGraphics();
        var outSR = new esri.SpatialReference(25830);
        var params = new esri.tasks.ProjectParameters();
        params.geometries = [geom]; //[pt.normalize()];
        params.outSR = outSR;
        var newurl = "";
        gsvc.project(params, function (rtdos) {
            pt = rtdos[0];
            var urlCat = "http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?&REQUEST=GetFeatureInfo&VERSION=1.1.1&SRS=EPSG%3A25830&BBOX=" + pt.x + "," + pt.y + "," + (pt.x + 1) + "," + (pt.y + 1) + "&WIDTH=" + map.width + "&HEIGHT=" + map.height + "&X=" + layerx + "&Y=" + layery ;
            popup.setContent('<iframe style="float:left; height:30em; width:100%" src=' + urlCat + ' frameborder="0" scrolling="yes"></iframe>');
            popup.setTitle("Información catastral");
            // dibujar y zoom a coordenada
            _graficos.addPoint4326(geom);
            // abrir ventana datos
            $(".esriMobileInfoView").css("display", "inline-block");
            $(".esriMobileNavigationBar").css("display", "inline-block");
        });
    }
}