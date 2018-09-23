/*
---------------------------------------------------------------
static/index.js
---------------------------------------------------------------
A series of JavaScript functions supporting the
generation of a tax receipt page
*/

// Creating a function to zoom into a specific area
function zoomIn(arc, d) {
    if (!d.data.components) {
        return false
    }
    var selected = d3.select(arc);
    


}
// Creating some useful global variables
var top_level = {'name': 'Federal Budget'};
var cashFormat = d3.format(",.2f");
var percentFormat = d3.format(".2f");
// A function to build the HTML string for the tooltip
function tooltipString(d) {
    strHtml = "<strong class='title'> " + d.data.name + "</strong>" +
              "<hr /> " +
              "<span class='funds'> $" + cashFormat(d.data.funds) +
              "</span> <br/>" +
              "<span class='percent'> " + percentFormat(d.data.percent*100) +
              "% of taxes paid.</span>"
    return strHtml;
}

function drawGraphPie(data, taxes_paid=10489) {
    var svg = d3.select('svg'),
        width = +svg.attr('width'),
        height = +svg.attr('height'),
        radius = Math.min(width, height) / 2,
        g = svg.append('g').attr('transform', 'translate(' + ((width/2) - 40) + ',' + height/2 + ')');

    var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
    // Building a pie function
    var pie = d3.pie().sort(null)
            .value(function(d){ return d.funds});

    var path = d3.arc()
                        .outerRadius(radius - 10)
                        .innerRadius(radius - 100);

    var label = d3.arc()
                        .outerRadius(radius)
                        .innerRadius(radius);



    var pie_data = new Array
    var pnum = 1/Object.keys(data).length;
    var step = 0;
    for (var comp in data) {
        if (data.hasOwnProperty(comp)) {
            let comp_obj = {
                name: comp,
                percent: data[comp].percentage,
                funds: +data[comp].percentage * taxes_paid,
                color: d3.interpolateYlGnBu(step)
            };
            if (data[comp].hasOwnProperty('components')) {
                comp_obj['components'] = data[comp].components;
            }
            pie_data.push(comp_obj);
            step += pnum;
        }
    }
    var arc = g.selectAll(".arc")
                    .data(pie(pie_data))
                    .enter().append("g")
                    .attr("class", "arc");

    //Animating the drawing of the donut chart
    arc.append("path")
        .attr("fill", function(d){ return d.data.color})
        .transition().delay(function(d,i){
            return i * 500
        }).duration(500)
        .attrTween('d', function(d){
            var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
            return function(t){
                d.endAngle = i(t);
                return path(d)
            }
        });
    // Appending our label to the outside of the donut
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
        .text(function(d){
            return d.data.name
        });


    //Adding tooltip on hover functionality
    arc.on('mouseover', function(d){
        div.transition()
            .duration(200)
            .style("opacity", 0.9);
        div.html(tooltipString(d))
        .style("left", d3.event.pageX+'px')
        .style("top", d3.event.pageY+'px');
        });
    // hiding tooltip on mouseout
    arc.on("mouseout", function(d){
        div.transition()
            .duration(500)
            .style("opacity", 0);
    });
    arc.on("click", function(d){
        let myArc = this;
        zoomIn(myArc,d);
    })
};

function assignGraph() {
    let elem = document.querySelector('#update_graph')
    elem.addEventListener('click', function(){
        let taxes_paid = +document.querySelector('#taxes_paid').value;
        document.getElementById('tax_graph').innerHTML="";
        fetch('static/data.json')
            .then(resp=>resp.json())
            .then(budget => {
                drawGraphPie(budget, taxes_paid)
            });
    });
}
