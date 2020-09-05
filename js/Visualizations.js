/*
* Visualizations.js - The main screen that combines all the charts
*/

//Updates the selected category for filtering from the URL (from menu or opening screen)
let category = parent.document.URL.substring(parent.document.URL.indexOf('=') + 1, parent.document.URL.length);

//Initializing possible values from data
if (category === "enjoyment") category = "enjoy_the_moment";
var filteredmoments = [], countryCount = [], ageCount = [], genderCount = [], X = [];
var Scatterplot, Donut, Barchart, Stackedchart, Areachart, Tx;

let statusCount = {
    parents: {singleParent: 0, divorcedParent: 0, marriedParent: 0, separatedParent: 0, widowedParent: 0},
    notParents: {
        singleNotParent: 0,
        divorcedNotParent: 0,
        marriedNotParent: 0,
        separatedNotParent: 0,
        widowedNotParent: 0
    }
};

let countries = ["IND", "USA", "Other"], genders = ["m", "f", "o"],
    statuses = ["single", "divorced", "married", "separated", "widowed"], parents = ["Parents", "Not Parents"];

var margin = {top: 20, right: 10, bottom: 30, left: 65},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

//Handles brushing and updates scatterplot
//Brushing example used: http://bl.ocks.org/sebg/581e23a26c1074b9865e878873e880b3
function brushed() {

    var selection = d3.event.selection || Tx.range();
    x.domain(selection.map(Tx.invert, Tx));

    svgScatter.selectAll("circle")
        .attr("cx", function (d, i) {
            return x(X[i]);
        });

    xAxisCall.scale(x);
    xAxis.call(xAxisCall);
}

//Reads the data and filters the moments based on the current category
d3.csv("data/combinedData.csv").then(function (moments) {

    moments.forEach(function (moment) {
        if (moment.predicted_category === category) {
            filteredmoments.push(moment);
        }
    });

    //Prepares age X axis
    for (let i = 17; i < 99; i++)
        X.push(i);

    //Initializes charts
    Scatterplot = Scatterplot("#chart");
    Donut = Donut("#gender");
    Barchart = Barchart("#country");
    Stackedchart = Stackedchart("#house");
    Areachart = Areachart("#timeline");
});

//Updates page titles based on selected category
window.onload = function () {

    if ((category === "enjoy_the_moment") || (category === "enjoyment")) {
        document.getElementById("title").innerHTML = "Happy Moments About Enjoyment";
        document.title = "Enjoyment";
    } else {
        document.getElementById("title").innerHTML = "Happy Moments About "+category.charAt(0).toUpperCase() + category.substring(1);
        document.title = category.charAt(0).toUpperCase() + category.substring(1);
    }

    document.getElementById("reflection").addEventListener("change", function () {
        reflectionChanged();
    });
};

//Updates charts when drop down menu value changes
//Example used: http://bl.ocks.org/williaster/10ef968ccfdc71c30ef8
function reflectionChanged() {
    let dropdown_value = document.getElementById("reflection").value
    updateVisScatter(dropdown_value);
    updateVisDonut(dropdown_value);
    updateVisBar(dropdown_value);
    updateVisStack(dropdown_value);
    updateVisTime(dropdown_value);
}

//Update category when a new one is selected in the menu
function changeCategory(category) {
  if(category === "enjoyment") category = "enjoy_the_moment";
  
  d3.csv("data/combinedData.csv").then(function (moments) {

    if ((category === "enjoy_the_moment") || (category === "enjoyment")) {
        document.getElementById("title").innerHTML = "Happy Moments About Enjoyment";
        document.title = "Enjoyment";
    } else {
        document.getElementById("title").innerHTML = "Happy Moments About "+category.charAt(0).toUpperCase() + category.substring(1);
        document.title = category.charAt(0).toUpperCase() + category.substring(1);
    }

    document.getElementById("reflection").addEventListener("change", function () {
        reflectionChanged();
    });

      filteredmoments = [];
      moments.forEach(function (moment) {
          if (moment.predicted_category === category) {
              filteredmoments.push(moment);
          }
      });

      //Initializes charts
      filterBarChart();
      filterDonutChart();
      filterScatterplot();
      filterStackedChart();
      reflectionChanged();
  });
}
