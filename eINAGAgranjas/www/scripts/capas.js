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
            0: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Explotaciones REGA </br>(Producción)", "<h3>Granja REGA:</h3><b>Codigo:</b> ${CODIGO}<br><b>Explotacion:</b> ${EXPLOTACION}<br><b>Especie:</b> ${ESPECIE}<br><b>Familia:</b> ${FAMILIA}<br><b>TIPO:</b> ${TIPO}<br><b>CAPACIDAD:</b> ${CAPACIDAD}")) },
            1: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Explotaciones </br>en tramitación en INAGA", "<h3>Granja Tramitación:</h3><b>Codigo:</b> ${CODIGO}<br><b>Explotacion:</b> ${EXPLOTACION}<br><b>Especie:</b> ${ESPECIE}<br><b>Familia:</b> ${FAMILIA}<br><b>TIPO:</b> ${TIPO}<br><b>CAPACIDAD:</b> ${CAPACIDAD}")) },
            2: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Explotaciones </br>autorizadas sin construir", "<h3>Granja Resuelta:</h3><b>Codigo:</b> ${CODIGO}<br><b>Explotacion:</b> ${EXPLOTACION}<br><b>Especie:</b> ${ESPECIE}<br><b>Familia:</b> ${FAMILIA}<br><b>TIPO:</b> ${TIPO}<br><b>CAPACIDAD:</b> ${CAPACIDAD}")) },
            3: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Comederos Aves Necrófagas", "<h3>Comederos Aves Necrófagas:</h3><b>MULADAR:</b> ${MULADAR}")) },
            4: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Zonas Vulnerables", "<h3>Zonas Vulnerables:</h3><b>COD_ZV:</b> ${COD_ZV}<br><b>NOM_ZV:</b> ${NOM_ZV}<br><b>F_DESIGN:</b> ${F_DESIGN}<br><b>SUP_DECL:</b> ${SUP_DECL}<br><b>SUP_KM2:</b> ${SUP_KM2}")) },
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
            4: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Montes", "Matricula: ${MATRICULA}<br>Nombre: ${NOMBRE}<br>Titular: ${TITULAR}<br>Tipo: ${DTIPO}")) },
            5: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Montes Gen", "Matricula: ${MATRICULA}<br>Nombre: ${DENOMINACION}<br>Titular: ${TITULAR}<br>Tipo: ${TIPO}")) }
        });
        dynamicMSLayerMontes.setImageFormat("png32", true);
        dynamicMSLayerCotos = new esri.layers.ArcGISDynamicMapServiceLayer(rutaServidor + "/INAGA_Cotos_Caza/MapServer", {
            id: "Cotos",
            outFields: ["*"]
        });
        dynamicMSLayerCotos.setVisibility(false);
        dynamicMSLayerCotos.setInfoTemplates({
            1: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Terrenos Cinegéticos", "Matricula: ${MATRICULA}<br>Nombre: ${NOMBRE}<br>Titular: ${TITULAR}<br>Tipo: ${DTIPO}")) },
            2: { infoTemplate: new esri.InfoTemplate(getInfotemplate("Terrenos Cinegéticos", "Matricula: ${MATRICULA}<br>Nombre: ${NOMBRE}<br>Titular: ${TITULAR}<br>Tipo: ${DTIPO}")) }
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
            0: { infoTemplate: new esri.InfoTemplate(getInfotemplate("HUMEDALES", "CODIGO: ${CODIGO}<br>Nombre: ${DESCRIPCIO}")) },
            1: { infoTemplate: new esri.InfoTemplate(getInfotemplate("LICS", "CODIGO: ${CODIGO}<br>Nombre: ${DESCRIPCIO}")) },
            2: { infoTemplate: new esri.InfoTemplate(getInfotemplate("ZEPAS", "CODIGO: ${CODIGO}<br>Nombre: ${DESCRIPCIO}")) },
            3: { infoTemplate: new esri.InfoTemplate(getInfotemplate("LIG", "CODIGO: ${CODIGO}<br>Nombre: ${DESCRIPCIO}")) },
            4: { infoTemplate: new esri.InfoTemplate(getInfotemplate("ENP", "CODIGO: ${CODIGO}<br>Nombre: ${DESCRIPCIO}")) },
            5: { infoTemplate: new esri.InfoTemplate(getInfotemplate("PORN", "CODIGO: ${CODIGO}<br>Nombre: ${DESCRIPCIO}")) },
            6: { infoTemplate: new esri.InfoTemplate(getInfotemplate("AREAS CRITICAS", "CODIGO: ${CODZONA}<br>Nombre: ${DZONA}")) },
            7: { infoTemplate: new esri.InfoTemplate(getInfotemplate("APPE", "CODIGO: ${CODIGO}<br>Nombre: ${DESCRIPCIO}")) }
        });
        dynamicMSLayerFPA.setVisibleLayers([]);
        dynamicMSLayerFPA.setImageFormat("png32", true);
        var layer1 = new esri.layers.WMSLayerInfo({
            name: 'Catastro',
            title: 'Catastro'
        });

        layerCat = new esri.layers.WMSLayer('http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?', {
            resourceInfo: {
                extent: customExtentAndSR,
                layerInfos: [layer1]
            },
            visibleLayers: ['catastro']

        });
        layerCat.visible = true;
        layerCat.id = "OVC";
        layerCat.version = "1.1.1";
        layerCat.spatialReferences[0] = 3857; //new esri.SpatialReference(3857);


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
        wmsLayeriGN.spatialReferences[0] = 3857;

        var capaVinilo = new esri.layers.GraphicsLayer({ "id": "Geodesic" });

        // añade las capas al mapa
        map.addLayers([wmsLayeriGN, dynamicMSLayerMontes, dynamicMSLayerCotos, dynamicMSLayerFPA, dynamicMSLayerLimites, dynamicMSLayerGranjas, wmsSigpac, layerCat, capaVinilo]);

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
        return new esri.InfoTemplate(titulo, campos);
    }
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


