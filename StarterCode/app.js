var svgWidth = 760;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 20,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv")
  .then(function(povertyData) {
    
//d3.csv("data/data.csv", function(error, povertyData) {

//        if (error) return console.warn(error);

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    povertyData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      //data.abbr = +data.abbr;
    });

    console.log(povertyData);
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([6, d3.max(povertyData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(povertyData, d => d.healthcare)+2])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================

    var circlesGroup =  svg.selectAll("g.dot")
    .data(povertyData)
    .enter().append('g');
    
    circlesGroup.append("circle")
    //.attr("class", "dot")
    .attr("r", 10)
    .attr("cx", function (d) {
        return xLinearScale(d.poverty);
    })
    .attr("cy", function (d) {
        return yLinearScale(d.healthcare);
    })
    .attr("fill", "blue")
    .attr("opacity", "0.75");



    circlesGroup.append("text").text(function(d){
        return d.abbr;
    })
    .attr("x", function (d) {
        return xLinearScale(d.poverty)-6;
    })
    .attr("y", function (d) {
        return yLinearScale(d.healthcare)+3;
    })
    .style("font", "8px sans-serif")
    .style("fill", "white")
    .attr({"text-anchor" : "middle"})

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "2px")



      //.offset([80, -60])
      .html(function(d) {
        return (`State: ${d.state}<br>Healthcare(%): ${d.healthcare}<br>Poverty(%): ${d.poverty}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (height / 1.7))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  });