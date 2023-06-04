let isBarClicked = false;
let isSorted = false;
let currentSortKey = "";

function showLegend(svg, states) {
	const numBars = 8;
	const moveRight = 900
	// const colors = ["#FF0000", "#00FF00", "#FFFF00", "#FF00FF", "#00FFFF", "#800080", "#0000FF", "#008080"]
	const colors = ["#1f77b4", "gray", "#2ca02c", "#d62728", "#9467bd", "#ff7f0e", "#f2cfe5", "#17becf"];
	stateNames = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"]

	for (let i = 0; i < numBars; i++) {
		svg
			.append("circle")
			.attr("cx", moveRight + 140)
			.attr("cy", 30 + (i * 20))
			.attr("r", 6)
			.attr("class", "legend_circle")
			.style("fill", colors[i])
		svg
			.append("text")
			.attr("x", moveRight + 150)
			.attr("y", 30 + (i * 20))
			.text(stateNames[i])
			.style("font_circle", "15px")
			.attr("alignment-baseline", "middle")
			.attr("class", "legend_text")
	}
}



// Function to sort the bars
function sortBars(data) {
	// Toggle the sorting state
	isSorted = !isSorted;

	// Determine the sort key based on the sorting state
	const sortKey = isSorted ? "ascending" : "descending";

	// Sort the data based on the sort key
	data.sort((a, b) => {
		if (sortKey === "ascending") {
			return d3.ascending(a[currentSortKey], b[currentSortKey]);
		} else {
			return d3.descending(a[currentSortKey], b[currentSortKey]);
		}
	});
	// Update the current sort key
	currentSortKey = isSorted ? "value" : ""; // Modify this line based on your data structure
}




function barChartOne(data, margin, width, height) {

	// append the svg object to the body of the page
	const svg = d3.select("#chartOne")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	// Parse the Data
	const states = data.columns.slice(1)
	showGraph(data, width, height, svg, 70, states)
	showLegend(svg, states)
}

function barChartTwo(data, margin, width, height) {
	// append the svg object to the body of the page
	const svg = d3.select("#chartTwo")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	const states = data.columns.slice(1)
	showGraph(data, width, height, svg, 100, states)
	showLegend(svg, states)
}

function barChartThree(data, margin, width, height) {
	const svg = d3.select("#chartThree")
		.append("svg")
		.attr("id", "chart-svg") // Add ID to the SVG element
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	const states = data.columns.slice(1)
	console.log("states are: " + states)
	showGraph(data, width, height, svg, 80, states)
	showLegend(svg, states)
}
function highLightBar(state, svg, dataValueLabels) {
	// Undo the effects of mouseover
	// duration = 500
	duration = 500
	svg.selectAll("g:not(#chart-group)")
		.transition()
		.duration(duration)
		.ease(d3.easeQuadIn)
		.attr("opacity", (d) => {
			return 1;
		});


	const bars = svg.selectAll(".bar");
	bars
		// .transition()
		// .duration(duration)
		// .ease(d3.easeCubic)
		.style("opacity", function (d) {
			return (d.key === state || !isBarClicked) ? 1 : 0.2;
		})

	dataValueLabels
		// .transition()
		// .duration(duration)
		.style("opacity", function (d) {
			return (d.key === state || !isBarClicked) ? 1 : 0;
		})
}

