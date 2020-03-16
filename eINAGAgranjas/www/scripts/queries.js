function Queries() {
    var _graficos = new Graficos();
    var _herramientas = new Herramientas();
    var _transformaciones = new Transformaciones();
    var _capas = new Capas();
    /*
    * Función para conocer si la localización del análisis se encuentra dentro de un municipio declarado como saturado
    * Asigna al div contenedor la información resultante
    */
    this.dameMunicipiosSaturados = function (response) {
        if (response !== undefined){
            var features = response.features;
            var saturados = "<h2 style=\"color:blue;\">Incidencias Municipios Saturados :</h2>";
            if (features.length > 0) {
                for (var i = 0; i < features.length; i++) {
                    var muni = features[i].attributes.D_MUNI_INE;
                    saturados += "<p>Municipio afectado: " + muni;
                }
            }
            else {
                saturados += "<p>La localización no pertenece a ningún municipio saturado";
            }
            $("#resultadoSaturados").html(saturados);
        }
       
    };
    


    Queries.queryCapa = function queryCapa(miCapa, geom, filtro, fn, distancia, zoom, srs) {
        if (distancia === undefined) {
            distancia = 0;
        }
        if (zoom === undefined) {
            zoom = true;
        }
        if (srs === undefined) {
            srs = 3857;
        }
        var buffer;
        //var fcConsulta = urlCapa;
        //var queryTask = new esri.tasks.QueryTask(fcConsulta);
        // comprobar si se ha pasado la geometría para realizar la consulta
        buffer = geom;
        if (geom !== null && distancia > 0) { // si se ha pasado distancia realizar buffer geodésico
            buffer = geometryEngine.geodesicBuffer(geom, parseInt(distancia), 9001);
        }

        var query = new esri.tasks.Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        // si no se ha pasado geometría realizar la búsqueda sólo con el filtro
        if (geom !== null) {
            query.geometry = buffer;
        }
        query.where = filtro;
        query.outSpatialReference = new esri.SpatialReference({ wkid: srs });
        //queryTask.execute(query,function (results) {
        //    var rtdo = results;
        //    fn(rtdo);
        //});

        miCapa.queryFeatures(query, function (results) {
            var rtdo = results;
            fn(rtdo);
        });
    };

    /*
    * Función que retorna la información en html del resultado del análisis de impacto en la coordenada seleccionada
    * Asigna al div contenedor la información resultante
    * Finalmente añade al mapa el círculo de radio de 5 km con el que se ha realizado el análisis
    */
    this.dameSaldoAcumulado = function (response) {
        var feature;
        var features = response.features;
        var saldoFin = 0;
        var kgntototal = 0;
        var kgnSoportado = 0;
        var porcent = 0;
        var supApta = 0;
        var objectid = 0;
        var contadorRec = 0;
        var ICN = 0;
        var Granjas = "<h2 style=\"color:blue;\">Análisis de Impacto Acumulado Fertilización Nitrógeno (5 Km):</h2>";
        var circleGeometry = new esri.geometry.Circle({
            center: coordConsulta,
            radius: 5000,
            geodesic: true
        });
        for (var x = 0; x < features.length; x++) {
            var contains = circleGeometry.contains(features[x].geometry.getExtent().getCenter());
            var polygon = new esri.geometry.Polygon(map.spatialreference);
            polygon = features[x].geometry;
            objectid = features[x].attributes.OBJECTID;
            polygon.addRing(circleGeometry.rings[0]);
            var isIntersecting = polygon.isSelfIntersecting(polygon);
            if (isIntersecting || contains) {
                saldoFin += features[x].attributes.SALDO;
                supApta += features[x].attributes.SUPERFICIE;
                kgntototal += features[x].attributes.KG_N_TOTAL;
                kgnSoportado += features[x].attributes.KG_N_SOPORTADO;
                contadorRec++;
            }
        }
        porcent = saldoFin / kgntototal * 100;
        var textoSaldo = "Número de recintos analizados: " + contadorRec + "</br></br>";
        if (porcent > 0) {
            textoSaldo += "<b>El terreno está saturado en " + (saldoFin / 1000).toFixed(2) + " toneladas</b></br></br>";
        }
        else {
            textoSaldo += "<b>El terreno tiene la capacidad de absorber " + -(saldoFin / 1000).toFixed(2) + " toneladas/año</b></br></br>";
        }
        Granjas += textoSaldo +
            "Índice de Saturación de Explotaciones Ganaderas por Nitrógeno en 5km (IS)" +
            "<ul><li>Capacidad Legal: <b>" + (kgntototal / 1000).toFixed(2) + "</b> toneladas/año</li>" +
            "<li>Presión Estimada: <b>" + (kgnSoportado / 1000).toFixed(2) + "</b> toneladas/año</li>" +
            "<li>Balance: <b>" + (saldoFin / 1000).toFixed(2) + "</b> toneladas/año</li>" +
            "<li></b>Índice de Saturación (IS): <b>" + porcent.toFixed(2) + " %</b></li></ul></br>" +
            "Índice de Carga de Nitrógeno en 5km (ICN)</br>" +
            "<ul><li>Superficie útil: <b>" + supApta.toFixed(2) + "</b> Has</li>" +
            "<li></b>ICN: <b>" + (kgnSoportado / supApta).toFixed(2) + "</b> KgN/Ha</li></ul>";

        consultaDistancias += Granjas;
        $("#resultadoImpacto").html(Granjas);
        $("[data-role=panel]").panel("open");
        _herramientas.visible("loadingSaturacion", 0);
    };

    /*
    * Obtiene una tabla resultante con los campos de las features devueltas en la query de la capa
    */
    var formateaResultados = function (response, texto, textoContador) {
        var Granjas = "<b>" + texto +":</b><br>";
        textoDescarga += "<table><h3>" + texto + "</h3>";
        textoDescarga += "<thead><tr>";
        if (response === undefined || response.features.length === 0) { Granjas += "No se han localizado<br>"; }
        else {
            Granjas += response.features.length + " " + textoContador +"<br>";
            obtieneCamposFeature(response);
        }
        consultaDistancias += Granjas;
        $("#listadoGranjas").html(consultaDistancias);
    };
    
    /*
    * obtieneDatosRtdo: Asigna de forma acumulativa a la variable textoDescarga cada uno de los
    * datos que se han devuelto en la consulta por distancias
    * @param {response} Array de features con los datos de las granjas
    * @return {boolean}
    */
    var obtieneCamposFeature = function (response) {
        var features = response.features;
        for (var property in response.fieldAliases) {
            if (property !== "OBJECTID") {
                textoDescarga += "<td><strong>" + property + "</strong></td>";
            }
        }
        textoDescarga += "</tr></thead>";
        for (var x = 0; x < features.length; x++) {
            getTextContent(features[x]);
        }
        textoDescarga += "</table>";
        if (features.length === 0) {
            textoDescarga += "No se han localizado";
        }
    };

    /*
     * getTextContent: asigna de forma acumulativa a la variable textoDescarga la tabla con los valores de cada feature seleccionada
     * @param {response} Array de features con los datos de las granjas
     * @return {boolean}
     */
    var getTextContent = function (graphic) {
        var attr = graphic.attributes;
        var contador = 0;
        textoDescarga += "<tr>";
        contador = 0;
        for (var property in attr) {
            if (property !== "OBJECTID") {
                if (graphic._layer.fields[contador].type === "esriFieldTypeDate") {
                    textoDescarga += "<td><strong>" + new Date(parseInt(attr[property])).toLocaleDateString() + "</strong></td>";
                }
                else {
                    textoDescarga += "<td><strong>" + attr[property] + "</strong></td>";
                }
            }
            contador++;
        }
        textoDescarga += "</tr>";
        return textoDescarga;
    };

    /*
    * Lanza el análisis con la ultima coordenada seleccionada en el mapa
    */
    this.dameInf = function () {
        _graficos.clearGraphics();
        _graficos.addPoint4326(coordConsulta);
        _transformaciones.dameGeomEtrs89(coordConsulta,false,false);
        _herramientas.visible("loadingSaturacion", 1);
        distancia = $("#distAnalisis").val();
        $("#listadoGranjas").html("");
        $("#resultadoImpacto").html("");
        $("#resultadoSaturados").html("");
        
        map.setInfoWindowOnClick(true);
        tb.deactivate();
        
        var query = new esri.tasks.Query();
        query.geometry = coordConsulta;
        query.outFields = ["*"];
        //query.where = "";
        query.distance = distancia;
        query.units = "Meters";
        Granjas = "";
        textoDescarga = "";
        consultaDistancias = "<b>Fecha: " + _herramientas.dameFechaConFormato() + "</b><hr/>";
        $("#listadoGranjas").html(consultaDistancias);
        var analisisDist = $('#checkAnalisis').is(":checked");
        var analisisSaldo = $('#checkSaldo').is(":checked");
        if (analisisDist) {
            consultaDistancias += "<h2 style=\"color:red;\">Explotaciones a menos de " + distancia + " m</h2>" + Granjas;
            Capas.fcGranjasProduccion.queryFeatures(query, function () {
                formateaResultados(arguments[0],"Explotaciones REGA (Producción)","explotaciones");
            });
            Capas.fcGranjasInagaTram.queryFeatures(query, function () {
                formateaResultados(arguments[0], "Explotaciones tramitándose en INAGA", "explotaciones");
            });
            Capas.fcGranjasInagaReso.queryFeatures(query, function () {
                formateaResultados(arguments[0], "Explotaciones autorizadas en INAGA sin construir", "explotaciones");
            });
            Capas.fcMunisLimitacion.queryFeatures(query, function () {
                formateaResultados(arguments[0], "Zonas con limitaciones naturales", "municipios");
            });
            _graficos.addCircle(coordConsulta, distancia, new dojo.Color([255, 0, 0, 1]));
        }
        if (analisisSaldo) {
            _herramientas.cursorEspera();
            // obtener el municipio saturado
            query.geometry = coordConsulta;
            query.distance = 0;
            query.units = "Meters";
            query.where = "COD_LIMITACION = 'S'";
            Capas.fcMunisLimitacion.queryFeatures(query, this.dameMunicipiosSaturados);
            // obtener el índice de saturación a 5km
            query.where = "";
            query.geometry = coordConsulta;
            query.distance = 5000;
            query.units = "Meters";
            Capas.fcRecintos.queryFeatures(query, this.dameSaldoAcumulado);
            _graficos.addCircle(coordConsulta, 5000, new dojo.Color([0, 0, 255, 1]));
        }
        else {
            _herramientas.visible("loadingSaturacion", 0);
            $("[data-role=panel]").panel("open");
        }
        

    };
}