﻿var rutaServidor = "https://idearagon.aragon.es/servicios/rest/services/INAGA";
function Capas() {
    Capas.visibleFiguras = [];
    Capas.visibleGranjas = [0, 1, 2, 4, 5];

    // variables staticas
    Capas.fcGranjasProduccion = new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Explotaciones_G/MapServer/0");
    Capas.fcGranjasInagaTram = new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Explotaciones_G/MapServer/1");
    Capas.fcGranjasInagaReso = new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Explotaciones_G/MapServer/2");
    Capas.fcRacan = new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Explotaciones_G/MapServer/3");
    Capas.fcRecintos = new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Explotaciones_G/MapServer/5");
    Capas.fcNucleos = new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Ambitos/MapServer/4");
    Capas.fcZonVul = new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Explotaciones_G/MapServer/4");
    Capas.fcMunisLimitacion = new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Explotaciones_G/MapServer/6");
    Capas.layerCat = null;
    Capas.layerWMTS = null;
    /*
     * Función para añadir las capas necesarias a la visualización
     * Dependencias: tiene que estar incializado el mapa
     */
    this.addCapas2Visor = function () {

        var infoTemplate = new esri.InfoTemplate("");
        infoTemplate.setTitle("<b>Recintos Aptos Fertilización");
        infoTemplate.setContent(getTextAtributos);
        function getTextAtributos(graphic) {
            var urlvisor = graphic.attributes.URL_VISOR;
            var texto = "</br><b> REFREC: </b> " + graphic.attributes.REFREC +
                "</br><b> C_MUNI_INE: </b> " + graphic.attributes.C_MUNI_INE +
                "</br><b> D_MUNI_INE: </b> " + graphic.attributes.D_MUNI_INE +
                "</br><b> PROVINCIA: </b> " + graphic.attributes.PROVINCIA +
                "</br><b> SUPERFICIE: </b> " + graphic.attributes.SUPERFICIE.toFixed(2) +
                "</br><b> DOSIS MAX_KG_HA: </b> " + graphic.attributes.KG_N_HA.toFixed(2) +
                "</br><b> CAPACIDAD_N_KG: </b> " + graphic.attributes.KG_N_TOTAL.toFixed(2) +
                "</br><b> IMPACTO_N_KG: </b> " + graphic.attributes.KG_N_SOPORTADO.toFixed(2) +
                "</br><b> SALDO_N_KG: </b> " + graphic.attributes.SALDO.toFixed(2);
            return texto;
        }


        dynamicMSLayerGranjas = new esri.layers.ArcGISDynamicMapServiceLayer(rutaServidor + "/INAGA_Explotaciones_G/MapServer", {
            id: "Granjas",
            outFields: ["*"]
        });
        dynamicMSLayerGranjas.setVisibility(true);
        dynamicMSLayerGranjas.setInfoTemplates({
            //0: { infoTemplate: new esri.InfoTemplate("Explotaciones REGA (NO Producción)", "${*}") },
            0: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Explotaciones REGA </br>(Producción)", "<b>Codigo:</b> ${CODIGO}<br><b>Explotacion:</b> ${EXPLOTACION}<br><b>Especie:</b> ${ESPECIE}<br><b>Familia:</b> ${FAMILIA}<br><b>TIPO:</b> ${TIPO}<br><b>CAPACIDAD:</b> ${CAPACIDAD}<br><b>ESTADO:</b> ${ESTADO}")) },
            1: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Explotaciones </br>en tramitación en INAGA", "<b>Codigo:</b> ${CODIGO}<br><b>Explotacion:</b> ${EXPLOTACION}<br><b>Especie:</b> ${ESPECIE}<br><b>Familia:</b> ${FAMILIA}<br><b>TIPO:</b> ${TIPO}<br><b>CAPACIDAD:</b> ${CAPACIDAD}")) },
            2: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Explotaciones </br>autorizadas sin construir", "<b>Codigo:</b> ${CODIGO}<br><b>Explotacion:</b> ${EXPLOTACION}<br><b>Especie:</b> ${ESPECIE}<br><b>Familia:</b> ${FAMILIA}<br><b>TIPO:</b> ${TIPO}<br><b>CAPACIDAD:</b> ${CAPACIDAD}")) },
            3: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Comederos Aves Necrófagas", "<b>MULADAR:</b> ${MULADAR}")) },
            4: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Zonas Vulnerables", "<b>COD_ZV:</b> ${COD_ZV}<br><b>NOM_ZV:</b> ${NOM_ZV}<br><b>F_DESIGN:</b> ${F_DESIGN}<br><b>SUP_DECL:</b> ${SUP_DECL}<br><b>SUP_KM2:</b> ${SUP_KM2}")) },
            5: { infoTemplate: infoTemplate }
        });
        dynamicMSLayerGranjas.setImageFormat("png32", true);
        dynamicMSLayerGranjas.setVisibleLayers(Capas.visibleGranjas);

        dynamicMSLayerMontes = new esri.layers.ArcGISDynamicMapServiceLayer(rutaServidor + "/INAGA_CMA/MapServer", {
            id: "Montes",
            outFields: ["*"]
        });
        dynamicMSLayerMontes.setVisibility(false);
        dynamicMSLayerMontes.setInfoTemplates({
            4: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Montes", "<b>Matricula: </b>${MATRICULA}<br><b>Nombre: </b>${NOMBRE}<br><b>Titular: </b>${TITULAR}<br><b>Tipo: </b>${DTIPO}")) },
            5: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Montes Gen", "<b>Matricula: <b/>${MATRICULA}<br><b>Nombre: </b>${DENOMINACION}<br><b>Titular: </b>${TITULAR}<br><b>Tipo: </b>${TIPO}")) }
        });
        dynamicMSLayerMontes.setImageFormat("png32", true);
        dynamicMSLayerCotos = new esri.layers.ArcGISDynamicMapServiceLayer(rutaServidor + "/INAGA_Cotos_Caza/MapServer", {
            id: "Cotos",
            outFields: ["*"]
        });
        dynamicMSLayerCotos.setVisibility(false);
        dynamicMSLayerCotos.setInfoTemplates({
            1: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Terrenos Cinegéticos", "<b>Matricula: </b>${MATRICULA}<br><b>Nombre: </b>${NOMBRE}<br><b>Titular: </b>${TITULAR}<br><b>Tipo: <b>${DTIPO}")) },
            2: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Terrenos Cinegéticos", "<b>Matricula: </b>${MATRICULA}<br><b>Nombre: </b>${NOMBRE}<br><b>Titular: </b>${TITULAR}<br><b>Tipo: <b>${DTIPO}")) }
        });
        dynamicMSLayerCotos.setImageFormat("png32", true);

        dynamicMSLayerLimites = new esri.layers.ArcGISDynamicMapServiceLayer(rutaServidor + "/INAGA_Ambitos/MapServer", {
            id: "Limites",
            outFields: ["*"]
        });
        dynamicMSLayerLimites.setImageFormat("png32", true);
        dynamicMSLayerLimites.setVisibleLayers([0]);

        dynamicMSLayerFPA = new esri.layers.ArcGISDynamicMapServiceLayer(rutaServidor + "/INAGA_FPA/MapServer", {
            id: "Figuras",
            outFields: ["*"]
        });

        dynamicMSLayerFPA.setInfoTemplates({
            0: { infoTemplate: new esri.InfoTemplate(getInfotemplate("HUMEDALES", "<b>CODIGO: </b>${CODIGO}<br><b>Nombre: </b>${DESCRIPCIO}")) },
            1: { infoTemplate: new esri.InfoTemplate(getInfotemplate("LICS", "<b>CODIGO: </b>${CODIGO}<br><b>Nombre: </b>${DESCRIPCIO}")) },
            2: { infoTemplate: new esri.InfoTemplate(getInfotemplate("ZEPAS", "<b>CODIGO: </b>${CODIGO}<br><b>Nombre: </b>${DESCRIPCIO}")) },
            3: { infoTemplate: new esri.InfoTemplate(getInfotemplate("LIG", "<b>CODIGO: </b>${CODIGO}<br><b>Nombre: </b>${DESCRIPCIO}")) },
            4: { infoTemplate: new esri.InfoTemplate(getInfotemplate("ENP", "<b>CODIGO: </b>${CODIGO}<br><b>Nombre: </b>${DESCRIPCIO}")) },
            5: { infoTemplate: new esri.InfoTemplate(getInfotemplate("PORN", "<b>CODIGO: </b>${CODIGO}<br><b>Nombre: </b>${DESCRIPCIO}")) },
            6: { infoTemplate: new esri.InfoTemplate(getInfotemplate("AREAS CRITICAS", "<b>CODIGO: </b>${CODZONA}<br><b>Nombre: </b>${DZONA}")) },
            7: { infoTemplate: new esri.InfoTemplate(getInfotemplate("APPE", "<b>CODIGO: </b>${CODIGO}<br><b>Nombre: </b>${DESCRIPCIO}")) }
        });
        dynamicMSLayerFPA.setVisibleLayers([]);
        dynamicMSLayerFPA.setImageFormat("png32", true);
        var layer1 = new esri.layers.WMSLayerInfo({
            name: 'Catastro',
            title: 'Catastro'
        });

        Capas.layerCat = new esri.layers.WMSLayer('https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?', {
            resourceInfo: {
                extent: customExtentAndSR,
                layerInfos: [layer1]
            },
            visibleLayers: ['catastro']

        });
        Capas.layerCat.visible = true;
        Capas.layerCat.id = "OVC";
        Capas.layerCat.version = "1.1.1";
        Capas.layerCat.spatialReferences[0] = 3857; //new esri.SpatialReference(3857);


        var layerSigpacPar = new esri.layers.WMSLayerInfo({
            name: 'PARCELA',
            title: 'PARCELA'
        });
        var layerSigpacRec = new esri.layers.WMSLayerInfo({
            name: 'RECINTO',
            title: 'RECINTO'
        });

        var wmsSigpac = new esri.layers.WMSLayer('https://wms.magrama.es/wms/wms.aspx?', {
            resourceInfo: {
                extent: customExtentAndSR,
                layerInfos: [layerSigpacPar, layerSigpacRec]
            },
            visibleLayers: ['PARCELA', 'RECINTO']

        });
        wmsSigpac.visible = false;
        wmsSigpac.id = "SIGPAC";
        wmsSigpac.version = "1.1.1";
        wmsSigpac.spatialReferences[0] = 3857;


        var layerIGN = new esri.layers.WMSLayerInfo({
            name: 'mtn_rasterizado',
            title: 'mtn_rasterizado'
        });

        wmsLayeriGN = new esri.layers.WMSLayer('https://www.ign.es/wms-inspire/mapa-raster?', {
            resourceInfo: {
                extent: customExtentAndSR,
                layerInfos: [layerIGN]
            },
            visibleLayers: ['mtn_rasterizado']

        });
        wmsLayeriGN.visible = false;
        wmsLayeriGN.id = "IGN";
        wmsLayeriGN.version = "1.1.1";
        //wmsLayeriGN.spatialReferences[0] = 3857;

        var capaVinilo = new esri.layers.GraphicsLayer({ "id": "Geodesic" });


        var tileInfo = new esri.layers.TileInfo({
            "dpi": 96,
            //"format": "format/png",
            "compressionQuality": 0,
            "spatialReference": new esri.SpatialReference({
                "wkid": 102100
            }),
            "cols": 256,
            "rows": 256,
            "origin": {
                "x": -20037508.34,
                "y": 20037508
            },
            "lods": [{
                "level": "0",
                "scale": 591658710.8267717,
                "resolution": 156543.03390625003
            }, {
                "level": "1",
                "scale": 295829355.41338587,
                "resolution": 78271.51695312501
            }, {
                "level": "2",
                "scale": 147914677.70669293,
                "resolution": 39135.75847656251
            }, {
                "level": "3",
                "scale": 73957338.85334627,
                "resolution": 19567.879238281203
            }, {
                "level": "4",
                "scale": 36978669.42667321,
                "resolution": 9783.93961914062
            }, {
                "level": "5",
                "scale": 18489334.713336606,
                "resolution": 4891.96980957031
            }, {
                "level": "6",
                "scale": 9244667.356668284,
                "resolution": 2445.9849047851503
            }, {
                "level": "7",
                "scale": 4622333.6783341225,
                "resolution": 1222.99245239257
            }, {
                "level": "8",
                "scale": 2311166.8391670766,
                "resolution": 611.496226196289
            }, {
                "level": "9",
                "scale": 1155583.4195835365,
                "resolution": 305.7481130981441
            }, {
                "level": "10",
                "scale": 577791.7097917682,
                "resolution": 152.87405654907204
            }, {
                "level": "11",
                "scale": 288895.8548958845,
                "resolution": 76.43702827453612
            }, {
                "level": "12",
                "scale": 144447.92744794206,
                "resolution": 38.21851413726801
            }, {
                "level": "13",
                "scale": 72223.96372397103,
                "resolution": 19.109257068634005
            }, {
                "level": "14",
                "scale": 36111.98186198555,
                "resolution": 9.55462853431701
            }, {
                "level": "15",
                "scale": 18055.990930992757,
                "resolution": 4.777314267158501
            }, {
                "level": "16",
                "scale": 9027.995465496379,
                "resolution": 2.3886571335792506
            }, {
                "level": "17",
                "scale": 4513.99773274817,
                "resolution": 1.1943285667896202
            }, {
                "level": "18",
                "scale": 2256.998866374085,
                "resolution": 0.5971642833948101
            }, {
                "level": "19",
                "scale": 1128.4994331870425,
                "resolution": 0.29858214169740505
            }, {
                "level": "20",
                "scale": 564.2497165935213,
                "resolution": 0.14929107084870252
            }]
        });
        var tileExtent = new esri.geometry.Extent(-20037508.34, -20037508.680000007, 20037508.340000007, 20037508, new esri.SpatialReference({
            wkid: 102100
        }));
        var layerInfo = new esri.layers.WMTSLayerInfo({
            tileInfo: tileInfo,
            fullExtent: tileExtent,
            initialExtent: tileExtent,
            identifier: "IGNBaseTodo",
            tileMatrixSet: "GoogleMapsCompatible",
            format: "jpeg",
            style: "default"
        });

        var resourceInfo = {
            version: "1.0.0",
            layerInfos: [layerInfo],
            copyright: "earthdata"
        };

        var options = {
            serviceMode: "KVP",
            resourceInfo: resourceInfo,
            layerInfo: layerInfo
        };

        Capas.layerWMTS = new esri.layers.WMTSLayer("http://www.ign.es/wmts/ign-base", options);
        Capas.layerWMTS.visible = true;
        Capas.layerWMTS.id = "wmts";
        Capas.layerWMTS.opacity = 0.7;
        // añade las capas al mapa
        map.addLayers([wmsLayeriGN, dynamicMSLayerMontes, dynamicMSLayerCotos, dynamicMSLayerFPA, dynamicMSLayerLimites, dynamicMSLayerGranjas, wmsSigpac, Capas.layerCat, capaVinilo]);

    };

    this.cambiaVisibilidadIGNBase = function (visible) {
        //$('#checkCatastro').prop("checked", visible).checkboxradio('refresh');
        Capas.layerWMTS.visible = visible;
        Capas.layerWMTS.opacity = 0;
        map.setExtent(map.extent);
    };

    this.cambiaVisibilidadOVC = function (visible) {
        $('#checkCatastro').prop("checked", visible).checkboxradio('refresh');
        Capas.layerCat.visible = visible;
        map.setExtent(map.extent);
    };
    this.cambiaVisibilidadGranjas = function (nombre, id) {
        if ($('#' + nombre).is(":checked")) { Capas.visibleGranjas.push(id); }
        else { quitaValoresVisibilidad("Granjas", id); }
        dynamicMSLayerGranjas.setVisibleLayers(Capas.visibleGranjas);
    };

    this.cambiaVisibilidadFiguras = function (nombre, id) {
        if ($('#' + nombre).is(":checked")) { Capas.visibleFiguras.push(id); }
        else { quitaValoresVisibilidad("Figuras", id); }
        dynamicMSLayerFPA.setVisibleLayers(Capas.visibleFiguras);
    };

    // actualiza el array con las capas visibles que se encuentran dentro de un mismo servicio
    var quitaValoresVisibilidad = function (tipo, pos) {
        listadocapas = [];
        esta = false;
        if (tipo === "Figuras") {
            for (index = 0; index < Capas.visibleFiguras.length; index++) {
                if (Capas.visibleFiguras[index] !== pos) { listadocapas.push(Capas.visibleFiguras[index]); }
            }
            Capas.visibleFiguras = listadocapas;
        }
        else {
            for (index = 0; index < Capas.visibleGranjas.length; index++) {
                if (Capas.visibleGranjas[index] !== pos) { listadocapas.push(Capas.visibleGranjas[index]); }
            }
            Capas.visibleGranjas = listadocapas;
        }
    };

    var getInfotemplate = function (titulo, campos) {
        campos += '<div id="divlocalizar"> ' +
            '<input type="button" value="Acercar "  id="locate"  title="Centrar Mapa" alt="Centrar Mapa" class = "localizacion" onclick="  fTemplate(); "/></div>';
        return new esri.InfoTemplate(titulo, "<h3>" + titulo  + "</h3>"+  campos);
    };
    fTemplate = function locate() {
        if (graphico !== undefined) {
            var extension = graphico.geometry.getExtent();
            if (!extension) {
                map.centerAndZoom(popup.getSelectedFeature().geometry, 20);
            } else {
                map.setExtent(graphico.geometry.getExtent(), true);
            }
            // cerrar ventana datos
            $(".esriMobileInfoView").css("display", "none");
            $(".esriMobileNavigationBar").css("display", "none");
        }
    };
}


