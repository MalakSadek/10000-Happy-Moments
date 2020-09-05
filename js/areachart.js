/*
* Timeline.js - Shows an area chart of the scatterplot that allows brushing other charts
*/

//Initializing the area chart when it's first created
Areachart = function (_parentElement) {
    this.parentElement = _parentElement;
    initVisTime();
};

var svgArea, g, Ty, TxAxisCall, TxAxis, area, areaPath, brush, brushComponent;

initVisTime = function () {

    //Prepares data structures for filtering by day or by month
    filterScatterplot();

    margin = {top: 0, right: 100, bottom: 30, left: 80};
    width = 800 - margin.left - margin.right;
    height = 130 - margin.top - margin.bottom;

    //Creating the chart
    svgArea = d3.select("#timeline").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    g = svgArea.append("g")
        .attr("transform", "translate(" + 70 + "," + 40 + ")");

    //X Axis
    Tx = d3.scaleLinear()
        .range([0, 1000]);

    Tx.domain([0, d3.max(X)]);

    TxAxisCall = d3.axisBottom()
        .ticks(4);

    TxAxis = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

    //Y Axis
    Ty = d3.scaleLinear()
        .range([height, 0]);

    Ty.domain([0, d3.max(ageCount, function (d) {
        return d;
    })]);

    TxAxisCall.scale(Tx);

    TxAxis.transition(200).call(TxAxisCall);

    //Creating the area
    createArea();


    d3.select(".x.axis")
        .append("text")
        .text("Age (Years)")
        .attr("x", 950)
        .attr("y", 160)
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("font-family", "KG HAPPY Solid");

};


updateVisTime = function (filterBy) {

    //Filter depending on the given value from the drop down menu
    if (filterBy === "24h") {
        ageCount = ageCountDay;
    } else {
        ageCount = ageCountMonth;
    }

    //Update axes and area
    svgArea.selectAll("path").remove();
    svgArea.selectAll("brush").remove();
    svgArea.selectAll("g").remove();
    g.selectAll("g").remove();

    g = svgArea.append("g")
        .attr("transform", "translate(" + 70 + "," + 40 + ")");
    TxAxis = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");


    Tx.domain([0, d3.max(X)]);
    Ty.domain([0, d3.max(ageCount, function (d) {
        return d;
    })]);

    TxAxisCall.scale(Tx);

    TxAxis.transition(200).call(TxAxisCall);

    createArea();
};

function createArea() {

    //Creates an area chart based on scatterplot data
    areaPath = g.append("path")
        .attr("fill", "yellow");

    area = d3.area()
        .x(function (d, i) {
            return Tx(X[i]);
        })
        .y0(height)
        .y1(function (d, i) {
            return Ty(ageCount[i]);
        });

    areaPath
        .data([ageCount])
        .attr("d", area);

//Brushing example used: http://bl.ocks.org/sebg/581e23a26c1074b9865e878873e880b3

    //Creating the brushing component
    brush = d3.brushX()
        .handleSize(10)
        .extent([[0, 0], [width, height]])
        .on("brush", brushed);

    // Append brush component
    brushComponent = g.append("g")
        .attr("class", "brush")
        .on("mousedown", brushed)
        .call(brush);
}
