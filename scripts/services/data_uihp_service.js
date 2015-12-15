angular.module('services',[]).factory('uihp', ['$http', function ($http,$q) {
	
	//var json, deferred = $q.defer(); 
	//'total_eligible', 'total_enrolled' , 'uihp_eligible' , 'uihp_enrolled' ,'harmony_eligible', 'harmony_enrolled'
	return {
		total_eligible : 	function (callback){
					//var json; 
					 $http.get("../checkVizAngular/data/total_eligible.php").success(function(data){
						callback(data);
					});
					//console.log(json);
					 
				},
		total_enrolled : function (callback){
							 $http.get("../checkVizAngular/data/total_enrolled.php").success(function(data){
								callback(data);
							});
						},
		uihp_eligible : function (callback){
							 $http.get("../checkVizAngular/data/uihp_eligible.php").success(function(data){
								callback(data);
							});
		},
		uihp_enrolled : function (callback){
							 $http.get("../checkVizAngular/data/uihp_enrolled.php").success(function(data){
								callback(data);
							});
		},
		harmony_eligible : function (callback){
							 $http.get("../checkVizAngular/data/harmony_eligible.php").success(function(data){
								callback(data);
							});
		},
		harmony_enrolled : function (callback){
							 $http.get("../checkVizAngular/data/harmony_enrolled.php").success(function(data){
								callback(data);
							});
		}		


	};
}]);