export class TreeMap extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "50%";

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
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 300;

		this.MARGIN = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10,
		};
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.bottom,
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

		this.treemap = d3
			.treemap()
			.size([this.DIMENSIONS.width, this.DIMENSIONS.height])
			.padding(5)
			.round(true);

		this.data = this.OBJ.data;

		this.hierarchy = d3
			.hierarchy(this.data)
			.sum((d) => d.value)
			.sort((a, b) => b.value - a.value);

		this.root = this.treemap(this.hierarchy);

		this.leaves = this.root.leaves();

		this.colors = {
			// fill: d3.scaleOrdinal().range(d3.schemePastel1),
			fill: "white",
			// stroke: d3.scaleOrdinal().range(d3.schemeSet1),
			stroke: "black",
		};
	}
	render() {
		const groups = this.SVG.selectAll("rect")
			.data(this.root)
			.enter()
			.append("g")
			.attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);
		const rects = groups
			.append("rect")
			.attr("width", (d) => d.x1 - d.x0)
			.attr("height", (d) => d.y1 - d.y0)
			.attr("fill", (d, i) => this.colors.fill)
			.attr("stroke", (d, i) => this.colors.stroke)
			.attr("stroke-width", 1);
		const rectLabel = groups
			.append("text")
			.attr("fill", "black")
			.attr("text-anchor", "middle")
			.attr("x", (d) => (d.x1 - d.x0) / 2)
			.attr("y", (d) => d.y1 - d.y0 - 5)
			// .attr("y", (d) => (d.y1 - d.y0)/2)
			.style("font-family", "Fira")
			.style("font-size", "0.7rem")
			.text((d) => d.data.name);
	}
}