function showGraph(data, width, height, svg, domain, subgroups) {
	//CODE  derives inspirationf from: https://d3-graph-gallery.com/graph/barplot_grouped_basicWide.html
	console.table(data)

	// List of groups = species here = value of the first column called group -> I show them on the X axis
	const groups = d3.map(data, function (d) { return (d.year) }).keys()

	// Add X axis
	const x = d3.scaleBand()
		.domain(groups)
		.range([0, width])
		.padding([0.1])
	const xAxis = svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).tickSize(0))
		// .classed("x_axis", true)
		.style("opacity", 1)
		.style("font-size", "15px");

	//hard code the value for opacity of xAxis so that it does not disappear in on mouseover
	xAxis.selectAll(".tick")
		.style("opacity", 1)
	svg.append("text")
		.attr("class", "x_axis_label")
		.attr("x", 650)
		.attr("y", 530) // Adjust the y position based on your preference
		.attr("text-anchor", "middle")
		.text("Year");
	// Add Y axis
	const y = d3.scaleLinear()
		.domain([0, domain])
		.range([height, 0]);
	const yAxis = svg.append("g")
		.call(d3.axisLeft(y))
		.style("opacity", 1)
		.style("font-size", "13px");
	// hard code the opacity value for yaxis
	yAxis.selectAll(".tick")
		.style("opacity", 1)
	// Append the y-axis label
	svg.append("text")
		.attr("class", "y_axis_label")
		.attr("transform", "rotate(-90)")
		.attr("x", -200)
		.attr("y", -30) // Adjust the y position based on your preference
		.attr("text-anchor", "middle")
		.text("NOM values in thousands");
	// Another scale for subgroup position?
	const xSubgroup = d3.scaleBand()
		.domain(subgroups)
		.range([0, x.bandwidth() * 1.1])
		.padding([0.68])
	// color palette = one color per subgroup
	const color = d3.scaleOrdinal()
		.domain(subgroups)
		// .range(["#FF0000", "#00FF00", "#FFFF00", "#FF00FF", "#00FFFF", "#800080", "#0000FF", "#008080"])
		.range(["#1f77b4", "gray", "#2ca02c", "#d62728", "#9467bd", "#ff7f0e", "#f2cfe5", "#17becf"])

	// Show the bars
	const chartGroup = svg
		.append("g")
		.attr("id", "chart_group")
		.selectAll("g")
		.data(data)
		.enter()
		.append("g")
		.attr("transform", function (d) { return "translate(" + x(d.year) + ",0)"; })
	chartGroup
		.selectAll("rect")
		.data(function (d, i) {
			return subgroups.map(function (key) { return { key: key, value: d[key] }; });

		})
		.enter()
		.append("rect")
		// .duration(750)
		.attr("x", function (d) { return xSubgroup(d.key); })
		.attr("y", function (d) { return y(d.value); })
		.attr("width", xSubgroup.bandwidth() * 3)
		.attr("height", function (d) { return (height - y(d.value)); })
		.attr("fill", function (d) { return color(d.key); })
		.attr("class", "bar") // Add the .bar class to the bars
		// .transition()
		.on("click", function (d, i, g) {
			d3.select(g)
			// .transition()
			// .duration(700)
			isBarClicked = !isBarClicked;
			highLightBar(d.key, svg, dataValueLabels)
			// stops the effects of hover buttons and let's us trigger onclick
			d3.event.stopPropagation()
		})

	const dataValueLabels = chartGroup
		.selectAll(".data_value")
		.data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
		.enter()
		.append("text")
		.attr("class", "data_value")
		.attr("x", function (d) { return xSubgroup(d.key) + xSubgroup.bandwidth() / 2 + 13; })
		.attr("y", function (d) { return y(d.value) - 5; })
		.text(function (d) { return d.value; })
		.attr("text-anchor", "middle")
		.style("opacity", 0) // Initially hide the data value labels
	chartGroup
		.on("mouseover", function (d, i, g) {
			if (!isBarClicked) {
				// const xAxis = svg.select("g.x-axis");
				duration = 700
				d3.select(this.parentNode)
					.transition()
					.duration(duration)
					.ease(d3.easeCubic)
					.attr("opacity", 1); // Highlight the current group
				svg.selectAll("g:not(#chart-group):not(:hover)")
					.transition()
					.duration(duration)
					.ease(d3.easeCubic)
					.attr("opacity", 0.2); // Fade the other groups
				dataValueLabels
					.transition()
					.duration(duration - 300)
					.ease(d3.easeCubic)
					.style("opacity", function (d, i, g) {
						return d3.select(this.parentNode).style("opacity"); // Show the data value labels for the highlighted group
					});
				d3.select(this)
					.style("cursor", "pointer"); // Change cursor to pointer on mouseenter

			}
		})
		.on("mouseout", function (d, i, g) {
			if (!isBarClicked) {
				duration = 300
				d3.select(g[i])
					.transition()
					.duration(duration)
					.ease(d3.easeCubic)
					.attr("opacity", 1); // Restore opacity of the current group
				svg.selectAll("g:not(#chart-group)")
					.transition()
					.duration(duration)
					.attr("opacity", 1); // Restore opacity of the other groups
				dataValueLabels
					.transition()
					.duration(duration)
					.style("opacity", 0); // Hide the data value labels
			}
		})

	document.querySelector("svg").addEventListener("click", () => {
		if (isBarClicked) {
			isBarClicked = false;
		}

		highLightBar(undefined, svg, dataValueLabels)
	})

}


