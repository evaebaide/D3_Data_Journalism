var svgWidth = 1000;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 30,
  bottom: 60,
  left: 20
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper

var svg = d3.select("#scatter")
  //.style(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // append an SVG group `

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load Data
d3.csv("assets/data/data.csv")
.then(function(hc_Data) {
  
  // Cast each hours value in povertyData as a number using the unary + operator

    hc_Data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      //data.abbr = +data.abbr;
    });

    console.log(hc_Data);
    // Create scale functions
   
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(hc_Data, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(hc_Data, d => d.healthcare)+1])
      .range([height, 0]);

    // Create axis functions
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append the axes
      chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

      chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    
    var circles_Group =  svg.selectAll("g.circle")
    .data(hc_Data)
    .enter()
    .append('g');
    
    circles_Group.append("circle")
    .attr("r", 15)
    .attr("cx", d=> xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("fill", "coral")
    .attr("opacity", "0.75");


    circles_Group.append("text").text(function(d){
        return d.abbr;
    })
    .attr("x", d => xLinearScale(d.poverty)-8)
  //   .attr("x", function (d) {
  //     return xLinearScale(d.poverty)-6;
  // })
  .attr("y", d => yLinearScale(d.healthcare)+5)
    // .attr("y", function (d) {
    //     return yLinearScale(d.healthcare)+3;
    // })
    .style("font", "10px arial")
    .style("fill", "white")
    .attr({"text-anchor" : "middle"});

    // Tool tip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .style("opacity",0)
    .style("background-color", "white")
    .style("border", "solid")
    // .style("border-width", "1px")
    // .style("border-radius", "5px")
    // .style("padding", "2px")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
    });

      


    // Create tooltip
        chartGroup.call(toolTip);

    //Create event listeners for tooltip
    
    circles_Group.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, data) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("No Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text(" Poverty(%)");
  }).catch(function(error) {
    console.log(error);
  });