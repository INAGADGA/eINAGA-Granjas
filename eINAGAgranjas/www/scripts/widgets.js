function Widgets() {
    var _this = this;
    var _transformaciones = new Transformaciones();
    this.measurement;
    // inicializamos todos los widgets necesarios, y los asociamos a su elemento html
    this.cargaWidgets = function () {
        // widget medicion    
        this.measurement = new esri.dijit.Measurement({
            map: map,
            defaultAreaUnit: esri.Units.SQUARE_METERS,
            defaultLengthUnit: esri.Units.METERS
        }, "measurementDiv"
        );

        this.measurement.startup();

        // evento finalizar medicición: añadir la funcionalidad para convertir la coordenada a nuestro SR
        this.measurement.on("measure-end", function (evt) {
            if (evt.toolName === "location") {
                _transformaciones.dameGeomEtrs89(evt.geometry, true);
            }
        });
        // evento de cambio, para limpiar los datos anteriores
        this.measurement.on("tool-change", function (evt) {
            // inhabilita la opción de información en el click, para poder realizar la medición
            map.setInfoWindowOnClick(false);
            // limpia el dato de la coordenada
            $("#etrs").html("");
        });

        // widget geolocate
        geoLocate = new esri.dijit.LocateButton({ map: map }, "LocateButton");
        geoLocate.startup();

        // widget overview
        var overviewMapDijit = new esri.dijit.OverviewMap({
            map: map,
            attachTo: "bottom-right",
            expandFactor: 3,
            height: 200,
            width: 200,
            color: " #D84E13",
            visible: false,
            opacity: .40
        });
        overviewMapDijit.startup();

        // widget home
        var home = new esri.dijit.HomeButton({
            map: map
        }, "HomeButton");
        home.startup();


        // widget búsquedas
        var s = new esri.dijit.Search({
            enableButtonMode: true,
            enableLabel: false,
            enableInfoWindow: true,
            showInfoWindowOnSelect: true,
            enableSuggestions: true,
            enableSuggestionsMenu: true,
            map: map
        }, "search");
        var sources = [
            {
                featureLayer: new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Ambitos/MapServer/3"),
                searchFields: ["D_MUNI_INE"],
                displayField: "D_MUNI_INE",
                exactMatch: false,
                name: "Municipios",
                outFields: ["*"],
                placeholder: " ",
                maxResults: 6,
                maxSuggestions: 6,
                enableSuggestions: true,
                minCharacters: 0
            }, {
                featureLayer: new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Ambitos/MapServer/5"),
                searchFields: ["REFPAR"],
                displayField: "REFPAR",
                exactMatch: true,
                name: "Parcelas Catastrales",
                outFields: ["*"],
                placeholder: "14 primeros dígitos de REFPAR",
                maxResults: 6,
                maxSuggestions: 6,
                enableSuggestions: true,
                minCharacters: 0
            }, {
                featureLayer: new esri.layers.FeatureLayer(rutaServidor + "/INAGA_Ambitos/MapServer/7"),
                searchFields: ["REFPAR"],
                displayField: "REFPAR",
                exactMatch: true,
                name: "Parcelas Sigpac",
                outFields: ["*"],
                placeholder: " ",
                maxResults: 6,
                maxSuggestions: 6,
                enableSuggestions: true,
                minCharacters: 0
            }, {
                locator: new esri.tasks.Locator("//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"),
                singleLineFieldName: "SingleLine",
                name: "Geocoding Service",
                localSearchOptions: {
                    minScale: 300000,
                    distance: 50000
                },
                placeholder: "Search Geocoder",
                maxResults: 3,
                maxSuggestions: 6,
                enableSuggestions: false,
                minCharacters: 0
            }];

        s.set("sources", sources);
        s.sources[0].searchExtent = customExtentAndSR;
        s.sources[1].searchExtent = customExtentAndSR;
        s.startup();
    };

    // función para resetear la medición
    this.reseteaMedicion = function () {
        this.measurement.clearResult();
        this.measurement.setTool("area", false);
        this.measurement.setTool("distance", false);
        this.measurement.setTool("location", false);
        map.setInfoWindowOnClick(true);
    };
}