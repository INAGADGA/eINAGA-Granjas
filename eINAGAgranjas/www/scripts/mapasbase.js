function Mapasbase() {

/*
* Función para añadir los distintos mapas base (fondo) al visor
*/
    this.cargaMapasBase = function (idDom) {
        this.idDom = idDom;
        // cargamnos los mapas base
        var oceano = new esri.dijit.BasemapLayer({ url: 'https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer' });
        var oceanoEtiqueta = new esri.dijit.BasemapLayer({ url: 'https://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer' });
        // topo item for gallery
        var oceanoBasemap = new esri.dijit.Basemap({
            layers: [oceano, oceanoEtiqueta],
            id: 'oceanos',
            title: 'Océanos',
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/f9498c1f95714efabb626125cb2bb04a/info/thumbnail/tempoceans.jpg'
        });
        // terreno etiquetas
        var terreno = new esri.dijit.BasemapLayer({ url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer' });
        var terrenoEtiqueta = new esri.dijit.BasemapLayer({ url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer' });
        // topo item for gallery
        var terrenoBasemap = new esri.dijit.Basemap({
            layers: [terreno, terrenoEtiqueta],
            id: 'terreno',
            title: 'Terreno Etiquetas',
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/532c8cc75f414ddebc5d665ba00015ca/info/thumbnail/terrain_labels.jpg'
        });
        //topo map
        var topoLayer = new esri.dijit.BasemapLayer({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer' });
        // topo item for gallery
        var topoBasemap = new esri.dijit.Basemap({
            layers: [topoLayer],
            id: 'topo',
            title: 'Topográfico',
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/6e03e8c26aad4b9c92a87c1063ddb0e3/info/thumbnail/topo_map_2.jpg'
        });
        //dark grey
        var dkGreyLayer = new esri.dijit.BasemapLayer({ url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer' });
        var dkGreyLabelsLayer = new esri.dijit.BasemapLayer({ url: 'https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer' });
        var dkGreyBasemap = new esri.dijit.Basemap({
            layers: [dkGreyLayer, dkGreyLabelsLayer],
            id: 'dkGrey',
            title: 'Lona Gris Oscuro',
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/a284a9b99b3446a3910d4144a50990f6/info/thumbnail/ago_downloaded.jpg'
        });

        //light grey
        var ltGreyLayer = new esri.dijit.BasemapLayer({ url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer' });
        var ltGreyLabelsLayer = new esri.dijit.BasemapLayer({ url: 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Reference/MapServer' });
        var ltGreyBasemap = new esri.dijit.Basemap({
            layers: [ltGreyLayer, ltGreyLabelsLayer],
            id: 'ltGrey',
            title: 'Lona Gris Claro',
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/8b3d38c0819547faa83f7b7aca80bd76/info/thumbnail/light_canvas.jpg'
        });
        // imagenes
        var imagenes = new esri.dijit.BasemapLayer({ url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer' });
        var etiquetas = new esri.dijit.BasemapLayer({ url: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer' });
        var imagenBasemap = new esri.dijit.Basemap({
            layers: [imagenes, etiquetas],
            id: 'images',
            title: 'Imágenes con etiquetas',
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/3027a41ed46d4a9b915590d14fecafc0/info/thumbnail/imagery_labels.jpg'
        });
        // clarity
        var clarity = new esri.dijit.BasemapLayer({ url: 'https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer' });
        var clarityBasemap = new esri.dijit.Basemap({
            layers: [clarity, etiquetas],
            id: 'clarity',
            title: 'clarity world',
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/da10cf4ba254469caf8016cd66369157/info/thumbnail/imagery_clarity_sm.jpg'
        });

        // NACIONAL GEOGRAPIC
        var natGeo = new esri.dijit.BasemapLayer({ url: 'https://server.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer' });
        var natGeoBasemap = new esri.dijit.Basemap({
            layers: [natGeo],
            id: 'natgeo',
            title: 'Nacional Geographic',
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/7ec6f7c55cf6478596435f2d501834fa/info/thumbnail/natgeo.jpg'
        });

        // open street map
        var street1 = new esri.dijit.BasemapLayer({
            type: "WebTiledLayer", url: "https://tile.openstreetmap.org/${level}/${col}/${row}.png"
        });

        var streetBasemap = new esri.dijit.Basemap({
            layers: [street1],
            id: 'street',
            title: 'Open Street Map',
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/d415dff75dd042258ceda46f7252ad70/info/thumbnail/temposm.jpg'
        });
        // mapabase en blanco
        var layer = new esri.dijit.BasemapLayer({ url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer" });
        layer.opacity = 0.0;
        var basemap = new esri.dijit.Basemap({ layers: [layer], title: "Blanco", thumbnailUrl: "" });

        var basemapGallery = new esri.dijit.BasemapGallery({
            showArcGISBasemaps: false,
            map: map,
            basemaps: [topoBasemap, dkGreyBasemap, ltGreyBasemap, imagenBasemap, clarityBasemap, natGeoBasemap, streetBasemap, terrenoBasemap, oceanoBasemap, basemap]
        }, idDom);


        // iniciamos el basemap y asignamos los mapas seleccionados
        basemapGallery.startup();
        //basemapGallery.add(basemap);
    };

}