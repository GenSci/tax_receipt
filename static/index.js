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
          g = svg.append('g').attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

    var pie = d3.pie().sort(null)
            .value(function(d){ return d.funds});

    var path = d3.arc()
                        .outerRadius(radius - 10)
                        .innerRadius(radius - 100);

    var label = d3.arc()
                        .outerRadius(radius)
                        .innerRadius(radius);

    d3.json('static/data.json', function(error, data){
        if (error) {
            throw error;
        }
        var pie_data = new Array
        var pnum = 1/Object.keys(data).length;
        var step = 0;
        for (var comp in data) {
            if (data.hasOwnProperty(comp)) {
                let comp_obj = {
                    name: comp,
                    funds: +data[comp].percentage * taxes_paid,
                    color: d3.interpolateRdBu(step)
                };
                pie_data.push(comp_obj);
                step += pnum;
            }
        }
        var arc = g.selectAll(".arc")
                        .data(pie(pie_data))
                        .enter().append("g")
                        .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d){ return d.data.color});

        arc.append("text")
            .attr('transform',function(d){
                var c = label.centroid(d),
                    x = c[0],
                    y = c[1],
                    labelr=250,
                    h = Math.sqrt(x*x + y*y);
                return 'translate(' + (x/h * labelr)+ ',' + (y/h * labelr) + ')';
            })
            .attr('dy', '0.35em')
            .attr("text-anchor", function(d){
                return (d.endAngle + d.startAngle)/2 > Math.PI ? "end": "start"
            })
            .text(function(d){ return d.data.name + " - $" + Math.round(d.data.funds)});
    });
}

function assignGraph() {
    let elem = document.querySelector('#update_graph')
    elem.addEventListener('click', function(){
        let taxes_paid = +document.querySelector('#taxes_paid').value;
        document.getElementById('tax_graph').innerHTML="";
        drawGraphPie(taxes_paid);
    })
}
