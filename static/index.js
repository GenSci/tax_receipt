/*
---------------------------------------------------------------
static/index.js
---------------------------------------------------------------
A series of JavaScript functions supporting the
generation of a tax receipt page
*/

function drawGraphPie(taxes_paid=10489) {
    var svg = d3.select('svg'),
          width = +svg.attr('width'),
          height = +svg.attr('height'),
          radius = Math.min(width, height) / 2,
          g = svg.append('g')..attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

          var pie = d3.pie().sort(null)
                            .value(function(d){ return d.funds});

        var path = d3.arc()
                            .outerRadius(radius - 10)
                            .innerRadius(radius - 100);

        var label = d3.arc()
                            .outerRadius(radius)
                            .innerRadius(radius);

        d3.json('static/data.json', function(d){
            d.percentage = +d.percentage;
            return d;
        }, function(error, data){
            if (error) {
                throw error;
            }
            var arc = g.selectAll(".arc")
                            .data(pie(data))
                            .enter().append("g")
                            .attr("class", "arc");

            arc.append("path")
                .attr("d", path)
                .attr("fill", function(d){ return color(d.data.name)})
            });
            arc.append("text")
                ..attr('transform', 'translate(' + label.centroid(d) + ')')
                .attr('dy', 'o.35em')
                .text(function(d){ return d.data.funds})

}
