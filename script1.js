d3.csv('wicdf.csv', d3.autoType)
    .then(data=>{
        education = data
        console.log(education);

        const margin = {top: 20, right: 20, bottom: 20, left: 40},
            width = 650 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;


        const svg = d3.select(".chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

        const xScale = d3.scaleLinear()
            .domain(d3.extent(education, d => d.Year)).nice()
            .range([margin.left, width - margin.right])
        
        const yScale = d3.scaleLinear()
            .domain(d3.extent(education, d => d.Years)).nice()
            .range([height - margin.bottom, margin.top])


        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(20, "f")

        const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(10, ",f")
            
        // Draw the axis
        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            .call(g => g.select(".domain").remove())
            .selectAll(".tick line")
            .clone()
            .attr("y2", -height)
            .attr("stroke-opacity", 0.1); // make it transparent

        svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(35, 20)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .selectAll(".tick line")
            .clone()
            .attr("x2", width)
            .attr("stroke-opacity", 0.1); // make it transparent ;


        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width-15)
            .attr("y", height-6)
            .text("Year");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 25)
            .attr("x", 275)
            .attr("dy", ".75em")
            .text("Average Years of Formal Education");

        svg.append("g")
            .attr("fill", "#48C9B0")
            .attr("stroke", "grey")
            .attr("stroke-width", 1)
            .selectAll("circle")
            .data(education)
            .join("circle")
            .attr("cx", d => xScale(d.Year))
            .attr("cy", d => yScale(d.Years))
            .attr("r", 3);

        const line = d3
            .line()
            .curve(d3.curveCatmullRom)
            .x(d=>xScale(d.Year))
            .y(d=>yScale(d.Years));

        const l = line(education).length;

        svg.append("path")
            .datum(education)
            .attr("fill", "none")
            .attr("stroke", "#A6ACAF")
            .attr("stroke-width", 1.5)
            // .attr("stroke-linejoin", "round")
            // .attr("stroke-linecap", "round")
            // .attr("stroke-dasharray", `0,${l}`)
            .attr("d", line)
            // .transition()
            // .duration(15000)
            // .ease(d3.easeLinear)
            // .attr("stroke-dasharray", `${l},${l}`);

        const label = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .selectAll("g")
            .data(education)
            .join("g")
            .attr("transform", d => `translate(${xScale(d.Year)},${yScale(d.Years)})`)
            .attr("opacity", 0);
    
        label.append("text")
            .text(d => d.Area)
})