function addDiv(id) {
	const body = d3.select("body");
	body.append("div")
		.attr("id", id);
}

function removeDiv(id) {
	d3.select(id).remove();
}

function lineChart() {

	// set the dimensions and margins of the graph
	var margin = { top: 40, right: 25, bottom: 30, left: 60 },
		width = 1160 - margin.left - margin.right,
		height = 550 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#chartLine")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	//Read the data
	d3.csv("total_nom_data.csv", function (data) {

		// Add X axis --> it is a date format
		var x = d3.scaleLinear()
			.domain(d3.extent(data, function (d) { return d.year }))
			.range([0, width])
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x).ticks(0));

		//hard code the value for each year on xAxis to replace comma values(eg. 2,005)
		svg.append("text")
			.attr("x", -15)
			.attr("y", 500)
			.text("2012");
		svg.append("text")
			.attr("x", 107)
			.attr("y", 500)
			.text("2013");
		svg.append("text")
			.attr("x", 229)
			.attr("y", 500)
			.text("2014");
		svg.append("text")
			.attr("x", 351)
			.attr("y", 500)
			.text("2015");
		svg.append("text")
			.attr("x", 473)
			.attr("y", 500)
			.text("2016");
		svg.append("text")
			.attr("x", 595)
			.attr("y", 500)
			.text("2017");
		svg.append("text")
			.attr("x", 717)
			.attr("y", 500)
			.text("2018");
		svg.append("text")
			.attr("x", 839)
			.attr("y", 500)
			.text("2019");
		svg.append("text")
			.attr("x", 961)
			.attr("y", 500)
			.text("2020");
		svg.append("text")
			.attr("class", "y_axis_label")
			.attr("x", 520)
			.attr("y", 505)
			.text("Year");

		// Add Y axis
		var y = d3.scaleLinear()
			.domain([0, d3.max(data, function (d) { return +d.total_nom; })])
			.range([height, 0]);
		svg.append("g")
			.call(d3.axisLeft(y));

		// append y-axis label text
		svg.append("text")
			.attr("class", "y_axis_label_text")
			.attr("transform", "rotate(-90)")
			.attr("x", -280)
			.attr("y", -43) // Adjust the y position based on your preference
			.text("Total NOM values");

		// group the data: I want to draw one line per group
		var sumstat = d3.nest()
			.key(function (d) { return d.State; })
			.entries(data);

		// color palette
		var res = sumstat.map(function (d) { return d.key }) // list of group names
		var color = d3.scaleOrdinal()
			.domain(res)
			.range(["#1f77b4", "gray", "#2ca02c", "#d62728", "#9467bd", "#ff7f0e", "#f2cfe5", "#17becf"])

		// Draw the line
		const labels = svg.selectAll(".line")
			.data(sumstat)
			.enter()
			.append("path")
			.attr("fill", "none")
			.attr("class", "line")
			.attr("stroke", function (d) { return color(d.key) })
			.attr("stroke-width", 3.5)
			.attr("state", function (d) { return d.State })
			.attr("d", function (d) {
				return d3.line()
					.x(function (d) { return x(d.year); })
					.y(function (d) { return y(d.total_nom); })
					(d.values)
			})

		//scaling for x axis of points
		var xScale = d3.scaleLinear()
			.domain([2012, 2020])
			.rangeRound([width, 0])

		//scaling for y axis of points
		var yScale = d3.scaleLinear()
			.domain([340, 96430])
			.range([0, height])

		//temporary variables for hovering transition
		var tempState;
		var tempSvg = svg.selectAll(".text")
			.data(data)
			.enter()
			.append("text")

		//hovering transition
		labels.on("mouseover", function (d) {
			tempState = d.key
			duration = 400
			d3.select(this)
				.attr("stroke-width", 6.5)
			// .attr("opacity", 2)

			d3.select(this.parentNode)
				.transition()
				.duration(duration)
				.ease(d3.easeCubic)
				.attr("opacity", 1);
			svg.selectAll(".line:not(:hover)")
				.attr("opacity", 0.3)

			tempSvg
				.transition()
				.duration(300)
				.ease(d3.easeCubic)
				.text(function (d) {
					if (d.State == tempState) {
						return d.total_nom
					}
				})
				.attr("x", function (d) {
					if (d.State == tempState) {
						return width - xScale(d.year) + 5;
					}
				})
				.attr("y", function (d) {
					if (d.State == tempState) {
						return height - yScale(d.total_nom) - 10;
					}
				})
				.style("opacity", 1)
		}
		)
			.on("mouseout", function (d, i, g) {
				duration = 300
				d3.select(this)
					.attr("stroke-width", 3.5)
				svg.selectAll(".line")
					.attr("opacity", 1)
				d3.select(g[i])
					.transition()
					.duration(duration)
					.ease(d3.easeCubic)
				// .attr("opacity", 1);
				tempSvg
					.transition()
					.delay(duration * 2)
					.duration(duration * 3)
					.ease(d3.easeCubic)
					.style("opacity", 0)
			})

		const states = ['New South Wales', 'Victoria', 'Queensland', 'South Australia', 'Western Australia', 'Tasmania', 'Northern Territory', 'Australian Capital Territory'];
		//show legend
		showLegend(svg, states);
	})
}


