var width = 960,
    height = 500,
    active = d3.select(null);

var projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 2]);
  
var zoom = d3.zoom().on("zoom", zoomed);
var path = d3.geoPath().projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g");
  
svg
    .call(zoom); // delete this line to disable free zooming
    // .call(zoom.event); // not in d3 v4

d3.json("https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-50m.json", function(error, world) {
  if (error) throw error;

  g.selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "feature")
    .on("click", clicked);

  g.append("path")
    .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
    .attr("class", "mesh")
    .attr("d", path);
});

function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(1050)
      // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
      // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
      .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  g.attr("transform", d3.event.transform); // updated for d3 v4
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
