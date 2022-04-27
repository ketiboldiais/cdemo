export class HeatMap extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "60%";

		this.containerHeightDefault = "50%";

		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;

		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;

		// Set the SVG's width
		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 300;

		// Set the SVG's height
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 250;

		this.MARGIN = this.OBJ.margin
			? this.OBJ.margin
			: {
					top: 10,
					bottom: 10,
					left: 10,
					right: 10,
			  };

		// Set the SVG's dimensions
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
		};

		// The SVG container is <div> that wraps the SVG. This allows for resizing.
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "inline-block")
			.style("position", "relative")
			.style("width", this.D3_CONTAINER_WIDTH)
			.style("padding-bottom", this.D3_CONTAINER_HEIGHT)
			.style("overflow", "hidden");

		this.SVG = this.SVG_CONTAINER.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${
					this.DIMENSIONS.width + this.MARGIN.left + this.MARGIN.right
				} ${
					this.DIMENSIONS.height + this.MARGIN.top + this.MARGIN.bottom
				}`,
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr(
				"transform",
				`translate(${this.MARGIN.left}, ${this.MARGIN.top})`,
			);

		// Arrow Definitions
		this.SVG_DEFINITIONS = this.SVG.append("svg:defs")
			.attr("id", "arrow")
			.append("svg:marker")
			.attr("viewBox", "0 0 10 10")
			.attr("refX", 5)
			.attr("refY", 5)
			.attr("markerWidth", 6)
			.attr("markerHeight", 6)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M 0 0 L 10 5 L 0 10 z")
			.attr("stroke", "#000")
			.attr("stroke-width", 2);

		this.DATA = this.OBJ.data;

		this.KEYS = this.OBJ.key;

		this.GROUPS = d3.map(obj.data, (d) => {
			return d.g;
		});

		this.VARS = d3.map(obj.data, (d) => {
			return d.v;
		});

		this.X_SCALE = d3
			.scaleBand()
			.range([0, this.DIMENSIONS.width])
			.domain(this.GROUPS)
			.padding(0.05);

		this.X_AXIS = this.SVG.append("g")
			.style("font-size", 10)
			.style("font-family", "system-ui")
			.attr("transform", `translate(0, ${this.DIMENSIONS.height})`)
			.call(d3.axisBottom(this.X_SCALE).tickSize(0));
		this.X_AXIS.selectAll("text")
			.attr("transform", "rotate(45)")
			.style("text-anchor", "start");
		this.X_AXIS.selectAll(".domain").remove();

		this.Y_SCALE = d3
			.scaleBand()
			.range([this.DIMENSIONS.height, 0])
			.domain(this.VARS)
			.padding(0.05);

		this.Y_AXIS = this.SVG.append("g")
			.style("font-size", 10)
			.style("font-family", "system-ui")
			.call(d3.axisLeft(this.Y_SCALE).tickSize(0))
			.select(".domain")
			.remove();

		this.COLOR = d3
			.quantize(d3.interpolateHcl("#C2F784", "#FD5D5D"), 8);
	}
	render() {
		const g = this.SVG.selectAll()
			.data(this.DATA, (d) => {
				`${d.g}:${d.v}`;
			})
			.enter()
			.append("g")
			.attr(
				"transform",
				(d) => `translate(${this.X_SCALE(d.g)}, ${this.Y_SCALE(d.v)})`,
			);

		const square = g
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", this.X_SCALE.bandwidth())
			.attr("height", this.Y_SCALE.bandwidth())
			.style("stroke-width", 4)
			.style("stroke", "none")
			.style("opacity", 0.8)
			.style("fill", (d) => {
				if (d.l === 0) {
					return "#EEEEEE";
				} else {
					return this.COLOR[d.l];
				}
			});

		// const foreignbject = g
		// 	.append("foreignObject")
		// 	.attr("width", this.X_SCALE.bandwidth())
		// 	.attr("height", this.Y_SCALE.bandwidth());

		// const span = foreignbject
		// 	.append("xhtml:span")
		// 	.html((d) => this.KEYS[d.l])
		// 	.style("display", "flex")
		// 	.style("justify-content", "center")
		// 	.style("text-align", "center")
		// 	.style("font-size", "0.5rem")
		// 	.style("color", "black");
	}
}
