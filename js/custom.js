/**
 * Generate random chart data
 */
var chartData = [];

var chart = AmCharts.makeChart( "chartdiv", {
  "type": "stock",
  "theme": "light",

  // This will keep the selection at the end across data updates
  "glueToTheEnd": true,

  // Defining data sets
  "dataSets": [ {
    "title": "data set:",
    "fieldMappings": [ {
      "fromField": "value",
      "toField": "value"
    }, {
      "fromField": "volume",
      "toField": "volume"
    } ],
    "dataProvider": chartData,
    "categoryField": "date"
  } ],
  "CategoryAxesSettings":{
    "minPeriod":"ss",
    "parseDates": true,
    "dateFormats":[{period:'ss',format:'JJ:NN:SS'}]
    },
  // Panels
  "panels": [ {
    "showCategoryAxis": false,
    "title": "Value",
    "percentHeight": 60,
    "stockGraphs": [ {
      "id": "g1",
      "valueField": "value",
      "comparable": true,
      "compareField": "value"
    } ],
    "stockLegend": {}
  }, {
    "title": "Volume",
    "percentHeight": 40,
    "stockGraphs": [ {
      "valueField": "volume",
      "type": "column",
      "showBalloon": false,
      "fillAlphas": 1
    } ],
    "stockLegend": {}
  } ],

  // Scrollbar settings
  "chartScrollbarSettings": {
    "graph": "g1",
    "usePeriod": "WW"
  },

  // Period Selector
  "periodSelector": {
    "dateFormat":"YYYY/MM/DD HH:MM:SS",
    "position": "left",
    "periods": [
         {
      "period": "DD",
      "count": 10,
      "label": "10 days"
    }, {
      "period": "MM",
      "selected": true,
      "count": 1,
      "label": "1 month"
    }, {
      "period": "YYYY",
      "count": 1,
      "label": "1 year"
    }, {
      "period": "YTD",
      "label": "YTD"
    }, {
      "period": "MAX",
      "label": "MAX"
    } ]
  },
  
  // Data Set Selector
  "dataSetSelector": {
    "position": "left"
  },

  // Event listeners
  "listeners": [ {
    "event": "rendered",
    "method": function( event ) {
      chart.mouseDown = false;
      chart.containerDiv.onmousedown = function() {
        chart.mouseDown = true;
      }
      chart.containerDiv.onmouseup = function() {
        chart.mouseDown = false;
      }
    }
  } ]
} );


 var socket = io();
 socket.on('broadcast',function(data){

   if ( chart.mouseDown )
       return;
    
    console.log(data.result);

    chartData=[];

    $.each(data.result,function(i,v){
      var item={
            date:v["Data_time"],
            value:v["Data_value"],
            volume:v["Data_value"]
      }
      chartData.push(item);
    });

    chart.dataSets[ 0 ].dataProvider=chartData;

    chart.validateData();
  });