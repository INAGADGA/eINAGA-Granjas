function Herramientas() {

    // establece el cursor en espera y visualiza la animación de espera
    this.cursorEspera = function () {
        map.setMapCursor("wait");
        $('#procesando').css('display', 'inline-block');
    };

    // establece el cursor en defecto y desvisualiza la animación de espera
    this.cursorxDefecto = function () {
        map.setMapCursor("default");
        $('#procesando').css('display', 'none');
    };
    // función que cambia la visibilidad de elementos dom
    this.visible = function (id, flag) {
        if (flag === 1) {
            $('#' + id).css('visibility', 'visible');
            //document.getElementById(id).style.visibility = 'visible';
        }
        else if (flag === 0) {
            $('#' + id).css('visibility', 'hidden');
            //document.getElementById(id).style.visibility = 'hidden';
        }
    };

    // Función para actualizar los text box de las búsquedas por coordenadas
    this.actualizaCoordTextBox =function (pt, ptEtrs, abrirPanel) {
        coordx = ptEtrs.x.toFixed(0);
        coordy = ptEtrs.y.toFixed(0);
        $("#CoordX").val(coordx);
        $("#CoordY").val(coordy);
        $("#Longitud").val(pt.getLongitude().toFixed(8));
        $("#Latitud").val(pt.getLatitude().toFixed(8));
        if (abrirPanel) {
            $("#myPanel").panel("open");
            $("#collapCoord").collapsible("expand");
            $("#collapCoordETRS").collapsible("expand");
            $("#collapCoordGEO").collapsible("expand");
        }
    }

    /*
    * description devuelve la cadena formateada con la concatenación de las horas,minutos y segundos, para identificar los informes generados
    * param {} Sin parametros
    * return {string}
    */
    this.dameFechaHora = function () {
        var d = new Date();
        var fecha2 = d.getFullYear() + "" + ("00" + (d.getMonth() + 1)).slice(-2) + "" + ("00" + d.getDate()).slice(-2);
        var localdatetime = fecha2 + ("00" + d.getHours()).slice(-2) + ("00" + d.getMinutes()).slice(-2) + ("00" + d.getSeconds()).slice(-2);
        return localdatetime;
    };

    this.dameFechaConFormato = function () {
        var d = new Date();
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    };

    
}