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

        scale = {}
        keys.map(function(key, index){
            vals = []
            yrs = []
            data.map(function(d, id){
                if(d[key] != ""){
                    // console.log(d.year, key)
                    vals.push(+d[key])
                    yrs.push(parseInt(d.year))
                }
            })
            // console.log(yrs)
            // console.log(vals)
            scale[index] = linear_interp(yrs, vals)
        });

        // console.log(scale[1](0))

        dataInterp = []
        dataSet = keys.map(function(key, index){
            return {
                name: key, 
                values: data.map(function(d, id) {
                    if(d[key] != ""){
                        return {year: d.year, estimate: +d[key]};
                    }
                    else{
                        if (key != "USCensus"){
                            // console.log(d.year, scale[index](d.year))
                            return {year: d.year, estimate: scale[index](d.year), model: "interpolated" }
                        }
                    }
                })
            }
        })
      

        dataSet.forEach(function(key) {
            key.values = key.values.filter(function(n){ return n != undefined });
            });

        function linear_interp(input_domain, output_range){
            return d3.scale.linear().domain(input_domain).range(output_range);
        }

        return createVis();

    });


    createVis = function() {
        // console.log(dataSet);
        var xAxis, xScale, yAxis,  yScale;

        var color = d3.scale.category10();
        color.domain(dataSet.map(function(key){
            // console.log(key.name)
            return key.name;
        }));

          xScale = d3.scale.linear().range([0, bbVis.w]);  // define the right domain generically
          xScale.domain([0, 2050])
          // console.log(xScale(1950));


          yScale = d3.scale.linear().range([height, 0]);
          yScale.domain([
            0,
            d3.max(dataSet, function(e) { return d3.max(e.values, function(v){ return v.estimate; }); })
            ]);

		  //....
        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return yScale(d.estimate); });

        var estimate = svg.selectAll(".estimate")
            .data(dataSet)
            .enter().append("g")
            .attr("class", "estimate");

        //Draw the lines
        estimate.append("path")
            .attr("class", "line")
            .attr("d", function(d){ return line(d.values); })
            .style("stroke", function(d) { return color(d.name)})
            .style("opacity", 0.35);

        //Draw the points
        for(var i=0 ; i<dataSet.length; i++){
            svg.selectAll(".dot")
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


       xAxis = d3.svg.axis().scale(xScale).orient("bottom")
       yAxis = d3.svg.axis().scale(yScale).orient("left")
//        // add y axis to svg !

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
            .text("World Population");


    };
