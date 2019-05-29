var map, tb, coordx, coordy;

var prefijo;
var Granjas;
var textoDescarga = "";
var poligonoConsulta;
var coordConsulta;
var consultaDistancias = "";
var stringGeoJson;
var distancia;
var gsvc;
var rutaServidor;
var customExtentAndSR;
var popup;

$(document).ready(function () {
    initializeEsriJS();
});

function initializeEsriJS() {
    require([
        "dojo/dom",
        "dojo/dom-style",
        "dojo/dom-construct",
        "dojo/_base/array",
        "dojo/parser",
        "dojo/query",
        "dojo/on",
        "esri/Color",
        "esri/config",
        "esri/map",
        "esri/graphic",
        "esri/toolbars/draw",
        "esri/dijit/PopupMobile",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/dijit/OverviewMap",
        "esri/dijit/BasemapGallery",
        "esri/dijit/Basemap",
        "esri/dijit/BasemapLayer",
        "esri/dijit/Scalebar",
        "esri/dijit/Search",
        "esri/dijit/HomeButton",
        "esri/dijit/LocateButton",
        "esri/dijit/Measurement",
        "esri/dijit/Legend",
        "esri/geometry/Circle",
        "esri/geometry/normalizeUtils",
        "esri/tasks/BufferParameters",
        "esri/tasks/query",
        "esri/layers/FeatureLayer",
        "esri/layers/WMSLayer",
        "esri/layers/WMSLayerInfo"

    ], function (dom, domStyle, domConstruct, array, parser, query, on
        , Color, esriConfig, Map, Graphic, Draw
        , PopupMobile, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
        OverviewMap, BasemapGallery, Basemap, BasemapLayer, Scalebar, Search, HomeButton, LocateButton, Measurement, Legend, Circle, normalizeUtils, BufferParameters
        ,Query, FeatureLayer, WMSLayer, WMSLayerInfo
    ) {

            //necesario para convertir nodos especialmente decorados en el DOM y convertirlos en Dijits , Widgets u otros Objetos
            parser.parse();

            // comprobamos el tipo de plataforma, por si queremos almacenar los resultados en distintas carpetas locales
            if (cordova.platformId === 'ios') {
                directorioAlmacenamiento = "Download"; //"documents"; //cordova.file.documentsDirectory; // ;                   
            }
            else {
                directorioAlmacenamiento = "Download";
            }

            // iniciallizamos variables necesarias ------------------------------------------------------------------------------------------------------------------------------------------------
            popup = new esri.dijit.PopupMobile(null, dojo.create("div"));
            var _geoposicion = new Geoposicion();
            var _capas = new Capas();
            var _graficos = new Graficos();
            var _queries = new Queries();
            var _herramientas = new Herramientas();
            var _transformaciones = new Transformaciones();

            var _widgets = new Widgets();

            //rutaServidor = "https://idearagondes.aragon.local:4063/arcgis/rest/services/INAGA";
            rutaServidor = "https://idearagon.aragon.es/servicios/rest/services/INAGA";
            customExtentAndSR = new esri.geometry.Extent(-300000, 4840000, 120000, 5280000, new esri.SpatialReference({ wkid: 3857 })); //= new esri.geometry.Extent(550000,4400000,825000,4770000, new esri.SpatialReference({wkid:25830}));
            var tituloVisor = "<center><b><font color='white'>Explotaciones Ganaderas</font></b></center>";
            $("#tituloVisor").html(tituloVisor);

            // incicializar mapa ---------------------------------------------------------------------------------------------------------
            map = new Map("map", {
                basemap: "satellite",
                infoWindow: popup,
                extent: customExtentAndSR
            });
            map.disableKeyboardNavigation();


            // añade los mapas base al mapa
            var _mapasBse = new Mapasbase('basemapGallery');
            //cargaMapasBase('basemapGallery');

            // widgets ------------------------------------------------------------------------------------------------------------------
            _widgets.cargaWidgets();

            // Capas necesarias -------------------------------------------------------------------------------------------------------------------------------------------------------------------
            _capas.addCapas2Visor();

            //Eventos -------------------------------------------------------------------------------------------------------------------------------------------------------------------
            popup.on("selection-change", function () {
                graphico = popup.getSelectedFeature();
            });
            popup.on("hide", function () {
                $(".esriMobileInfoView").css("display", "none");
            });

            $("#posicion").click(function () {
                _geoposicion.getPosition();
            });

            tb = new esri.toolbars.Draw(map);

            // cuando dibuje la coordenada, lanzar el análisis
            tb.on("draw-end", function () {
                coordConsulta = arguments[0].geometry;
                _queries.dameInf();
            });

            query(".tool").on("click", function (evt) {
                _widgets.reseteaMedicion();
                _graficos.clearGraphics();
                var distancia = $("#distAnalisis").val();
                var analisisDist = $('#checkAnalisis').is(":checked");
                var analisisSaldo = $('#checkSaldo').is(":checked");
                if (analisisDist || analisisSaldo) {
                    $("#myPanel").panel("close");
                    if (analisisDist) {
                        if (distancia <= 0 || distancia > 5100) {
                            tb.deactivate();
                            dom.byId("popupMsg").innerHTML = "La distancia debe estar comprendida entre 1 y 3.000 metros";
                            $("#popupMsg").popup('open');
                        }
                    }
                    if (map.getScale() < 250000) {
                        if (tb) {
                            tb.activate(evt.target.id); //target.id);
                            map.setInfoWindowOnClick(false);
                        }
                    }
                    else {
                        tb.deactivate();
                        dom.byId("popupMsg").innerHTML = "Debe acercarse hasta una escala menor de 250.000 para digitalizar";
                        $("#popupMsg").popup('open');
                    }
                }
                else {

                    dom.byId("popupMsg").innerHTML = "Debe seleccionar al menos uno de los análisis";
                    $("#popupMsg").popup('open');
                }
            });

            //add the legend
            map.on("layers-add-result", function (evt) {
                var layerInfo = array.map(evt.layers, function (layer, index) {
                    return { layer: layer.layer, title: layer.layer.name };
                });
                if (layerInfo.length > 0) {
                    var legendDijit = new Legend({
                        map: map,
                        layerInfos: layerInfo
                    }, "legendDiv");
                    legendDijit.startup();
                }
            });
            map.on("click", function (evt) {
                if (dom.byId("myonoffswitch").checked) {
                    map.setInfoWindowOnClick(false);
                    _transformaciones.actualizaCoordsCatastro(evt.mapPoint, evt.layerX, evt.layerY); // layerx, layery);                    
                }
                else {
                    map.infoWindow.resize(300, 300);
                }
                coordx = evt.mapPoint.x.toFixed(2).replace('.', ',');
                coordy = evt.mapPoint.y.toFixed(2).replace('.', ',');
            });


            map.on("update-end", function () {
                map.setMapCursor("default");
                domStyle.set(dom.byId("procesando"), "display", "none");
                _transformaciones.dameCoord25830();
                $("#escala").text("Escala 1:" + Number(map.getScale().toFixed(0)).toLocaleString('es'));
            });
            map.on("update-start", function () {
                map.setMapCursor("wait");
                domStyle.set(dom.byId("procesando"), "display", "inline-block");
                $("#popupNested").popup("close");
            });
            map.on("zoom-end", function () {
                $("#escala").text("Escala 1:" + Number(map.getScale().toFixed(0)).toLocaleString('es'));
            });



            $("#clearGraphicsM").click(function () {
                if (map) {
                    _widgets.reseteaMedicion();
                }
            });

            $("#exportarPDF").click(function () {
                generaTextoDescarga("INF_" + _herramientas.dameFechaHora() + '.pdf');
            });

            $("#localizaCoord").click(function () {
                var _point = new esri.geometry.Point(Number(dom.byId("CoordX").value.replace(',', '.')), Number(dom.byId("CoordY").value.replace(',', '.')), new esri.SpatialReference({ wkid: 25830 }));
                _transformaciones.dameCoord4326(_point, true);
            });

            $("#convierteCoord").click(function () {
                var _point = new esri.geometry.Point(Number(dom.byId("Longitud").value.replace(',', '.')), Number(dom.byId("Latitud").value.replace(',', '.')), new esri.SpatialReference({ wkid: 4326 }));
                _transformaciones.dameCoordEtrs89(_point, true);
            });

            // cambia visibilidad de las capas ------------------------------------------------------------------
            $("#checkCatastro").click(function () {
                var targetLayer = map.getLayer("OVC");
                if (targetLayer.visible) {
                    targetLayer.setVisibility(false);
                }
                else { targetLayer.setVisibility(true); }
            });

            $("#checkRaster").click(function () {
                var targetLayer = map.getLayer("IGN");
                if (targetLayer.visible) {
                    targetLayer.setVisibility(false);
                }
                else { targetLayer.setVisibility(true); }
            });


            $("#checkGr_Prod").click(function () {
                _capas.cambiaVisibilidadGranjas("checkGr_Prod", 0);
                //var id = 0;
                //if ($('#checkGr_Prod').is(":checked")) { visibleGranjas.push(id); }
                //else { _herramientas.quitaValoresVisibilidad("Granjas", id); }
                //dynamicMSLayerGranjas.setVisibleLayers(visibleGranjas);
            });
            $("#checkGr_TInaga").click(function () {
                _capas.cambiaVisibilidadGranjas("checkGr_TInaga", 1);
                //var id = 1;
                //if ($('#checkGr_TInaga').is(":checked")) { visibleGranjas.push(id); }
                //else { _herramientas.quitaValoresVisibilidad("Granjas", id); }
                //dynamicMSLayerGranjas.setVisibleLayers(visibleGranjas);
            });
            $("#checkGr_RInaga").click(function () {
                _capas. cambiaVisibilidadGranjas("checkGr_RInaga", 2);
                //var id = 2;
                //if ($('#checkGr_RInaga').is(":checked")) { visibleGranjas.push(id); }
                //else { _herramientas.quitaValoresVisibilidad("Granjas", id); }
                //dynamicMSLayerGranjas.setVisibleLayers(visibleGranjas);
            });
            $("#checkGr_racan").click(function () {
                _capas.cambiaVisibilidadGranjas("checkGr_racan", 3);
                //var id = 3;
                //if ($('#checkGr_racan').is(":checked")) { visibleGranjas.push(id); }
                //else { _herramientas.quitaValoresVisibilidad("Granjas", id); }
                //dynamicMSLayerGranjas.setVisibleLayers(visibleGranjas);
            });
            $("#checkGr_zonvul").click(function () {
                _capas.cambiaVisibilidadGranjas("checkGr_zonvul", 4);
                //var id = 4;
                //if ($('#checkGr_zonvul').is(":checked")) { visibleGranjas.push(id); }
                //else { _herramientas.quitaValoresVisibilidad("Granjas", id); }
                //dynamicMSLayerGranjas.setVisibleLayers(visibleGranjas);
            });
            $("#checkGr_munlim").click(function () {
                _capas.cambiaVisibilidadGranjas("checkGr_munlim", 6);
                //var id = 6;
                //if ($('#checkGr_munlim').is(":checked")) { visibleGranjas.push(id); }
                //else { _herramientas.quitaValoresVisibilidad("Granjas", id); }
                //dynamicMSLayerGranjas.setVisibleLayers(visibleGranjas);
            });
            $("#checkGr_nucleos").click(function () {
                if ($('#checkGr_nucleos').is(":checked")) { dynamicMSLayerLimites.setVisibleLayers([0, 4]); }
                else { dynamicMSLayerLimites.setVisibleLayers([0]); }
            });
            $("#checkboxhmd").click(function () {
                _capas.cambiaVisibilidadFiguras("checkboxhmd", 0);
                //if ($('#checkboxhmd').is(":checked")) { visibleFiguras.push("0"); }
                //else { _herramientas.quitaValoresVisibilidad("Figuras", "0"); }
                //dynamicMSLayerFPA.setVisibleLayers(visibleFiguras);
            });
            $("#checkboxlics").click(function () {
                _capas.cambiaVisibilidadFiguras("checkboxhmd", 1);
                //if ($('#checkboxlics').is(":checked")) { visibleFiguras.push("1"); }
                //else { _herramientas.quitaValoresVisibilidad("Figuras", "1"); }
                //dynamicMSLayerFPA.setVisibleLayers(visibleFiguras);
            });
            $("#checkboxzepas").click(function () {
                _capas.cambiaVisibilidadFiguras("checkboxzepas", 2);
                //if ($('#checkboxzepas').is(":checked")) { visibleFiguras.push("2"); }
                //else { _herramientas.quitaValoresVisibilidad("Figuras", "2"); }
                //dynamicMSLayerFPA.setVisibleLayers(visibleFiguras);
            });

            $("#checkboxenp").click(function () {
                _capas.cambiaVisibilidadFiguras("checkboxenp", 4);
                //if ($('#checkboxenp').is(":checked")) { visibleFiguras.push("4"); }
                //else { _herramientas.quitaValoresVisibilidad("Figuras", "4"); }
                //dynamicMSLayerFPA.setVisibleLayers(visibleFiguras);
            });
            $("#checkboxporn").click(function () {
                _capas.cambiaVisibilidadFiguras("checkboxporn", 5);
                //if ($('#checkboxporn').is(":checked")) { visibleFiguras.push("5"); }
                //else { _herramientas.quitaValoresVisibilidad("Figuras", "5"); }
                //dynamicMSLayerFPA.setVisibleLayers(visibleFiguras);
            });
            $("#checkboxacrit").click(function () {
                _capas.cambiaVisibilidadFiguras("checkboxacrit", 6);
                //if ($('#checkboxacrit').is(":checked")) { visibleFiguras.push("6"); }
                //else { _herramientas.quitaValoresVisibilidad("Figuras", "6"); }
                //dynamicMSLayerFPA.setVisibleLayers(visibleFiguras);
            });
            $("#checkboxappe").click(function () {
                _capas.cambiaVisibilidadFiguras("checkboxappe", 7);
                //if ($('#checkboxappe').is(":checked")) { visibleFiguras.push("7"); }
                //else { _herramientas.quitaValoresVisibilidad("Figuras", "7"); }
                //dynamicMSLayerFPA.setVisibleLayers(visibleFiguras);
            });



        });
}