function main() {
	console.log("Connected")
	const margin = { top: 10, right: 30, bottom: 20, left: 50 },
		width = 1250 - margin.left - margin.right,
		height = 540 - margin.top - margin.bottom;

	var countOne = 0;
	const btnOne = document.querySelector('#btn_one')
	btnOne.addEventListener('click', function () {
		if (countOne == 0) {
			addDiv("chartOne")

			removeDiv("#chartTwo")
			removeDiv("#chartThree")
			removeDiv("#chartLine")

			d3.csv("data_clean.csv", function (data) {
				barChartOne(data, margin, width, height)
			})

			countTwo = 0;
			countThree = 0;
			countLine = 0;
		}
		countOne++;
	})

	var countTwo = 0;
	const btnTwo = document.querySelector('#btn_two')
	btnTwo.addEventListener('click', function () {
		if (countTwo == 0) {
			console.log("Hey button has been clicked once")

			removeDiv("#chartOne")
			removeDiv("#chartThree")
			removeDiv("#chartLine")

			addDiv("chartTwo")
			d3.csv("data_clean_2.csv", function (data) {
				barChartTwo(data, margin, width, height)
			})
			// showSortBtn();

			countOne = 0;
			countThree = 0;
			countLine = 0;
		}
		countTwo++;
	})

	var countThree = 0;
	const btnThree = document.querySelector('#btn_three')
	btnThree.addEventListener('click', function () {
		if (countThree == 0) {
			removeDiv("#chartOne")
			removeDiv("#chartTwo")
			removeDiv("#chartLine")

			addDiv("chartThree")

			d3.csv("data_clean_3.csv", function (data) {
				console.log("It is reaching here")
				barChartThree(data, margin, width, height)
			})
			countOne = 0;
			countTwo = 0;
			countLine = 0;
		}
		countThree++
	})

	var countLine = 0;
	const btnLine = document.querySelector('#btn_line')
	btnLine.addEventListener('click', function () {
		if (countLine == 0) {
			removeDiv("#chartOne")
			removeDiv("#chartTwo")
			removeDiv("#chartThree")

			addDiv("chartLine")
			lineChart()

			countOne = 0;
			countTwo = 0;
			countThree = 0;
			countLine++;
		}
	})

}
document.onload = main()
