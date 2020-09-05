/*
* Stackedchart.js - shows the number of moments per martial status, also broken down by whether people are parents
*/

//Initializing the stacked bar chart when it's first created
Stackedchart = function (parentElement) {
    this.parentElement = parentElement;
    initVisStack();
};
var Sx, SxAxisCall, SxAxis, Sy, Sy1, Sy2, SyAxisCall, SyAxis, svgStack, legendRow, legend, colors;

//Structures to hold counts
let statusCountDay = {
    parents: {singleParent: 0, divorcedParent: 0, marriedParent: 0, separatedParent: 0, widowedParent: 0},
    notParents: {
        singleNotParent: 0,
        divorcedNotParent: 0,
        marriedNotParent: 0,
        separatedNotParent: 0,
        widowedNotParent: 0
    }
};

let statusCountMonth = {
    parents: {singleParent: 0, divorcedParent: 0, marriedParent: 0, separatedParent: 0, widowedParent: 0},
    notParents: {
        singleNotParent: 0,
        divorcedNotParent: 0,
        marriedNotParent: 0,
        separatedNotParent: 0,
        widowedNotParent: 0
    }
};

initVisStack = function () {

    //Prepares data structures for filtering by day or by month, then sets it to day by default
    filterStackedChart();
    statusCount = statusCountDay;
    svgStack = d3.select("#house")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform",
            "translate(" + 70 + "," + 60 + ")");

    // X Axis
    Sx = d3.scaleBand()
        .domain(statuses.map(function (d) {
            return d
        }))
        .range([0, 400])
        .padding(0.2);

    SxAxisCall = d3.axisBottom(Sx);

    SxAxis = svgStack.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 200 + ")")
        .call(SxAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("text-anchor", "middle");

    // Y Axis (total)
    Sy = d3.scaleLinear()
        .domain([0, d3.max(Object.values(statusCount.parents), function (d, i) {
            return Object.values(statusCount.parents)[i] + Object.values(statusCount.notParents)[i];
        })])
        .range([225, 0]);

    // Y Axis (Parents)
    Sy1 = d3.scaleLinear()
        .domain([0, d3.max(Object.values(statusCount.parents), function (d, i) {
            return Object.values(statusCount.parents)[i];
        })])
        .range([100, 0]);

    // Y Axis (Not Parents)
    Sy2 = d3.scaleLinear()
        .domain([0, d3.max(Object.values(statusCount.notParents), function (d, i) {
            return Object.values(statusCount.notParents)[i];
        })])
        .range([0, 200]);

    SyAxisCall = d3.axisLeft(Sy).ticks(10);

    SyAxis = svgStack.append("g")
        .attr("class", "y axis")
        .call(SyAxisCall)
        .attr("transform", "translate(0," + -25 + ")");

    //Creating the two stacked charts
    createStacks();

    //Formatting Axes
    svgStack.select(".y.axis")
        .append("text")
        .text("Total Number of Happy Moments")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("y", "-7")
        .attr("x", "140")
        .attr("font-family", "KG HAPPY Solid");

    svgStack.select(".x.axis")
        .append("text")
        .text("Martial Status")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("x", "350")
        .attr("y", "40")
        .attr("font-family", "KG HAPPY Solid");

};

//Adding the two different stacks for each bar with tooltips
function createStacks() {

    //Stack one (parents)
    svgStack.selectAll("rect")
        .data(Object.values(statusCount.parents))
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return Sx(statuses[i]);
        })
        .attr("y", function (d, i) {
            return 100 + Sy1(Object.values(statusCount.parents)[i]);
        })
        .attr("height", function (d, i) {
            return 100 - Sy1(Object.values(statusCount.parents)[i]);
        })
        .attr("width", Sx.bandwidth)
        .style("fill", "yellow")
        .style("stroke", "black")
        .on("mouseover", function (d, i) {
            mousemoveStack(d3.select(this), i, 0)
        })
        .on("mouseout", function (d, i) {
            stopTrackingStack(d3.select(this), i, 0)
        });

    //Stack two (not parents)

