export class BarGraph extends D3Base {
	constructor(obj) {
		super(obj);
		this.userData = this.OBJ.data;

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

		this.MARGIN = {
			top: 15,
			right: 10,
			bottom: 20,
			left: 30,
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
		this.DATA = {
			x: d3
				.scaleBand()
				.range([0, this.DIMENSIONS.width], 0.05)
				.padding(0.05),
			y: d3.scaleLinear().range([this.DIMENSIONS.height, 0]),
		};
		this.AXIS = {
			x: d3.axisBottom().scale(this.DATA.x),
			y: d3.axisLeft().scale(this.DATA.y),
		};
		this.DATA.x.domain(
			this.userData.map((d) => {
				return d.x;
			}),
		);
		this.DATA.y.domain([
			0,
			d3.max(this.userData, (d) => {
				return d.y;
			}),
		]);
	}
	render() {
		const xAxis = this.SVG.append("g")
			.attr("transform", `translate(0, ${this.DIMENSIONS.height})`)
			.call(this.AXIS.x)
			.selectAll("text")
			.style("text-anchor", "end");
		const yAxis = this.SVG.append("g")
			.call(this.AXIS.y)
			.style("text-anchor", "end");
		const bars = this.SVG.selectAll("bar")
			.data(this.userData)
			.enter()
			.append("rect")
			.attr("fill", "red")
			.attr("x", (d) => this.DATA.x(d.x))
			.attr("y", (d) => this.DATA.y(d.y))
			.attr("height", (d) => this.DIMENSIONS.height - this.DATA.y(d.y))
			.attr("width", this.DATA.x.bandwidth());
		const barLabel = this.SVG.selectAll("label")
			.data(this.userData)
			.enter()
			.append("text")
			.attr("fill", "black")
			.attr("x", (d) => this.DATA.x(d.x))
			.attr("y", (d) => this.DATA.y(d.y))
			.attr("dx", (d) => this.DATA.x.bandwidth() / 2)
			.attr("dy", -2)
			.attr("text-anchor", "middle")
			.text((d) => d.label);
	}
}
