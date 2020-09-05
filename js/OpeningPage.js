/*
*    OpeningPage.js - First page displayed to the user
*/

//Initializing an array of the different categories of moments (known in advance based on data), and making an empty array for each category
let categories = ["Achievement", "Affection", "Enjoyment", "Bonding", "Leisure", "Nature", "Exercise"];
let categoryFilter = {
    achievement: [],
    affection: [],
    enjoyment: [],
    bonding: [],
    leisure: [],
    nature: [],
    exercise: []
};

//Used to fetch a random moment on hovering
let randomNumber = 0;

function overviewMouseOver(){
        document.getElementById("overviewButton").style.color = "yellow";
};
function overviewMouseOut(){
        document.getElementById("overviewButton").style.color = "black";
};
function overviewMouseClick(){
              window.location.href = "/Practical3/Overview.html";
};

//Reading the data
d3.csv("data/cleaned_hm.csv").then(function (moments) {

    //Classifying each moment into the correct category array
    moments.forEach(function (moment) {
        switch (moment.predicted_category) {
            case "achievement":
                categoryFilter[Object.keys(categoryFilter)[0]].push(moment);
                break;
            case "affection":
                categoryFilter[Object.keys(categoryFilter)[1]].push(moment);
                break;
            case "enjoy_the_moment":
                categoryFilter[Object.keys(categoryFilter)[2]].push(moment);
                break;
            case "bonding":
                categoryFilter[Object.keys(categoryFilter)[3]].push(moment);
                break;
            case "leisure":
                categoryFilter[Object.keys(categoryFilter)[4]].push(moment);
                break;
            case "nature":
                categoryFilter[Object.keys(categoryFilter)[5]].push(moment);
                break;
            case "exercise":
                categoryFilter[Object.keys(categoryFilter)[6]].push(moment);
                break;
            default:
                break;
        }
    });

    //Information for rotating and placing categories around the sun (like rays)
    let x = [220, 480, 480, 140, 520, 880, 1320];
    let y = [600, 150, -250, -790, 1000, 960, 580];
    let textType = ["horizontal-text", "rotated-text-left-one", "rotated-text-left-two", "vertical-text", "rotated-text-right-one", "rotated-text-right-two", "horizontal-text"];

    let svg = d3.select("#svg");

    //Appending the categories around the sun
    for (let i = 0; i < 7; i++) {
        svg.append("text")
            .attr("x", x[i])
            .attr("y", y[i])
            .attr("text-anchor", "middle")
            .attr("class", textType[i])
            .text(categories[i])

            //When hovering over a category, it turns white and displays a random quote from that category in the sun
            .on("mouseenter", function () {

                //Turn white
                d3.select(this).transition().duration(200)
                    .style("fill", "white");

                //Get random moment short enough to fit in sun
                do {
                    randomNumber = Math.floor(Math.random() * categoryFilter[Object.keys(categoryFilter)[i]].length);

                } while ((categoryFilter[Object.keys(categoryFilter)[i]][randomNumber].num_sentence > 1) || (categoryFilter[Object.keys(categoryFilter)[i]][randomNumber].cleaned_hm.length > 50));

                //Add the moment to the screen
                svg.append("text")
                    .attr("x", (550 - categoryFilter[Object.keys(categoryFilter)[i]][randomNumber].cleaned_hm.length))
                    .style("text-align", "middle")
                    .attr("y", 500)
                    .attr("class", "intro-text")
                    .attr("id", "moment")
                    .html(categoryFilter[Object.keys(categoryFilter)[i]][randomNumber].cleaned_hm)
            })

            //When the mouse leaves a category, the moment displayed is removed and the category returns to black
            .on("mouseout", function (d) {
                d3.select(this).transition().duration(200).style("fill", "black");
                document.getElementById("moment").remove();
            })

            //When a category is clicked, the visualizations page is opened and that category is passed to that page for filtering
            .on("mousedown", function () {
                window.location.href = "/Practical3/Visualizations.html?Category=" + categories[i].toLowerCase();
            });
    }
  });
