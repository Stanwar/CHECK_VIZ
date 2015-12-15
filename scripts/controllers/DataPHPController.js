// MainController for the app 

angular.module('controllers',[])
.controller("dataPHPController", ['$scope','$http', 'uihp',
	function($scope,$http, uihp){
		

/*
		console.log($scope.uihp);
		//console.log($scope.sourceRadioModel);

	    var source; 
	    var age;
	    var encounter;
	    var disease;

	    $scope.$watchCollection('sourceRadioModel',function(){
	        source = $scope.sourceRadioModel;
	        console.log($scope.sourceRadioModel);
	        if(source == "Total"){
				uihp.get(function(data){
					$scope.uihp = data;
				});
			}

	    })

	    $scope.$watchCollection('ageRadioModel', function() {
	        age = $scope.ageRadioModel;
	        //console.log($scope.ageRadioModel);
			//console.log(source);	
	    })

	    $scope.$watchCollection('radioModel', function() {
	        disease = $scope.radioModel;
	        //console.log($scope.ageRadioModel);
			//console.log(source);	
	    })

		$scope.$watchCollection('checkModel', function () {
			$scope.checkResults = [];
			angular.forEach($scope.checkModel, function (value, key) {
				if (value) {
					console.log(key);
					$scope.checkResults.push(key);
				}
			});
		});

*/
		// According to the button click, pick one of the data elements 
		/*
			$http.get("../checkVizAngular/data/ENROLLED_ZipCode.php").success(function(data){
				$scope.enrolled = data;
			});

			$http.get("../checkVizAngular/data/ENROLLED_ZipCode.php").success(function(data){
				$scope.eligible = data;
			});

			$http.get("../checkVizAngular/data/UIHP_ZipCode.php").success(function(data){
				$scope.uihp = data;
			});
		*/
	}
]);