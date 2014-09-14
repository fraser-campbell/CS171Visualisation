var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

bbOverview = {
    x: 0,
    y: 10,
    w: width,
    h: 50
};

bbDetail = {
    x: 0,
    y: 100,
    w: width,
    h: 300
};

dataSet = [];

    //----------------------------- Create container elements-------------------------------------------------

svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

var overview = svg.append("g")
                    .attr({ width: width, height: bbOverview.h})
                    .attr("class", "overview")
                    .attr({transform: "translate(0," + bbOverview.y + ")"})

// translate_det_y = (bbOverview.y + bbOverview.h + bbDetail.y)
translate_det_y = (bbDetail.y)

var detail = svg.append("g")
                    .attr({ width: width, height: bbDetail.h})
                    .attr("class", "detail")
                    .attr({transform: "translate(0," + translate_det_y + ")"})

    //-----------------------------Data Struct graphs---------------------------------------------------------

var format = d3.time.format("%B %Y");
// console.log(format.parse("September 2009"))

d3.csv("unHealth.csv", function(data) {
    // console.log(data)
    dataSet = data.map(function(d){
        // console.log(convertToInt(format.parse(d.Date)))
        return{
            date: format.parse(d.Date), 
            health: parseInt(d.WHealth)
        }
    })

    // console.log(dataSet)
    return createVis();
});


var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};


    //-----------------------------Create Graphs---------------------------------------------------------

