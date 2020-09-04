# 10000-Happy-Moments
A website showing visualizations of people's happiest moments😃📊 (2020).

![picture alt](https://github.com/MalakSadek/10000-Happy-Moments/blob/master/screenshot.png "Screenshot")

This project looked at using `D3.js` to visualize people's happy moments. This was done using a dataset called HappyDB. It is a compilation of 100,000 happy moments crowd-sourced from different people. It was put together by Megagon Labs, who have made it publicly available and are using it to test how the reasons behind people’s happiness can be extracted from text inputs to then offer suggestions and make people even happier. The happy moments were collected using Mechanical Turk (MTurk) by asking people to reflect on the past day, week, or month and then write down three happy events that happened during that duration. Some minor data cleaning took place using a Python script.

Each page on the website has its own `HTML` and corresponding `JavaScript` file. Additionally, each chart is implemented in a separate `JavaScript` file to support modularity and object orientation. No external JavaScript libraries were used except for `D3`, and `Bootstrap` was used to create a grid based layout. 

The opening page reads the underlying data and filters each moment based on its category to be able to display a random quote within the sun (using a random number generator). The categories are added to the `SVG` as text items which have mouse enter, mouse out, and mouse down events.

The visualizations page reads the chosen category from the URL (which is modified based on the selection from the opening page, or overview page) or changes categories dynamically when a new one is selected from the menu. It then uses that to filter the moments by category and creates all the charts. It also dynamically updates the title based on the chosen category and updates the charts when the reflection period filter’s value changes. Finally, it also handles the brushing logic.

Each visualization file starts by filtering the data as needed. This mainly consists of counting the relevant data points since all the charts show counts. Based on the current reflection period filter, the appropriate data structure is selected and read. The axes are created and formatted and then the marks and their interactive events are created in a separate function. Finally, each chart has an update function which updates the chart dynamically when the filter value is changed.

Finally, the overview page counts the moments in each category without any filters applied and simply creates the bar chart and its interaction features while adding the aesthetics to the bars.

# Insights Gained

Directly from the overview chart, it can be identified that “achievement” and “affection” are the categories resulting in the most happy moments, and “nature” and “exercise" contribute the least. By exploring the opening page, it can also be acknowledged that the moments in “achievement” revolve around work and personal accomplishments, and in “affection” around family and friends. Furthermore, going into the individual categories pages, viewers can discover that most moments for both are contributed by 25-30 year olds while more females mentioned affectionate moments over ones involving achievement (and vice versa for men). Similarly, more people in India mentioned moments including affection over achievement. While single people contributed the most moments in both categories, more people who weren’t parents mentioned moments revolving around affection which was surprising.

# Try Out the Website

The website can be accessed at: 

More information about the context of the project and the design process followed can be found at: 

# Contact

* email: mfzs1@st-andrews.ac.uk
* LinkedIn: www.linkedin.com/in/malak-sadek-17aa65164/
* website: https://malaksadek.wordpress.com/