//How to use patterns from: stackoverflow.com/questions/17776641/fill-rect-with-pattern
    svgStack
        .append('defs')
        .append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)
        .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#000000')
        .attr('stroke-width', 1);

    svgStack.selectAll("square")
        .data(Object.values(statusCount.notParents))
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return Sx(statuses[i]);
        })
        .attr("y", function (d, i) {
            return (100 + Sy1(Object.values(statusCount.parents)[i]) - Sy2(Object.values(statusCount.notParents)[i]))
        })
        .attr("height", function (d, i) {
            return Sy2(Object.values(statusCount.notParents)[i]);
        })
        .attr("width", Sx.bandwidth)
        .style("fill", "yellow")
        .style("stroke", "black")
        .on("mouseover", function (d, i) {
            mousemoveStack(d3.select(this), i, 1)
        })
        .on("mouseout", function (d, i) {
            stopTrackingStack(d3.select(this), i, 1)
        });

    //Adds the hashing pattern on top of the yellow rectangle
    svgStack.selectAll("square")
        .data(Object.values(statusCount.notParents))
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return Sx(statuses[i]);
        })
        .attr("y", function (d, i) {
            return (100 + Sy1(Object.values(statusCount.parents)[i]) - Sy2(Object.values(statusCount.notParents)[i]))
        })
        .attr("height", function (d, i) {
            return Sy2(Object.values(statusCount.notParents)[i]);
        })
        .attr("width", Sx.bandwidth)
        .style("fill", "url(#diagonalHatch)")
        .style("stroke", "black")
        .on("mouseover", function (d, i) {
            mousemoveStack(d3.select(this), i, 1)
        })
        .on("mouseout", function (d, i) {
            stopTrackingStack(d3.select(this), i, 1)
        });

    //Handles hovering functions (tooltips)
    function mousemoveStack(d, i, n) {
        d.transition().duration(200).style("fill", "white");
        let tooltipText = svgStack.append("text")
            .attr("id", "tooltip")
            .attr("class", "tooltip-text")
            .attr("x", Sx(statuses[i]) - 10)
            .attr("y", Sy1(statusCount.parents[i]) - Sy2(statusCount.notParents[i]));
        if (n === 0) {
            tooltipText.text(Object.values(statusCount.parents)[i] + " Moments");
        } else {
            tooltipText.text(Object.values(statusCount.notParents)[i] + " Moments");
        }

    }

    function stopTrackingStack(d, i, n) {
        if (n === 0) {
            d.transition().duration(200).style("fill", "yellow");
        } else {
            d.transition().duration(200).style("fill", "url(#diagonalHatch)");
        }
        document.getElementById("tooltip").remove();
    }

    //Adding a legend
    legend = svgStack.append("g").attr("transform", "translate(400, -150)");
    parents.forEach(function (choice, i) {
        legendRow = legend.append("g").attr("transform", "translate(0, " + (200 + (i * 20)) + ")");
        legendRow.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "yellow")
            .attr("stroke", "black");

        legendRow.append("text")
            .attr("x", -10)
            .attr("y", 10)
            .style("font-family", "KG HAPPY Solid")
            .attr("text-anchor", "end")
            .text(choice);

        if (i === 1) {
            legendRow = legend.append("g").attr("transform", "translate(0, " + 220 + ")");
            legendRow.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", "url(#diagonalHatch)")
                .attr("stroke", "black");
        }
    });
}


updateVisStack = function (filterBy) {

    //Filter depending on the given value from the drop down menu
    if (filterBy === "24h") {
        statusCount = statusCountDay;
    } else {
        statusCount = statusCountMonth;
    }

    //Updating Axes
    Sy
        .domain([0, d3.max(Object.values(statusCount.parents), function (d, i) {
            return Object.values(statusCount.parents)[i] + Object.values(statusCount.notParents)[i];
        })])
        .range([225, 0]);

    Sy2
        .domain([0, d3.max(Object.values(statusCount.notParents), function (d, i) {
            return Object.values(statusCount.notParents)[i];
        })])
        .range([0, 200]);

    Sy1
        .domain([0, d3.max(Object.values(statusCount.parents), function (d, i) {
            return Object.values(statusCount.parents)[i];
        })])
        .range([100, 0]);

    SyAxisCall.scale(Sy);
    SyAxis.transition(200).call(SyAxisCall);

    //Remove old stacks
    svgStack.selectAll("rect").remove();
    svgStack.selectAll("square").remove();

    createStacks();
};

