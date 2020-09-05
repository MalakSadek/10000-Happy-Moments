/*
*    Overview.js - Overall totals for different categories.
*/

//The different categories and an array which holds how many moments exist for each category
var categoryCount = [0, 0, 0, 0, 0, 0, 0];
let categories = ["Affection", "Achievement", "Enjoyment", "Bonding", "Leisure", "Nature", "Exercise"];

//Read the data
d3.csv("data/combinedData.csv").then(function (moments) {

    //Count the number of moments for each category
    moments.forEach(function(moment){
        switch(moment.predicted_category){
            case "affection":
                categoryCount[0]+=1;
                break;
            case "achievement":
                categoryCount[1]+=1;
                break;
            case "enjoy_the_moment":
                categoryCount[2]+=1;
                break;
            case "bonding":
                categoryCount[3]+=1;
                break;
            case "leisure":
                categoryCount[4]+=1;
                break;
            case "nature":
                categoryCount[5]+=1;
                break;
            case "exercise":
                categoryCount[6]+=1;
                break;
            default: break;
        }
    });

    //Create the bar chart
    let svgDashedLine = d3.select("#chart").append("svg").attr("width", "0%").attr("height", "0%");
    let svgSmile = d3.select("#chart").append("svg").attr("width", "0%").attr("height", "0%");

    let svgBar = d3.select("#chart")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform",
            "translate(" + 300 + "," + 50 + ")");

    // X Axis
    let xBar = d3.scaleBand()
        .domain(categories.map(function (d) {
            return d;
        }))
        .range([0, 1350])
        .padding(0.2);

    let xAxisCall = d3.axisBottom(xBar);
    let xAxis = svgBar.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 500 + ")")
        .call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("text-anchor", "middle")
        .style("font-family", "KG HAPPY Solid")
        .style("font-size", "10pt");

    // Y Axis
    let yBar = d3.scaleLinear()
        .domain([0, d3.max(categoryCount, function (d, i) {
            return categoryCount[i];
        })])
        .range([500, 0]);

    let yAxisCall = d3.axisLeft(yBar);
    let yAxis = svgBar.append("g")
        .attr("class", "y axis")
        .call(yAxisCall)
        .style("font-family", "KG HAPPY Solid")
        .style("font-size", "10pt");

    // Create dashed line and smiley faces for aesthetic
    createPatterns(svgDashedLine, svgSmile);

    // Bars based on the category counts (dashes)
    let rects = svgBar.selectAll("rect")
        .data(categoryCount)
        .enter()
        .append("rect")
        .attr("y", function (d, i) {
            return yBar(categoryCount[i]);
        })
        .attr("x", function (d, i) {
            return xBar(categories[i]);
        })
        .attr("height", function (d, i) {
            return 500 - yBar(categoryCount[i]);
        })
        .attr("width", xBar.bandwidth)
        .style("fill", "url(#dashedLine)");

        //Adding the smiley faces
        let circles = svgBar.selectAll("circle")
            .data(categoryCount)
            .enter()
            .append("circle")
            .attr("cy", function (d, i) {
                return yBar(categoryCount[i]);
            })
            .attr("cx", function (d, i) {
                return xBar(categories[i])+75;
            })
            .attr("r", function () {
                return 20;
            })
            .style("fill", "url(#smile)")
            //Hovering on a bar displays the total number of moments
            .on("mouseenter", function (d, i) {
                mousemoveBar(d3.select(this), i);
            })
            .on("mouseout", function () {
                stopTrackingBar(d3.select(this));
            })
            //Clicking on a bar shows more information about that category
            .on("mousedown", function (d, i) {
                window.location.href = "/Practical3/Visualizations.html?Category=" + categories[i].toLowerCase();
            });

    //Showing the tooltip with the number of moments
    function mousemoveBar(d, i) {
        d.transition().duration(200).style("stroke", "black").style("stroke-width", "1px");
        svgBar.append("text")
            .attr("id", "tooltip")
            .attr("class", "tooltip-text")
            .attr("background-color", "white")
            .attr("x", xBar(categories[i])+100)
            .attr("y", yBar(categoryCount[i]) - 10)
            .text(categoryCount[i] + " Moments");

        svgBar.append("line")
                .attr("id", "hhl")
                .attr("class", "hover-line")
                .attr("y1", yBar(categoryCount[i]))
                .attr("y2", yBar(categoryCount[i]))
                .attr("x1", xBar(categories[i])+(50))
                .attr("x2", xBar(0));
    }

    //Removing the tooltip showing the number of moments
    function stopTrackingBar(d) {
       document.getElementById("tooltip").remove();
       document.getElementById("hhl").remove();
       d.transition().duration(200).style("stroke-width", "0");
    }

    //Formatting the axes
    svgBar.select(".y.axis")
        .append("text")
        .text("Happy Moments")
        .attr("fill", "black")
        .attr("font-size", "20px")
        .attr("y", "-30")
        .attr("x", "105")
        .attr("font-family", "KG HAPPY Solid");

    svgBar.select(".x.axis")
        .append("text")
        .text("Category")
        .attr("fill", "black")
        .attr("font-size", "20px")
        .attr("x", "700")
        .attr("y", "60")
        .attr("font-family", "KG HAPPY Solid");
});

// Create dashed line and smiley faces for aesthetic
//How to use patterns from: stackoverflow.com/questions/17776641/fill-rect-with-pattern
function createPatterns(svgDashedLine, svgSmile) {
    svgDashedLine
        .append('defs')
        .append('pattern')
        .attr('id', 'dashedLine')
        .attr('width', "1")
        .attr('height', "10")
        .attr("x", 0.11)
        .attr("y", 0)
        .append('svg:image')
        .attr("xlink:href", "backgroundDashed.png");

    svgSmile
        .append('defs')
        .append('pattern')
        .attr('id', 'smile')
        .attr('width', "1")
        .attr('height', "1")
        .attr("x", 0)
        .attr("y", 0)
        .append('svg:image')
        .attr("xlink:href", "smile.png")
        .attr('width', "80")
        .attr('height', "80")
        .attr("x", -20)
        .attr("y", -20);
}
