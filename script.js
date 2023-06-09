const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const mark = [
    {
        long: 106.9057,
        lat: 47.8864,
    },
];

const marks = [
    {
        long: 102.779,
        lat: 46.2729,
    },
    {
        long: 100.1772,
        lat: 49.6429,
    },
    {
        long: 114.5356,
        lat: 48.0951,
    },
    {
        long: 95.539,
        lat: 45.108,
    },
];

var link = [];
marks.forEach(function (row) {
    source = [106.9057, 47.8864];
    target = [row.long, row.lat];
    topush = { type: "LineString", coordinates: [source, target] };
    link.push(topush);
});

console.log("lines", link);

const projection = d3
    .geoMercator()
    .center([103.7, 47])
    .scale(1200)
    .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

function animatePath(path) {
    path.attr("stroke-dasharray", function () {
        return this.getTotalLength() + " " + this.getTotalLength();
    })
        .attr("stroke-dashoffset", function () {
            return this.getTotalLength();
        })
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .on("end", function () {
            animatePath(d3.select(this));
        });
}

d3.json("mn.geojson").then(function (data) {
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
        .attr("fill", "#2C8C7BA3")
        .attr("d", d3.geoPath().projection(projection))
        .attr("class", "province")
        .style("stroke-width", 1)
        .style("stroke", "none");

    svg.selectAll(".m")
        .data(mark)
        .enter()
        .append("image")
        .attr("class", "marker")
        .attr("width", 40)
        .attr("height", 40)
        .attr("xlink:href", "static/images/wind.gif")
        .style("cursor", "pointer")
        .attr("transform", (d) => {
            let p = projection([d.long, d.lat]);
            return `translate(${p[0] - 22}, ${p[1] - 40})`;
        });

    svg.selectAll(".m")
        .data(marks)
        .enter()
        .append("image")
        .attr("class", "marker")
        .attr("width", 60)
        .attr("height", 60)
        .attr("xlink:href", "static/images/ar.gif")
        .style("cursor", "pointer")
        .attr("transform", (d) => {
            let p = projection([d.long, d.lat]);
            return `translate(${p[0] - 25}, ${p[1] - 40})`;
        });

    svg.selectAll("myPath")
        .data(link)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return path(d);
        })
        .style("fill", "none")
        .style("stroke", "#69b3a2")
        .style("stroke-width", 2)
        .each(function () {
            animatePath(d3.select(this));
        });
});