//Prepares data filtered by day and month first time the chart is created to speed up transitions later on
function filterStackedChart() {
    let j;

    //Resetting all values
    statusCountDay.parents.divorcedParent = 0;
    statusCountDay.parents.marriedParent = 0;
    statusCountDay.parents.separatedParent = 0;
    statusCountDay.parents.singleParent = 0;
    statusCountDay.parents.widowedParent = 0;
    statusCountDay.notParents.divorcedNotParent = 0;
    statusCountDay.notParents.marriedNotParent = 0;
    statusCountDay.notParents.separatedNotParent = 0;
    statusCountDay.notParents.singleNotParent = 0;
    statusCountDay.notParents.widowedNotParent = 0;
    statusCountMonth.parents.divorcedParent = 0;
    statusCountMonth.parents.marriedParent = 0;
    statusCountMonth.parents.separatedParent = 0;
    statusCountMonth.parents.singleParent = 0;
    statusCountMonth.parents.widowedParent = 0;
    statusCountMonth.notParents.divorcedNotParent = 0;
    statusCountMonth.notParents.marriedNotParent = 0;
    statusCountMonth.notParents.separatedNotParent = 0;
    statusCountMonth.notParents.singleNotParent = 0;
    statusCountMonth.notParents.widowedNotParent = 0;

    for (j = 0; j < filteredmoments.length; j++) {

        if (filteredmoments[j].parenthood === 'y') {
            switch (filteredmoments[j].marital) {
                case "married":
                    if (filteredmoments[j].reflection_period === "24h") statusCountDay.parents.marriedParent += 1;
                    else statusCountMonth.parents.marriedParent += 1;
                    break;
                case "divorced":
                    if (filteredmoments[j].reflection_period === "24h") statusCountDay.parents.divorcedParent += 1;
                    else statusCountMonth.parents.divorcedParent += 1;
                    break;
                case "single":
                    if (filteredmoments[j].reflection_period === "24h") statusCountDay.parents.singleParent += 1;
                    else statusCountMonth.parents.singleParent += 1;
                    break;
                case "separated":
                    if (filteredmoments[j].reflection_period === "24h") statusCountDay.parents.separatedParent += 1;
                    else statusCountMonth.parents.separatedParent += 1;
                    break;
                case "widowed":
                    if (filteredmoments[j].reflection_period === "24h") statusCountDay.parents.widowedParent += 1;
                    else statusCountMonth.parents.widowedParent += 1;
                    break;
                default:
                    break;
            }
        } else {
            switch (filteredmoments[j].marital) {
                case "married":
                    if (filteredmoments[j].reflection_period === "24h") statusCountDay.notParents.marriedNotParent += 1;
                    else statusCountMonth.notParents.marriedNotParent += 1;
                    break;
                case "divorced":
                    if (filteredmoments[j].reflection_period === "24h") statusCountDay.notParents.divorcedNotParent += 1;
                    else statusCountMonth.notParents.divorcedNotParent += 1;
                    break;
                case "single":
                    if (filteredmoments[j].reflection_period === "24h") statusCountDay.notParents.singleNotParent += 1;
                    else statusCountMonth.notParents.singleNotParent += 1;
                    break;
                case "separated":
                    if (filteredmoments[j].reflection_period === "24h") statusCountDay.notParents.separatedNotParent += 1;
                    else statusCountMonth.notParents.separatedNotParent += 1;
                    break;
                case "widowed":
                    if (filteredmoments[j].reflection_period === "24h") statusCountDay.notParents.widowedNotParent += 1;
                    else statusCountMonth.notParents.widowedNotParent += 1;
                    break;
                default:
                    break;
            }
        }
    }

}
