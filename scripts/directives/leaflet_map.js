// Directive for map
//
angular.extend($scope, {
    defaults: {
    	chicago: {
    		lat : 41.867490,
    		lng : -87.633645,
    		zoom : 12
    	},
        zoom: 12,
        layers: [this.MapView],
        zoomControl: true,
        //(this.mapURL2, {attribution: this.mapCopyright2});
        tileLayer: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX',
        maxZoom: 14,
        path: {
            weight: 10,
            color: '#800000',
            opacity: 1
        }
    }
});
