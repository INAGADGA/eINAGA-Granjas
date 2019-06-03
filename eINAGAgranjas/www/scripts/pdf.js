var _herramientas = new Herramientas();
/*
* @description genera un archivo pdf con los resultados de la consulta espacial
* @param {nombre} Nombre del archivo a generar
*/
function generaTextoDescarga(nombre) {
    'use strict';
    var tabladetalle = "<html><head><title>Análisis de Ganadería</title><style>body { font-family: arial, sans-serif}; table{ border-collapse: collapse;width: 100%;}td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}tr:nth-child(even) {background-color: #dddddd;}thead{background-color: #A9BCF5;} h2{color:blue}</style>";
    tabladetalle += "</head><body>";
    tabladetalle += "<hr>";
    tabladetalle += "<h1>INAGA: Análisis de distancia e impacto</h1>";
    tabladetalle += "<b>Fecha: " + _herramientas.dameFechaConFormato() + "</b> <br><br>";
    tabladetalle += "<b>Geometría de consulta en geojson (SRS 25830): </b>" + stringGeoJson;
    tabladetalle += "<hr>";
    tabladetalle += $("#resultadoImpacto").html();
    tabladetalle += $("#resultadoSaturados").html();
    tabladetalle += "<h2>Distancias a Explotaciones Ganaderas:</h2>";
    tabladetalle += "<b>Distancia análisis: " + distancia + " m</b>";
    tabladetalle += textoDescarga;
    tabladetalle += "</body></html>";


    var options = { documentSize: 'A4', type: 'share', fileName: nombre };
    pdf.fromData(tabladetalle, options)
        .then(function (stats) { console.log(stats); },
        function (err) { console.log(err); });
}