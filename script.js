const svg = d3.select("svg"),
	width = +svg.attr("width"),
	height = +svg.attr("height");

const mark = [
	{
		long: 106.9057,
		lat: 47.8864,
		title: "Ulaanbaatar"
	}
];

const marks = [
	{
		long: 102.779,
		lat: 46.2729,
		title: "Arvayheer"
	},
	{
		long: 100.1772,
		lat: 49.6429,
		title: "Moron"
	},
	{
		long: 114.5356,
		lat: 48.0951,
		title: "Choibalsan"
	},
	{
		long: 95.539,
		lat: 45.108,
		title: "Bayanbogd"
	}
];

var link = [];
marks.forEach(function (row) {
	source = [106.9057, 47.8864];
	target = [row.long, row.lat];
	topush = { type: "LineString", coordinates: [source, target] };
	link.push(topush);
});

const projection = d3
	.geoMercator()
	.center([103.7, 47])
	.scale(1200)
	.translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

function animatePath(path) {
	path
		.attr("stroke-dasharray", function () {
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

const popover = d3
	.select("svg")
	.append("foreignObject")
	.attr("class", "popover")
	.attr("width", 210)
	.attr("height", 100)
	.style("opacity", 0)
	.style("z-index", 9999);

popover.append("xhtml:div").attr("class", "popover-content");

d3.json("mn.geojson").then(function (data) {
	svg
		.append("g")
		.selectAll("path")
		.data(data.features)
		.join("path")
		.attr("fill", "#2C8C7BA3")
		.attr("d", d3.geoPath().projection(projection))
		.attr("class", "province")
		.style("stroke-width", 1)
		.style("stroke", "none");

	svg
		.selectAll(".m")
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
		})
		.on("click", function (d) {
			popover.transition().duration(200).style("opacity", 1);

			const [markerX, markerY] = projection([
				d.srcElement.__data__.long,
				d.srcElement.__data__.lat
			]);
			const [clickX, clickY] = d3.pointer(event);
			const popoverX = markerX + clickX;
			const popoverY = markerY + clickY;

			popover.attr("x", popoverX - 150).attr("y", popoverY - 20);

			popover.raise();

			popover.select(
				".popover-content"
			).html(`<div class='w-full h-full relative p-4 flex flex-row items-start gap-4'>
                <div class='p-3 bg-white rounded-[10px]'>
                    <image alt='' src='static/images/ar.svg' class='w-8' />
                </div>
                <div class='flex flex-col gap-2'>
                    <p class='text-[14px] font-[600] leading-[16px]'>${d.srcElement.__data__.title}</p>
                    <p class='text-[12px] font-[500] leading-[16px]'>Capacity: 15 MWh</p>
                    <p class='text-[12px] font-[500] leading-[16px]'>Daily yield: 5MWh</p>
                </div>
            </div>`);
		});

	svg
		.selectAll(".m")
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
		})
		.on("click", function (d) {
			popover.transition().duration(200).style("opacity", 1);

			const [markerX, markerY] = projection([
				d.srcElement.__data__.long,
				d.srcElement.__data__.lat
			]);
			const [clickX, clickY] = d3.pointer(event);
			const popoverX = markerX + clickX;
			const popoverY = markerY + clickY;

			popover.attr("x", popoverX - 150).attr("y", popoverY - 20);

			popover.raise();

			popover.select(
				".popover-content"
			).html(`<div class='w-full h-full relative p-4 flex flex-row items-start gap-4'>
                <div class='p-3 bg-white rounded-[10px]'>
                    <image alt='' src='static/images/ar.svg' class='w-8' />
                </div>
                <div class='flex flex-col gap-2'>
                    <p class='text-[14px] font-[600] leading-[16px]'>${d.srcElement.__data__.title}</p>
                    <p class='text-[12px] font-[500] leading-[16px]'>Capacity: 15 MWh</p>
                    <p class='text-[12px] font-[500] leading-[16px]'>Daily yield: 5MWh</p>
                </div>
            </div>`);
		});

	svg
		.selectAll("myPath")
		.data(link)
		.enter()
		.append("path")
		.attr("class", "line")
		.attr("d", function (d) {
			return path(d);
		})
		.style("fill", "none")
		.style("stroke", `#69b3a2`)
		.style("stroke-width", 2)
		.each(function () {
			animatePath(d3.select(this));
		});
});

// "#69b3a2"