createVis = function() {

    var xAxis, xScale, yAxis,  yScale;
    var xAxis_r, xScale_r, yAxis_r,  yScale_r;
    //-----------------------------Axis---------------------------------------------------------
    xScale = d3.time.scale().range([0, bbOverview.w]);  // define the right domain generically
    xScale.domain([d3.min(dataSet, function(d) { return d.date}),
     d3.max(dataSet, function(d) { return d.date})])
    minimum = 10000000
    dataSet.forEach(function(d){
        if(d.health < minimum){
            minimum = d.health;
        }
    });
    maximum = 0
    dataSet.forEach(function(d){
        if(d.health > maximum){
            maximum = d.health;
        }
    });
    yScale = d3.scale.linear().range([bbOverview.h, 0]);  // define the right domain generically
    yScale.domain([minimum, maximum]);


    xScale_r = d3.time.scale().range([0, bbOverview.w]);
    xScale_r.domain([d3.min(dataSet, function(d) { return d.date}),
    d3.max(dataSet, function(d) { return d.date})])

    yScale_r = d3.scale.linear().range([bbDetail.h, 0]);  // define the right domain generically
    yScale_r.domain([d3.min(dataSet, function(d) { return d.health}),
     d3.max(dataSet, function(d) { return d.health})]);

    //-----------------------------Lines & Points-------------------------------------------------------
    var line_ov = d3.svg.line()
            .interpolate("linear")
            .x(function(d) { return xScale(d.date); })
            .y(function(d) { return yScale(d.health); });

    var line_dt = d3.svg.area()
            .interpolate("linear")
            .x(function(d) { return xScale_r(d.date); })
            .y1(function(d) { return yScale_r(d.health); })
            .y0(yScale_r.range()[0]);


    //Draw the lines
    var health_over = overview
            .append("g")
            .attr("class", "health_over");
    health_over.append("path")
            .datum(dataSet) //This binds the data to a single "g" element
            .attr("class", "path overviewPath")
            .attr("d", line_ov);

    var health_dt = detail
            .append("g")
            .attr("class", "health_dt");
    health_dt.append("path")
            .datum(dataSet) //This binds the data to a single "g" element
            .attr("class", "path detailPath detailArea")
            .attr("d", line_dt)
            .attr("clip-path", "url(#clip)");


    //Draw the points
    health_over.append("g")
            .selectAll(".points")
            .data(dataSet)
            .enter()
            .append("svg:circle")
            .attr("class", ".points")
            .attr("fill", "steelblue")
            .attr("r", 1.5)
            .attr("cx", function(d, i) { return xScale(d.date)})
            .attr("cy", function(d, i) { return yScale(d.health)})

    health_dt.append("g")
            .selectAll(".circle")
            .data(dataSet)
            .enter()
            .append("svg:circle")
            .attr("class", ".points")
            .attr("fill", "steelblue")
            .attr("r", 1.5)
            .attr("cx", function(d, i) { return xScale_r(d.date)})
            .attr("cy", function(d, i) { return yScale_r(d.health)})
            .attr("clip-path", "url(#clip)");

    //-----------------------------Create Axis---------------------------------------------------------

    var customTimeFormat = d3.time.format.multi([[".%L", function(d) { return d.getMilliseconds(); }],
  [":%S", function(d) { return d.getSeconds(); }],
  ["%I:%M", function(d) { return d.getMinutes(); }],
  ["%I %p", function(d) { return d.getHours(); }],
  ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
  ["%b %d", function(d) { return d.getDate() != 1; }],
  ["%B", function(d) { return d.getMonth(); }],
  ["%Y", function() { return true; }]]);

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(customTimeFormat);
    var yAxis = d3.svg.axis().scale(yScale).ticks(3).orient("left")

    var xAxis_r = d3.svg.axis().scale(xScale_r).orient("bottom").tickFormat(customTimeFormat);
    var yAxis_r = d3.svg.axis().scale(yScale_r).orient("left")

    overview.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + bbOverview.h + ")")
        .style("font-size", 12)
        .call(xAxis);
    
    overview.append("g")
        .attr("class", "y axis")
        .style("font-size", 12)
        .call(yAxis);

    detail.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + bbDetail.h + ")")
        .style("font-size", 12)
        .call(xAxis_r);
    
    detail.append("g")
        .attr("class", "y axis")
        .style("font-size", 12)
        .call(yAxis_r);

    //-----------------------------Brush---------------------------------------------------------

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);


    var brush = d3.svg.brush().x(xScale).on("brush", brushed); //NB: 1.01 The x(xScale) here means that the extent function will be scaled by xScale

    overview.append("g").attr("class", "brush extent")
        .call(brush)
        .selectAll("rect")
        .attr("height", bbOverview.h);
        // transform: "translate(20,100)"
        // });

    function brushed(optional_arg){

        if(typeof optional_arg === "undefined"){
            xScale_r.domain(brush.empty() ? xScale.domain() : brush.extent());
        } else {
            xScale_r.domain(optional_arg)
        }
        // console.log(xScale_r.domain())
        detail.select(".detailArea").attr("d", line_dt);
        detail.selectAll("circle")
            .attr("cx", function(d) { return xScale_r(d.date)})
            .attr("cy", function(d) { return yScale_r(d.health)});
        detail.select("g.x.axis").call(xAxis_r);
    };

    //-----------------------------Creating a tooltip----------------------------------------------    

    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    data_highlight = []
    data_highlight.push({date: xScale(format.parse("February 2012")), health: yScale(parseInt("302149")), id: "point1", clicked: "no"});
    data_highlight.push({date: xScale(format.parse("August 2012")), health: yScale(parseInt("289843")), id: "point2", clicked: "no"});
    console.log(data_highlight)


    // console.log(xScale(format.parse("February 2012")))
    // console.log(xScale(format.parse("August 2012")))

    //-----------------------------Creating the default details---------------------------------------------- 

        overview.append("g")
            .selectAll(".hover_point")
            .data(data_highlight)
            .enter()
            .append("svg:circle")
            .attr("class", "points highlight")
            .attr("fill", "black")
            .attr("r", 5)
            .attr("cx", function(d, i) { return d.date})
            .attr("cy", function(d, i) { return d.health})
            .on("mouseover", function(d) {  //This is the function which on mouseover creates the tooltip
                div.transition()       
                    .duration(200)      
                    .style("opacity", .9); 
                div .html("What" + "<br/>")  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");
                })   
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);  
            })
            .on("click", function(d, i){ //This is the function which changes the brush based on clicking
                if(d.id == "point1"){
                    if(d.clicked == "no"){
                        d.clicked = "yes"
                        //The following code changes the brush applied to the overview - NB: use the brush extent property which takes date values (see 1.01 line 215)
                            brush.extent([format.parse("December 2011"), format.parse("April 2012")]);
                            overview.select('.brush').call(brush);
                        return brushed([format.parse("December 2011"), (format.parse("April 2012"))]);  
                    } else {
                        d.clicked = "no"
                            brush.extent([format.parse("September 2009"), format.parse("January 2014")]);
                            overview.select('.brush').call(brush);
                        return brushed([format.parse("September 2009"), (format.parse("January 2014"))]);
                    }
                }
                else if (d.id == "point2"){
                    if(d.clicked == "no"){
                        d.clicked = "yes"
                        //The following code changes the brush applied to the overview - NB: use the brush extent property which takes date values
                            brush.extent([format.parse("June 2012"), format.parse("October 2012")]);
                            overview.select('.brush').call(brush);
                        return brushed([format.parse("June 2012"), (format.parse("October 2012"))]);  
                    } else {
                        d.clicked = "no"
                            brush.extent([format.parse("September 2009"), format.parse("January 2014")]);
                            overview.select('.brush').call(brush);
                        return brushed([format.parse("September 2009"), (format.parse("January 2014"))]);
                    }
                }
            });
};









