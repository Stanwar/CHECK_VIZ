angular.module('leafletApp').controller('buttonsCtrl', ['$scope','$http', 'uihp', function ($scope,$http, uihp) {

    $scope.singleModel = 1;

    $scope.radioModel = 'Middle';

    $scope.sourceRadioModel = "Total";
    $scope.checkModel = {
        ALL : true,
        IP: false,
        OP: false,
        NIPS: false
    };

    $scope.diseaseModel = {
        ALL : true,
        Asthma: false,
        Diabetes: false,
        SCD: false,
        Prematurity : false,
        NewbornInjury : false,
        Epilepsy : false
    };

    
}]);