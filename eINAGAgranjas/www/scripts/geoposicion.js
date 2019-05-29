function Geoposicion() {

    var _transformaciones = new Transformaciones();
    /*
    * En el caso que obtener señal, convertirla a ETRS89 y realizar zoom a la posición
    */
    this.onSuccess = function onSuccess(position) {
        var miposicion = new esri.geometry.Point;
        miposicion.x = position.coords.longitude;
        miposicion.y = position.coords.latitude;
        var altitud = position.coords.altitude;
        var Accuracy = position.coords.accuracy;
        var AltitudeAccuracy = position.coords.altitudeAccuracy;
        var Heading = position.coords.heading;
        var Speed = position.coords.speed;
        var Timestamp = position.timestamp;
        _transformaciones.dameCoordEtrs89(miposicion, false);
    };

    /*
    * En el caso que no obtenga señal, indicarlo con un mensaje
    */
    this.onError = function (error) {
        dom.byId("gps").innerHTML = "Sin señal GPS";
    };

    /*
    * Funión para obtener la posición GPS del dispositivo a través del objeto navigator del navegador
    */
    this.getPosition = function () {
        var options = {
            enableHighAccuracy: true
        };
        var watchID = navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, options);
    };
}