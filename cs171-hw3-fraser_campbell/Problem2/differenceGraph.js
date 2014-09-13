/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;

    margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 120
    };

    width = 900 - margin.left - margin.right;

    height = 400 - margin.bottom - margin.top;

    bbVis = {
        x: 0 + 100,
        y: 20,
        w: width - 100,
        h: 100
    };

    dataSet = [];

    svg = d3.select("#vis").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });


    d3.csv("test.csv", function(data) {

        keys = d3.keys(data[0]).filter(function(key) { return key !== "year"; })

        //This code creates the scale for the different estimates required for estimation
        scale = {}
        keys.map(function(key, index){
            vals = []
            yrs = []
            data.map(function(d, id){
                if(d[key] != ""){

                    vals.push(+d[key])
                    yrs.push(parseInt(d.year))
                }
            })
            scale[index] = linear_interp(yrs, vals)
        });


    //-----------------------------Data Struct Estimate---------------------------------------------------------
        dataSet = keys.map(function(key, index){
            return {
                name: key, 
                values: data.map(function(d, id) {
                    if(d[key] != ""){
                        return {year: d.year, estimate: +d[key]};
                    }
                    else{
                        if (key != "USCensus"){
                            return { year: d.year, estimate: scale[index](d.year), model: "interpolated" };
                        }
                    }
                })
            }
        })


        //This is the function which does the linear interp
        function linear_interp(input_domain, output_range){
            return d3.scale.linear().domain(input_domain).range(output_range);
        }

        dataSet.forEach(function(key) {
            key.values = key.values.filter(function(n){ return n != undefined });
        });


    //-----------------------------Data Struct Avg+Range---------------------------------------------------------
        data_avg = {}
        data_all = {}
        dataSet.forEach(function(key, index){
            key.values.forEach(function(d, id){
                if(+d.year in data_avg){
                    data_avg[+d.year] += parseInt(d.estimate);
                    data_all[+d.year].push(parseInt(d.estimate))
                }
                else{
                    temp = []
                    temp.push(parseInt(d.estimate))
                    data_avg[+d.year] = parseInt(d.estimate);
                    data_all[+d.year] = temp
                }
            })
        });


        right_structure_inter = []
        for(key in data_avg){
            if(key<1950){
                intermediate_dict = {"year" : key, "average" : data_avg[key]/4}
            }else{
               intermediate_dict = {"year" : key, "average" : data_avg[key]/5} 
            }
            right_structure_inter.push(intermediate_dict)
        }
        right_structure = []
        right_structure.push(right_structure_inter)
        

        structure_dev_n = []
        for(key in data_all){
            inter_dict = {"year" : key, "y0" : Math.min.apply(null, data_all[key]), "y1" :  Math.max.apply(null, data_all[key])}
            structure_dev_n.push(inter_dict)
        }
        structure_area = []
        structure_area.push(structure_dev_n)

        return createVis();

    });
    //Above is the closing point for reading the data in through the csv file
    
    //-----------------------------Vis Setup---------------------------------------------------------
    createVis = function() {
        var xAxis, xScale, yAxis,  yScale;

        var color = d3.scale.category10();
        color.domain(dataSet.map(function(key){
            return key.name;
        }));

          xScale = d3.scale.linear().range([0, bbVis.w]);  // define the right domain generically
          xScale.domain([0, 2050])
          // console.log(xScale(1950));


          yScale = d3.scale.log().range([height, 0]);
          yScale.domain([
            d3.min(dataSet, function(e) { return d3.min(e.values, function(v){ return v.estimate; }); }),
            d3.max(dataSet, function(e) { return d3.max(e.values, function(v){ return v.estimate; }); })
            ]);

        //----------------------Lines & Points---------------------------------------------------------------
		  //The line for the data sets
        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.estimate); });

          //The line for the avg data set
        var line2 = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.average); });

        var area = d3.svg.area()
            .x(function(d) { return xScale(d.year); })
            .y0(function(d) { return yScale(d.y0); })
            .y1(function(d) { return yScale(d.y1); });

        //Draw the different estimate lines
        var estimate = svg.selectAll(".estimate")
            .data(dataSet)
            .enter().append("g")
            .attr("class", "estimate");

        estimate.append("path")
            .attr("class", "line")
            .attr("d", function(d){ return line(d.values); })
            .style("stroke", function(d) { return color(d.name)})
            .style("opacity", 0.35);

        //Draw the avg line
        var average_v = svg.selectAll(".avg")
            .data(right_structure)
            .enter().append("g")
            .attr("class", "average")

        average_v.append("path")
            .attr("d", function(d){ return line2(d); })
            .attr("class", "line_avg")
            .style("stroke", "black")
            .style("opacity", 0.75);

        //Draw the area
        var areas = svg.selectAll(".area")
            .data(structure_area)
            .enter().append("g")
            .attr("class", "area")

        areas.append("path")
            .attr("d", function(d){ return area(d); })
            .attr("class", "path")
            .style("stroke", "black")
            .style("opacity", 0.3);

        //Draw the points
        for(var i=0 ; i<dataSet.length; i++){
            svg.append("g").selectAll(".dot")
            .data(dataSet[i].values)
            .enter()
            .append("svg:circle")
            .attr("fill", function(d){
                if (d.model){
                    return "black"
                }
                else{
                    return color(dataSet[i].name)
                }
            })
            .attr("class", dataSet[i].name)
            .attr("r", 1.5)
            .attr("cx", function(d, i) { return xScale(d.year)})
            .attr("cy", function(d, i) { return yScale(d.estimate)})
            .style("opacity", function(d){
                if (d.model){
                    return 0.4
                }
                else{
                    return 1
                }
            })
        };

        //---------------------Bar Chart----------------------------------------------------------

        // svg.selectAll("rect")
        //     .append("rect")
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     .attr("width", 20)
        //     .attr("height", 100);


        //---------------------Axis--------------------------------------------------------------
       xAxis = d3.svg.axis().scale(xScale).orient("bottom")
       yAxis = d3.svg.axis().scale(yScale).orient("left")

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
            
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("x", 10)
            .attr("dy", "1em")
            .style("text-anchor", "end")
            .style("font-size", 12)
            .text("Log(Population)");

        
         //---------------------Draw zoom & Hover Functioanlity-------------------------------------------------

        var zoom = d3.behavior.zoom()
            .on("zoom", draw);

         svg.append("rect")
            .attr("class", "pane")
            .attr("width", width)
            .attr("height", height)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove)
            .call(zoom);

            zoom.x(xScale);

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        var bisectDate = d3.bisector(function(d) {return d.year;}).left;

        focus.append("circle")
            .attr("r", 4.5)
        
        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        function mousemove(){
            var x0 = xScale.invert(d3.mouse(this)[0]) 
              console.log(right_structure)
              i = bisectDate(right_structure[0], x0, 1),
              console.log(i)
              // console.log()
              d0 = right_structure[0][i - 1],
              // console.log(d0)
              d1 = right_structure[0][i],
              d = x0 - d0.year > d1.year - x0 ? d1 : d0;
          focus.attr("transform", "translate(" + xScale(d.year) + ", " + yScale(d.average) + ")");
          focus.select("text").text("Population: " + String(+d.average));
        }


         function draw(){
            svg.select("g.x.axis").call(xAxis);
            svg.select("g.y.axis").call(yAxis);
            svg.select("path.path").attr("d", area);
            average_v.select("path.line_avg").attr("d", line2);
            estimate.selectAll("path.line").attr("d", function(d){
                return line(d.values)
            });
            svg.selectAll("circle").attr("cx", function(d, i) { 
                return xScale(d.year)})
            svg.selectAll("circle").attr("cy", function(d, i) { return yScale(d.estimate)});
         }

    };
