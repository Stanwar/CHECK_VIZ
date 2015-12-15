// MainController for the app 

var app = app.controller("BoundsController", ['$scope', 'leafletBoundsHelpers',
	function($scope,leafletBoundsHelpers){
		angular.extend($scope, {
			chicago : {
				lat : 41.867490,
				lng : -87.633645,
				zoom : 12
			}, 
		})
	}
]);