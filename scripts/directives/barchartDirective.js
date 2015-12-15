app.directive('barchart', [function ($window) {
    return {
        restrict: 'EA',
        template : "<svg width='850' height='200'></svg>",
        link: function (scope, elem, attrs) {
            //var exp = $parse(attrs.barChartData) ;

            var barChartToPlot = scope[attrs.chartData];

            var padding = 20;
            var pathClass = "path";
            var xScale, yScale, xAxis, yAxis, drawline;

           // var d3 = $window.d3;
            var rawSvg = elem.find('svg');
            var svg = d3.select(rawSvg[0]);

            function barChart(){

                xScale = d3.scale.linear()
                            .domain([barChartToPlot[0].hour, barChartToPlot[barChartToPlot.length-1].hour])
                            .range([padding + 5,rawSvg.attr("width") - padding]);
                yScale = d3.scale.linear()
                            .domain([0,d3.max(barChartToPlot , function(d){
                                return d.sales;
                            })])
                            .range([rawSvg.attr("height") - padding , 0]);
                xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(barChartToPlot.length - 1);

                yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .ticks(5);

                drawline = d3.svg.line()
                        .x(function (d){
                            return xScale(d.hour);
                        })
                        .y(function (d){
                            return yScale(d.sales);
                        })
                        .interpolate("basis");

            }

            function drawBarChart(){
                barChart();

                svg.append("svg:g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0,180)")
                    .call(xAxis)
                    ;

                svg.append("svg:g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(20,0)")
                    .call(yAxis)
                    ;

                svg.append("svg:path")
                    .attr({
                        d: drawline(barChartToPlot),
                        "stroke" : "black",
                        "stroke-width" : 2,
                        "fill" : "none",
                        "class" : pathClass 
                    });
            }

            drawBarChart();
        }
    };
}])
// angular.module('d3', [])
// .factory('d3Service', ['$document', '$window', '$q', '$rootScope',
//   function($document, $window, $q, $rootScope) {
//     var d = $q.defer(),
//         d3service = {
//           d3: function() { return d.promise; }
//         };
//   function onScriptLoad() {
//     // Load client in the browser
//     $rootScope.$apply(function() { d.resolve($window.d3); });
//   }
//   var scriptTag = $document[0].createElement('script');
//   scriptTag.type = 'text/javascript'; 
//   scriptTag.async = true;
//   scriptTag.src = 'http://d3js.org/d3.v3.min.js';
//   scriptTag.onreadystatechange = function () {
//     if (this.readyState == 'complete') onScriptLoad();
//   }
//   scriptTag.onload = onScriptLoad;

//   var s = $document[0].getElementsByTagName('body')[0];
//   s.appendChild(scriptTag);

//   return d3service;
// }]);