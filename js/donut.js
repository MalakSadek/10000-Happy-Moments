/*
* Scatterplot.js - shows the number of moments per gender
*/

//Initializing the donut chart when it's first created
Donut = function (parentElement) {
    this.parentElement = parentElement;
    initVisDonut();
};

var svgDonut, color, pie, arc, genderCountDay, genderCountMonth;

initVisDonut = function () {

    //Prepares data structures for filtering by day or by month, then sets it to day by default
    filterDonutChart();
    genderCount = genderCountDay;

    //Appends SVG for chart
    svgDonut = d3.select("#gender")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform",
            "translate(" + 200 + "," + 300 + ")");

    //Creates the color scale for the pie
    color = d3.scaleOrdinal()
        .range(["#FFFF99", " #ec971f", "chocolate"]);

    //Creates the pie segments sizes
    pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d;
        });

    createSegments();

};

updateVisDonut = function (filterBy) {

    //Filter depending on the given value from the drop down menu
    if (filterBy === "24h") {
        genderCount = genderCountDay;
    } else {
        genderCount = genderCountMonth;
    }

    //Update segment values
    pie.value = function (d) {
        return d;
    };

    //Remove old segments and labels
    svgDonut.selectAll(".arc").remove();
    svgDonut.selectAll("path").remove();
    svgDonut.selectAll("text").remove();

    createSegments();
};

//Adds pie segments and their tooltips
function createSegments() {

    //Makes it donut vs pie chart
    arc = d3.arc()
        .outerRadius(100)
        .innerRadius(80);

    svgDonut
        .selectAll('.arc')
        .data(pie(genderCount))
        .enter()
        .append('g')
        .attr('class', "arc")
        .append("path").attr("d", arc).style("fill", function (d, i) {
        return color(genderCount[i])
    }).style("stroke", "black")
        .on("mouseover", function (d, i) {
            mousemoveDonut(d3.select(this), i)
        })
        .on("mouseout", function (d, i) {
            stopTrackingDonut(d3.select(this), i)
        });

    function mousemoveDonut(d, i) {
        d.transition().duration(200).style("fill", "white");
        svgDonut.append("text")
            .attr("id", "tooltip")
            .attr("class", "tooltip-text")
            .attr("x", -50)
            .attr("y", 5)
            .text(genders[i] + ": " + genderCount[i] + " Moments")
    }

    function stopTrackingDonut(d, i) {
        if (i === 0)
            d.transition().duration(200).style("fill", "#FFFF99");
        else if (i === 1)
            d.transition().duration(200).style("fill", "#ec971f");
        else
            d.transition().duration(200).style("fill", "chocolate");
        document.getElementById("tooltip").remove();
    }

    //Adds labels to pie segments - obtained from: https://www.d3-graph-gallery.com/graph/donut_label.html
    svgDonut
        .selectAll('allLabels')
        .data(pie(genderCount))
        .enter()
        .append('text')
        .text(function (d, i) {
            if (i === 0) return "Males"; else if (i === 1) return "Females";
        })
        .attr('transform', function (d) {
            var pos = arc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = 50 * 2.2 * (midangle < Math.PI ? 1 : -1);
            pos[1] = pos[1] - 5;
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', function (d) {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return (midangle < Math.PI ? 'start' : 'end')
        }).style("font-family", "KG HAPPY Solid");
}

//Prepares data filtered by day and month first time the chart is created to speed up transitions later on
function filterDonutChart() {
    let countDay = 0, countMonth = 0, i, j;

    genderCountMonth = [];
    genderCountDay = [];

    for (i = 0; i < genders.length; i++) {
        for (j = 0; j < filteredmoments.length; j++) {
            if (filteredmoments[j].gender === genders[i]) {
                if (filteredmoments[j].reflection_period === "24h") {
                    countDay += 1;
                } else {
                    countMonth += 1;
                }
            }
        }

        genderCountMonth.push(countMonth);
        genderCountDay.push(countDay);
        countMonth = 0;
        countDay = 0;
    }
}
