function Mapasbase() {

    Mapasbase.wmtsLayer = null;
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
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/79f66c69319e4408a8388c7eb22941a1/info/thumbnail/light_gray_canvas.jpg'
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
            thumbnailUrl: 'https://www.arcgis.com/sharing/rest/content/items/da10cf4ba254469caf8016cd66369157/info/thumbnail/ago_downloaded.jpg'
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
        
        

        //Añadimos las capas WMTS de IGN
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
            copyright: "IGN"
        };
        var options = {
            serviceMode: "KVP",
            resourceInfo: resourceInfo,
            layerInfo: layerInfo
        };
        Mapasbase.wmtsLayer = new esri.layers.WMTSLayer("https://www.ign.es/wmts/ign-base", options);
        var ignBase = new esri.dijit.Basemap({
            id: "WMTSBaseMap.base.IGN",
            layers: [Mapasbase.wmtsLayer],
            title: "Base IGN",
            thumbnailUrl: "images/imgIGNBase.jpg"
        });

        
        var layerInfo2 = new esri.layers.WMTSLayerInfo({
            tileInfo: tileInfo,
            fullExtent: tileExtent,
            initialExtent: tileExtent,
            identifier: "MTN",
            tileMatrixSet: "GoogleMapsCompatible",
            format: "png",
            style: "default"
        });
        var resourceInfo2 = {
            version: "1.0.0",
            layerInfos: [layerInfo2],
            copyright: "IGN"
        };
        var options2 = {
            serviceMode: "KVP",
            resourceInfo: resourceInfo2,
            layerInfo: layerInfo2
        };  
        var wmtsIGNRaster = new esri.layers.WMTSLayer("https://www.ign.es/wmts/mapa-raster", options2);        
        var ignRaster = new esri.dijit.Basemap({
            id: "WMTSBaseMap.raster.IGN",
            layers: [wmtsIGNRaster],
            title: "Raster IGN",
            thumbnailUrl: "images/imgIGNRaster.jpg"
        });

        var layerInfo3 = new esri.layers.WMTSLayerInfo({
            tileInfo: tileInfo,
            fullExtent: tileExtent,
            initialExtent: tileExtent,
            identifier: "EL.GridCoverageDSM",
            tileMatrixSet: "GoogleMapsCompatible",
            format: "png",
            style: "default"
        });
        var resourceInfo3 = {
            version: "1.0.0",
            layerInfos: [layerInfo3],
            copyright: "IGN"
        };
        var options3= {
            serviceMode: "KVP",
            resourceInfo: resourceInfo3,
            layerInfo: layerInfo3
        };  
        var wmtsIGNRLidar = new esri.layers.WMTSLayer("https://wmts-mapa-lidar.idee.es/lidar", options3);
        ignLidar = new esri.dijit.Basemap({
            id: "WMTSBaseMap.lidar.IGN",
            layers: [wmtsIGNRLidar],
            title: "Lidar IGN",
            thumbnailUrl: "images/imgIGNLidar.jpg"
        });

        var layerInfo4 = new esri.layers.WMTSLayerInfo({
            tileInfo: tileInfo,
            fullExtent: tileExtent,
            initialExtent: tileExtent,
            identifier: "OI.OrthoimageCoverage",
            tileMatrixSet: "GoogleMapsCompatible",
            format: "png",
            style: "default"
        });
        var resourceInfo4 = {
            version: "1.0.0",
            layerInfos: [layerInfo4],
            copyright: "IGN"
        };
        var options4 = {
            serviceMode: "KVP",
            resourceInfo: resourceInfo4,
            layerInfo: layerInfo4
        };
        var wmtsIGNOrto = new esri.layers.WMTSLayer("https://www.ign.es/wmts/pnoa-ma", options4);
        ignOrto = new esri.dijit.Basemap({
            id: "WMTSBaseMap.Orto.IGN",
            layers: [wmtsIGNOrto],
            title: "PNOA IGN",
            thumbnailUrl: "images/imgIGNOrto.jpg"
        });

        // mapabase en blanco
        var layer = new esri.dijit.BasemapLayer({ url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer" });
        layer.opacity = 0.0;
        var basemap = new esri.dijit.Basemap({ layers: [layer], title: "Blanco", thumbnailUrl: "images/imgBlanco.jpg" });

        basemapGallery = new esri.dijit.BasemapGallery({
            showArcGISBasemaps: false,
            map: map,
            //basemaps: [ignBase, ignRaster, ignLidar, topoBasemap, dkGreyBasemap, ltGreyBasemap, imagenBasemap, clarityBasemap, natGeoBasemap, streetBasemap, terrenoBasemap, oceanoBasemap, basemap]
            basemaps: [ignBase, ignOrto,ignRaster, ignLidar, imagenBasemap, streetBasemap, terrenoBasemap, basemap]
        }, idDom);

        // iniciamos el basemap y añadimos el wmts y el blanco
        basemapGallery.startup();
        //basemapGallery.add(basemap);
        map.addLayer(Mapasbase.wmtsLayer);
    };

}