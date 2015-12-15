// MainController for the app 

angular.module('leafletApp').controller("mapController", ['$scope','$http', 'leafletData', 'uihp',
	function($scope,$http, leafletData,uihp){
		  
		var source; 
		var tracker = 0;
        var age;
        var encounter;
        var checkResults = [];
        var diseaseResults = [];
        var uihp_data ; 
        $scope.ZipCodeLayer = new L.LayerGroup();
        $scope.checkGeojson = {};
        $scope.legendTotal = [];
        $scope.legendMax = [];
        //var leafletGeoJSON = {}
/*
        $scope.gridOptions = {
		    enableSorting: true,
		    columnDefs: [
		      { field: 'Recipient-ZIP', minWidth: 200, width: 250, enableColumnResizing: false },
		      { field: 'Age', width: '30%', maxWidth: 200, minWidth: 70 },
		      { field: 'Total_Charges', width: '20%' },
		      { field: 'Asthma', width: '20%' },
		      { field: 'Diabetes', width: '20%' },
		      { field: 'SCD', width: '20%' },
		      { field: 'Prematurity', width: '20%' },
		      { field: 'Epilepsy', width: '20%' },
		      { field: 'NewBorn', width: '20%' },
		      { field: 'IP_encounters', width: '20%' },
		      { field: 'IP_charges', width: '20%' },
		      { field: 'OP_encounters', width: '20%' },
		      { field: 'OP_charges', width: '20%' },
		      { field: 'NIPS_encounters', width: '20%' },
		      { field: 'NIPS_charges', width: '20%' }
		    ]
  		};
*/
  		

        $scope.disableCheck = true;
        $scope.heatMapModel = {
        	Patient_Encounter : true,
        	Patient_Charges : false,
        	Disease_Encounter : false
        }; 
        $scope.sourceInitialModel = {
        	Total : false,
        	UIHP : false,
        	Harmony : false
        }; 

        $scope.sourceRadioModel = {
        	Eligible : false,
        	Enrolled : true
        }; 
        
		$scope.checkModel = {
			//ALL : true,
			IP: true,
			OP: false,
			NIPS: false
		};

		$scope.diseaseModel = {
			//ALL : false,
			Asthma: true,
			Diabetes: false,
			SCD: false,
			Prematurity : false,
			NewbornInjury : false,
			Epilepsy : false
		};
        
		angular.extend($scope, {
			// Center on Chicago 
			chicago : {
				lat : 41.867490,
				lng : -87.633645,
				zoom : 10
			}, 
			// Map Defaults 
			defaults : {
				zoom: 10,
        		//scrollWheelZoom : false,
        		zoomControl: true,
		        //(this.mapURL2, {attribution: this.mapCopyright2});
		        tileLayer: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		        attribution : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX',
		        //maxZoom: 14
			}
		});

			// Wait for center to be stablished
           leafletData.getMap().then(function(map) {

				var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
				var osmAttrib='Map data &copy; OpenStreetMap contributors';
				//var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 18, attribution: osmAttrib});
				
				L.geoJson(ZIPCODES, 
                    {   
                            style : {
                            	fillColor : "green",
								weight : 2, 
								opacity : 1, 
								color : 'white',
								//dashArray : '3',
								fillOpacity : 0.7
                            }
                    }).addTo($scope.ZipCodeLayer);

				$scope.ZipCodeLayer.addTo(map);

				angular.extend($scope.controls, {
				   minimap: {
						type: 'minimap',
						layer: {
						   name: 'OpenStreetMap',
						   url: osmUrl,
						   type : 'xyz',
						  // data : ZIPCODES
							zoomLevelOffset : -5
						},
						toggleDisplay: true
					}
				});
				var control2 = new L.Control.Fullscreen();
				control2.addTo(map);
           });

		$scope.updateColor = function(){
			 if($scope.sourceInitialModel == "Total" && $scope.sourceRadioModel == "Eligible"){
				uihp.total_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if($scope.sourceInitialModel == "Total" && $scope.sourceRadioModel == "Enrolled"){
				uihp.total_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "UIHP" && $scope.sourceRadioModel == "Eligible"){
				uihp.uihp_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "UIHP" && $scope.sourceRadioModel == "Enrolled"){
				uihp.uihp_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "Harmony" && $scope.sourceRadioModel == "Eligible"){
				uihp.harmony_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "Harmony" && $scope.sourceRadioModel == "Enrolled"){
				uihp.harmony_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
		}
		
		function getColor(d, max){
			//console.log("content : " + content );

			var bin = parseInt(max/7);
			//console.log("bin :" + bin + "max : " + max);
			////

	        return d > max-bin*1 ? '#800026' :
	               d > max-bin*2  ? '#BD0026' :
	               d > max-bin*3  ? '#E31A1C' :
	               d > max-bin*4  ? '#FC4E2A' :
	               d > max-bin*5   ? '#FD8D3C' :
	               d > max-bin*6   ? '#FEB24C' :
	                d > 1   ? '#FED976' :
	                    '#FFFFFF';
				return "yellow"
		}

	 	function onEachFeature(feature, layer){
			var t = feature.properties.ZIP;
		
			if(uihp_data){
				
				uihp_data.forEach(function(d){
		            var Encounter = 0;
		            var total_disease_encounter = 0;

		            var patient_encounter = 0;
		            var patient_charges = 0;
		            var total_patient_charges = 0 ;
		            var total_patient_encounter =0;
	                //console.log("Inside UIHP");
	                //console.log("t  +" + t);
	                if (t == d.RecipientZip){
	                    $scope.diseaseResults.forEach( function(key){
	                        
	                        if(key == "Asthma"){
	                        	//console.log("d.Asthma : " + d.Asthma);
	                            Encounter = d.Asthma ;
	                        }
	                        if(key == "Diabetes"){
	                        	//console.log("d.Diabetes : " + d.Diabetes);
	                            Encounter = d.Diabetes;
	                        }
	                        if(key == "SCD"){
	                        	//console.log("d.SCD : " + d.SCD);
	                            Encounter = d.SCD;
	                        }
	                        if(key == "Prematurity"){
	                        	//console.log("d.Prematurity : " + d.Prematurity);
	                            Encounter = d.Prematurity;
	                        }
	                        if(key == "NewbornInjury"){
	                        	//console.log("d.NewBorn : " + d.NewBorn);
	                            Encounter = d.NewBorn;
	                        }
	                        if(key == "Epilepsy"){
	                        	//console.log("d.Epilepsy : " +d.Epilepsy);
	                            Encounter = d.Epilepsy;
	                        }
	                        total_disease_encounter = parseInt(total_disease_encounter) + parseInt(Encounter);
	                    });
	                    $scope.checkResults.forEach(function (v){
	                    	
	                        if(v =="IP"){
	                            patient_encounter = parseInt(d.IP_encounters);
	                            patient_charges = parseInt(d.IP_charges);
	                        }
	                        if(v =="OP"){
	                            patient_encounter = parseInt(d.OP_encounters);
	                            patient_charges = parseInt(d.OP_charges);
	                        }
	                        if(v =="NIPS"){
	                            patient_encounter  = parseInt(d.NIPS_encounters);
	                            patient_charges = parseInt(d.NIPS_charges);
	                        }
	                        total_patient_encounter = parseInt(total_patient_encounter) + parseInt(patient_encounter);
	                        total_patient_charges = parseInt(total_patient_charges) + parseInt(patient_charges);
	                    });
	                    
	            		var content = "<table class='table table-hover'>"+ 
		                                    "<thead>" + 
		                                        "<tr>" + 
		                                            "<th> ZipCode :</th>"+
		                                            "<td>" + d.RecipientZip + "</td>"+
		                                        "</tr>" + 
		                                    "</thead>" + 
		                                    "<tbody>" +  "<tr>" + 
		                                            "<th>Charges:</th>"+
		                                            "<td>" + numeral(total_patient_charges).format('$0,0.00')  + "</td>"+
		                                        "</tr>" +
		                                        "<tr>" + 
		                                        "<th>Encounters:</th>"+
		                                            "<td>"+ numeral(total_patient_encounter).format('0.0a') +"</td>" + 
		                                        "</tr>"+
		                                        "<tr>" + 
		                                        "<th>Ages</th>"+
		                                            "<td>" + d.Age + " 25</td>" + 
		                                        "</tr>" +
		                                        "<tr>" + 
		                                        "<th>Disease Encounters:</th>"+
		                                            "<td>"+ numeral(total_disease_encounter).format('0.0a') +"</td>" + 
		                                        "</tr>"+
		                                    "</tbody>" + 
		                                "</table>";
		                                $scope.Total_Content = total_patient_encounter;

						layer.bindPopup(content);
	                }
        		
				});
			}
		    
		}	

		function style(feature){
			var t = feature.properties.ZIP;
		
			var style_calc = 0;
			var max = 0;
			if(uihp_data){
				uihp_data.forEach(function(d){
		            var Encounter = 0;
		            var total_disease_encounter = 0;

		            var patient_encounter = 0;
		            var patient_charges = 0;
		            var total_patient_charges = 0 ;
		            var total_patient_encounter =0;
	                //console.log("Inside UIHP");
	                //console.log("t  +" + t);
	                if (t == d.RecipientZip){
	                    $scope.diseaseResults.forEach( function(key){
	                        
	                        if(key == "Asthma"){
	                        	//console.log("d.Asthma : " + d.Asthma);
	                            Encounter = d.Asthma ;
	                        }
	                        if(key == "Diabetes"){
	                        	//console.log("d.Diabetes : " + d.Diabetes);
	                            Encounter = d.Diabetes;
	                        }
	                        if(key == "SCD"){
	                        	//console.log("d.SCD : " + d.SCD);
	                            Encounter = d.SCD;
	                        }
	                        if(key == "Prematurity"){
	                        	//console.log("d.Prematurity : " + d.Prematurity);
	                            Encounter = d.Prematurity;
	                        }
	                        if(key == "NewbornInjury"){
	                        	//console.log("d.NewBorn : " + d.NewBorn);
	                            Encounter = d.NewBorn;
	                        }
	                        if(key == "Epilepsy"){
	                        	//console.log("d.Epilepsy : " +d.Epilepsy);
	                            Encounter = d.Epilepsy;
	                        }
	                        total_disease_encounter = parseInt(total_disease_encounter) + parseInt(Encounter);
	                    });
	                    $scope.checkResults.forEach(function (v){
	                    	
	                        if(v =="IP"){
	                            patient_encounter = parseInt(d.IP_encounters);
	                            patient_charges = parseInt(d.IP_charges);
	                        }
	                        if(v =="OP"){
	                            patient_encounter = parseInt(d.OP_encounters);
	                            patient_charges = parseInt(d.OP_charges);
	                        }
	                        if(v =="NIPS"){
	                            patient_encounter  = parseInt(d.NIPS_encounters);
	                            patient_charges = parseInt(d.NIPS_charges);
	                        }
	                        total_patient_encounter = parseInt(total_patient_encounter) + parseInt(patient_encounter);
	                        total_patient_charges = parseInt(total_patient_charges) + parseInt(patient_charges);
	                    });

						//layer.bindPopup(content);
						// Style Parameters
						if($scope.heatMapModel == "Patient_Encounter"){
							style_calc = total_patient_encounter;
						}else if($scope.heatMapModel =="Patient_Charges"){
							style_calc = total_patient_charges;
						}else if($scope.heatMapModel =="Disease_Encounter"){
							style_calc = total_disease_encounter;
						}
						
	                }
        			//max = ;
				});
			}

			///////
			return {
					fillColor : getColor(style_calc,$scope.legendMax[0]),
					weight : 2, 
					opacity : 1, 
					color : 'white',
					dashArray : '3',
					fillOpacity : 0.7
				};
		}
		$scope.change = function(){
			
			if($scope.sourceInitialModel == "UIHP" 
				|| $scope.sourceInitialModel == "Total" 
				|| $scope.sourceInitialModel == "Harmony"){
				$scope.disableCheck = false;
			}
			
			console.log(source);
			if($scope.sourceInitialModel == "Total" && $scope.sourceRadioModel == "Eligible"){
				uihp.total_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if($scope.sourceInitialModel == "Total" && $scope.sourceRadioModel == "Enrolled"){
				uihp.total_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "UIHP" && $scope.sourceRadioModel == "Eligible"){
				uihp.uihp_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "UIHP" && $scope.sourceRadioModel == "Enrolled"){
				uihp.uihp_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "Harmony" && $scope.sourceRadioModel == "Eligible"){
				uihp.harmony_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "Harmony" && $scope.sourceRadioModel == "Enrolled"){
				uihp.harmony_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
            var total_charges = 0 ;
            
            if(uihp_data){
            	// Getting all the elements of the parameter we are taking out heatmap for. 
            	var max_value = 0;
            	uihp_data.forEach(function(d){
            		var total_disease_encounter = 0;
            		var Encounter = 0;
		            var patient_encounter = 0;
		            var patient_charges = 0;
		            var total_patient_charges = 0 ;
		            var total_patient_encounter =0;
		            $scope.legendMax = [];
            		if($scope.heatMapModel == "Disease_Encounter"){
						$scope.diseaseResults.forEach( function(key){

							if(key == "Asthma"){
	                        	//console.log("d.Asthma : " + d.Asthma);
	                            Encounter = d.Asthma ;
	                        }
	                        if(key == "Diabetes"){
	                        	//console.log("d.Diabetes : " + d.Diabetes);
	                            Encounter = d.Diabetes;
	                        }
	                        if(key == "SCD"){
	                        	//console.log("d.SCD : " + d.SCD);
	                            Encounter = d.SCD;
	                        }
	                        if(key == "Prematurity"){
	                        	//console.log("d.Prematurity : " + d.Prematurity);
	                            Encounter = d.Prematurity;
	                        }
	                        if(key == "NewbornInjury"){
	                        	//console.log("d.NewBorn : " + d.NewBorn);
	                            Encounter = d.NewBorn;
	                        }
	                        if(key == "Epilepsy"){
	                        	//console.log("d.Epilepsy : " +d.Epilepsy);
	                            Encounter = d.Epilepsy;
	                        }
	                        total_disease_encounter = parseInt(total_disease_encounter) + parseInt(Encounter);

						})
						$scope.legendTotal.push(total_disease_encounter);
						if(parseInt(max_value) <= parseInt(total_disease_encounter)){
							max_value = total_disease_encounter;
						}
						$scope.legendMax.push(max_value);
					}
					else{
	                    $scope.checkResults.forEach(function (v){
		                    	
	                        if(v =="IP"){
	                            patient_encounter = parseInt(d.IP_encounters);
	                            patient_charges = parseInt(d.IP_charges);
	                        }
	                        if(v =="OP"){
	                            patient_encounter = parseInt(d.OP_encounters);
	                            patient_charges = parseInt(d.OP_charges);
	                        }
	                        if(v =="NIPS"){
	                            patient_encounter  = parseInt(d.NIPS_encounters);
	                            patient_charges = parseInt(d.NIPS_charges);
	                        }
	                        total_patient_encounter = parseInt(total_patient_encounter) + parseInt(patient_encounter);
	                        total_patient_charges = parseInt(total_patient_charges) + parseInt(patient_charges);
	                    });

	                    if($scope.heatMapModel == "Patient_Encounter"){
	                    	$scope.legendTotal.push(total_patient_encounter);
							if(parseInt(max_value) <= parseInt(total_patient_encounter)){
								max_value = total_patient_encounter;
							}
							$scope.legendMax.push(max_value);
	                    }
	                    else if($scope.heatMapModel == "Patient_Charges") {
	                    	$scope.legendTotal.push(total_patient_charges);
							if(parseInt(max_value) <= parseInt(total_patient_charges)){
								max_value = total_patient_charges;
							}
							$scope.legendMax.push(max_value);
	                    }
	                    
					}
				})
				console.log("The legend Total : " + $scope.legendTotal);
				

            }
            /* Get Results for all diseases for every zipcode. After that get IP/OP encounters and Charges for each Disease per Zipcode */
            //$scope.geojson.data = {};

            
           
            $scope.$watchCollection('sourceInitialModel',function(){
				source = $scope.sourceRadioModel;
			//            console.log($scope.sourceRadioModel);          
			})

            $scope.$watchCollection('ageRadioModel', function() {
	            age = $scope.ageRadioModel;
	        });

	        $scope.$watchCollection('diseaseModel', function () {
	            $scope.diseaseResults = [];
	            angular.forEach($scope.diseaseModel, function (value, key) {
	                if (value) {
	                    console.log(key);
	                    diseaseResults.push(key);
	                    $scope.diseaseResults.push(key);
	                }
	            });
	        });

	        $scope.$watchCollection('checkModel', function () {
	            $scope.checkResults = [];
	            angular.forEach($scope.checkModel, function (value, key) {
	                if (value) {
	                    console.log(key);
	                    checkResults.push(key);
	                    $scope.checkResults.push(key);
	                }
	            });
	        });

	        if($scope.sourceInitialModel && 
	        	($scope.sourceRadioModel == "Enrolled" || $scope.sourceRadioModel == "Eligible" ) ){

	            leafletData.getMap().then(function(map) {

	           		map.removeLayer($scope.ZipCodeLayer);
					$scope.checkGeojson = L.geoJson(ZIPCODES, 
	                    { 
                    		onEachFeature : onEachFeature,
                            style : style
	                    }).addTo($scope.ZipCodeLayer);
					map.addLayer($scope.ZipCodeLayer);
					// Removing Legend 
	           
	            $("div").remove(".legend.leaflet-control");
	           
	            
				var div = L.DomUtil.create('div', 'info legend');
				
				var legend = L.control();
				// declaring legend again 
				var legendData  = {
					colors : [],
					labels : []
				}; 

				// Color Array
				legendData.colors = ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FED976'];
				var max = $scope.legendMax[0];
				var bin = parseInt(max/7);

				//legend.labels =[];
				// Adding Labels
				legendData.labels.push("> " + parseInt(max-bin*1));
				legendData.labels.push("> " + parseInt(max-bin*2));
				legendData.labels.push("> " + parseInt(max-bin*3));
				legendData.labels.push("> " + parseInt(max-bin*4));
				legendData.labels.push("> " + parseInt(max-bin*5));
				legendData.labels.push("> " + parseInt(max-bin*6));
				legendData.labels.push(1);
				for (var i = 0; i < legendData.colors.length; i++) {
					div.innerHTML +=
					'<div class="outline"><i style="background:' + legendData.colors[i] + '"></i></div>' +
					'<div class="info-label">' + legendData.labels[i] + '</div>';
				
				}

				legend.onAdd = function(map){
					return div;
				}

				legend.addTo(map);
				});

	            
			}

        }

        $scope.updateLegend = function(){


		    	angular.extend($scope, {

					
					legend : {
						colors: ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FED976']

					}

				}); 
        }
    	angular.extend($scope, {

			geojson : {
				data : ZIPCODES
			},
			controls : {},
			legend : {
				colors: ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FED976'],
				labels :[000000,000000,000000,000000,000000,000000,000000]
			}
/*
			leafletData.getMap().then(function(map){
				
			})*/
		}); 

	}
]);