/*
* Barchart.js - shows the number of moments per country, due to the data, all other countries besides India and USA are aggregated.
*/

var Bx, BxAxisCall, BxAxis, By, ByAxisCall, ByAxis, svgBar, rects, countryCountDay, countryCountMonth;

//Initializing the bar chart when it's first created
Barchart = function (parentElement) {
    this.parentElement = parentElement;
    initVisBar();
};

initVisBar = function () {

    //Prepares data structures for filtering by day or by month, then sets it to day by default
    filterBarChart();
    countryCount = countryCountDay;

    //Creating the bar chart
    svgBar = d3.select("#country")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // X Axis
    Bx = d3.scaleBand()
        .domain(countries.map(function (d) {
            return d
        }))
        .range([0, 300])
        .padding(0.2);

    BxAxisCall = d3.axisBottom(Bx);
    BxAxis = svgBar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 220 + ")")
        .call(BxAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("text-anchor", "middle");

    // Y Axis
    By = d3.scaleLinear()
        .domain([0, d3.max(countryCount, function (d, i) {
            return countryCount[i];
        })])
        .range([220, 0]);

    ByAxisCall = d3.axisLeft(By);
    ByAxis = svgBar.append("g")
        .attr("class", "y axis")
        .call(ByAxisCall);

    //Bars
    createBars();

    //Formatting Axes
    svgBar.select(".y.axis")
        .append("text")
        .text("Total Number of Happy Moments")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("y", "-10")
        .attr("x", "150")
        .attr("font-family", "KG HAPPY Solid");

    svgBar.select(".x.axis")
        .append("text")
        .text("Country Code")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("x", "300")
        .attr("y", "30")
        .attr("font-family", "KG HAPPY Solid");

};

updateVisBar = function (filterBy) {

    //Filter depending on the given value from the drop down menu
    if (filterBy === "24h") {
        countryCount = countryCountDay;
    } else {
        countryCount = countryCountMonth;
    }

    By.domain([0, d3.max(countryCount, function (d, i) {
        return countryCount[i];
    })]).range([220, 0]);

    ByAxisCall.scale(By);
    ByAxis.transition(200).call(ByAxisCall);

    //Remove old bars
    svgBar.selectAll("rect").remove();

    //Add new bars
    createBars()

};

//Create bars and show tooltips on hover
function createBars() {
    rects = svgBar.append("g")
        .selectAll("rect")
        .data(countryCount)
        .enter()
        .append("rect")
        .attr("y", function (d, i) {
            return By(countryCount[i]);
        })
        .attr("x", function (d, i) {
            return Bx(countries[i])
        })
        .attr("height", function (d, i) {
            return 220 - By(countryCount[i]);
        })
        .attr("width", Bx.bandwidth)
        .attr("fill", "yellow")
        .attr("stroke", "black")
        .on("mouseenter", function (d, i) {
            mousemoveBar(d3.select(this), i)
        })
        .on("mouseout", function () {
            stopTrackingBar(d3.select(this))
        });

    function mousemoveBar(d, i) {
        d.transition().duration(200).style("fill", "white");
        svgBar.append("text")
            .attr("id", "tooltip")
            .attr("class", "tooltip-text")
            .attr("background-color", "white")
            .attr("x", Bx(countries[i])-10)
            .attr("y", By(countryCount[i]) + 13)
            .text(countryCount[i]+" Moments")
    }

    function stopTrackingBar(d) {
        d.transition().duration(200).style("fill", "yellow");
        document.getElementById("tooltip").remove();
    }
}

//Prepares data filtered by day and month first time the chart is created to speed up transitions later on
function filterBarChart() {
    let countDay = 0, countMonth = 0, i, j;
    countryCountDay = [];
    countryCountMonth = [];

    for (i = 0; i < countries.length; i++) {
        for (j = 0; j < filteredmoments.length; j++) {
            if (filteredmoments[j].country === countries[i]) {
                if (filteredmoments[j].reflection_period === "24h") {
                    countDay += 1;
                } else {
                    countMonth += 1;
                }

            }

            if (i === 2) {
                if (filteredmoments[j].country !== "USA" && filteredmoments[j].country !== "IND") {
                    if (filteredmoments[j].reflection_period === "24h") {
                        countDay += 1
                    } else {
                        countMonth += 1
                    }
                }
            }
        }
        countryCountDay.push(countDay);
        countryCountMonth.push(countMonth);
        countDay = 0;
        countMonth = 0;
    }
}
