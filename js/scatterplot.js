/*
* Scatterplot.js - shows the number of moments per age
*/

//Initializing the scatterplot chart when it's first created
Scatterplot = function (parentElement) {
    this.parentElement = parentElement;
    initVisScatter();
};
var x, xAxisCall, xAxis, y, yAxisCall, yAxis, svgScatter, brush, ageCountDay, ageCountMonth, filteredX;

initVisScatter = function () {

    //Prepares data structures for filtering by day or by month, then sets it to day by default
    filterScatterplot();
    ageCount = ageCountDay;

    //Appends SVG for chart
    svgScatter = d3.select("#chart")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform",
            "translate(" + 80 + "," + 20 + ")");

    //X Axis
    x = d3.scaleLinear()
        .domain([0, d3.max(X)])
        .range([0, 1000]);

    xAxisCall = d3.axisBottom(x);

    xAxis = svgScatter.append("g")
        .attr("transform", "translate(0," + 500 + ")")
        .attr("class", "x axis")
        .call(xAxisCall);

    //Y Axis
    y = d3.scaleLinear()
        .domain([0, d3.max(ageCount)])
        .range([500, 0]);

    yAxisCall = d3.axisLeft(y);
    yAxis = svgScatter.append("g")
        .attr("class", "y axis")
        .attr("width", "1%")
        .call(yAxisCall);

    // Add dots to the scatterplot
    createCircles();

    //Format Axes
    d3.select(".y.axis")
        .append("text")
        .text("Total Number of Happy Moments")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("y", "-7")
        .attr("x", "150")
        .attr("font-family", "KG HAPPY Solid");

    d3.select(".x.axis")
        .append("text")
        .text("Age (Years)")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("x", "950")
        .attr("y", "40")
        .attr("font-family", "KG HAPPY Solid");
};

updateVisScatter = function (filterBy) {

    X = [];
    //Prepares age X axis
    for (let i = 17; i < 99; i++)
        X.push(i);

    //Filter depending on the given value from the drop down menu
    if (filterBy === "24h") {
        ageCount = ageCountDay;
    } else {
        ageCount = ageCountMonth;
    }

    x.domain([0, d3.max(X)]).range([0, 1000]);
    y.domain([0, d3.max(ageCount)]).range([500, 0]);

    // Update Axis
    yAxisCall.scale(y);
    yAxis.transition(200).call(yAxisCall);
    xAxisCall.scale(x);
    xAxis.transition(200).call(xAxisCall);

    //Remove old dots
    svgScatter.selectAll("circle").remove();

    createCircles();
};

//Create circles and show tooltips on hover
function createCircles() {

    //Adds points
    svgScatter.append('g')
        .selectAll("circle")
        .data(X)
        .enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return x(X[i]);
        })
        .attr("cy", function (d, i) {
            return y(ageCount[i]);
        })
        .attr("r", 6)
        .style("fill", "yellow")
        .style("stroke", "black")
        .on("mouseenter", function (d, i) {
            mousemove(d3.select(this), i)
        })
        .on("mouseout", function () {
            stopTracking(d3.select(this))
        });

    //Handles hover logic (tooltips)
    function mousemove(d, i) {
        d.transition().duration(200).style("fill", "white").style("r", 8);
        svgScatter.append("line")
            .attr("id", "hhl")
            .attr("class", "hover-line")
            .attr("y1", y(ageCount[i])+6)
            .attr("y2", y(0))
            .attr("x1", x(X[i]))
            .attr("x2", x(X[i]));
        svgScatter.append("line")
            .attr("id", "vhl")
            .attr("class", "hover-line")
            .attr("y1", y(ageCount[i]))
            .attr("y2", y(ageCount[i]))
            .attr("x1", x(X[i])-6)
            .attr("x2", x(0));
        svgScatter.append("text")
            .attr("id", "tooltip")
            .attr("class", "tooltip-text")
            .attr("background-color", "white")
            .attr("x", x(X[i])-10)
            .attr("y", y(ageCount[i] + 20))
            .text( X[i]+ " years, " + ageCount[i] + " moment(s)")

    }

    //Handles mouse exiting hover
    function stopTracking(d) {
        d.transition().duration(200).style("fill", "yellow").style("r", 6);
        document.getElementById("hhl").remove();
        document.getElementById("vhl").remove();
        document.getElementById("tooltip").remove();
    }
}

//Prepares data filtered by day and month first time the chart is created to speed up transitions later on
function filterScatterplot() {
    let countDay = 0, countMonth = 0, i, j;

    ageCountMonth = [];
    ageCountDay = [];

    for (i = 17; i < 99; i++) {
        for (j = 0; j < filteredmoments.length; j++) {
            if (parseFloat(filteredmoments[j].age) === parseFloat(i)) {
                if (filteredmoments[j].reflection_period === "24h") {
                    countDay += 1;
                } else {
                    countMonth += 1;
                }
            }
        }
        ageCountDay.push(countDay);
        ageCountMonth.push(countMonth);
        countDay = 0;
        countMonth = 0;
    }
}
