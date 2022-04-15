export class Sequence extends D3Base {
	constructor(obj) {
		super(obj);
		this.FRAME_COUNT = this.OBJ.data.length;

		this.containerWidthDefault = "30%";
		this.containerHeightDefault = "10%";

		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;

		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;

		// Set the SVG's width
		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 205;

		// Set the SVG's height
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 190;

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
		this.indexed = this.OBJ.indexed === false ? this.OBJ.indexed : true;

		this.DATA = this.OBJ.data;
		this.MARGIN = {
			top: 10,
			bottom: 10,
			left: 0,
			right: 0,
		};
		this.scaleY = d3
			.scaleBand()
			.domain(this.DATA)
			.range([0, this.DIMENSIONS.height])
			.paddingInner(0);
		this.scaleX = d3
			.scaleBand()
			.domain(this.DATA)
			.range([0, this.DIMENSIONS.width])
			.paddingInner(0.1);

		this.COLORS = {
			frameColor: this.OBJ.palette
				? this.palette(this.OBJ.palette).fill
				: this.palette("blueScheme").fill,
			frameStrokeColor: this.OBJ.palette
				? this.palette(this.OBJ.palette).stroke
				: this.palette("blueScheme").stroke,
			textColor: this.OBJ.palette
				? this.palette(this.OBJ.palette).text
				: this.palette("blueScheme").text,
		};
	}

	render() {
		const arrowEnd = this.SVG.append("svg:defs")
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", "arrow")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 8)
			.attr("refY", 0)
			.attr("markerWidth", 7)
			.attr("markerHeight", 7)
			.attr("orient", "auto")
			.attr("fill", "black")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");

		const frameGroup = this.SVG.selectAll("g")
			.data(this.DATA)
			.enter()
			.append("g")
			.attr("transform", (d) => `translate(${this.scaleX(d)}, 0)`);

		if (this.indexed) {
			frameGroup
				.append("text")
				.attr("text-anchor", "middle")
				.attr("x", this.scaleX.bandwidth() / 2)
				.attr("y", this.scaleY.bandwidth() + this.scaleY.bandwidth() / 4)
				.attr("dy", 5)
				.text((d, i) => i)
				.style("font-family", "CMU")
				.style("font-size", "0.75rem")
				.attr("fill", (d) => (d.text ? d.text : this.COLORS.textColor));
		}

		const rect = frameGroup
			.append("rect")
			.attr("stroke", (d) => {
				if (d.colors && d.colors.stroke) {
					return d.colors.stroke;
				} else {
					return this.COLORS.frameStrokeColor;
				}
			})
			.attr("x", 0)
			.attr("y", 0)
			.attr("fill", (d) => {
				if (d.colors && d.colors.fill) {
					return d.colors.fill;
				} else {
					return this.COLORS.frameColor;
				}
			})
			.attr("opacity", (d) => {
				if (d.popped) {
					return 0.2;
				} else {
					return 1;
				}
			})
			.attr("height", this.scaleY.bandwidth())
			.attr("width", this.scaleY.bandwidth());

		// const pointer = frameGroup
		// 	.append("line")
		// 	.filter((d) => d.pointer)
		// 	.attr("stroke", this.COLORS.frameStrokeColor)
		// 	.attr("x1", -this.FRAME_DIMENSIONS.width)
		// 	.attr("y1", this.FRAME_DIMENSIONS.height / 2)
		// 	.attr("x2", -this.FRAME_DIMENSIONS.width / 2)
		// 	.attr("y2", this.FRAME_DIMENSIONS.height / 2)
		// 	.attr("marker-end", "url(#arrow)");

		// const pointerText = frameGroup
		// 	.append("text")
		// 	.filter((d) => d.pointer)
		// 	.attr("fill", "black")
		// 	.attr("x", -this.FRAME_DIMENSIONS.width)
		// 	.attr("dx", "-0.3em")
		// 	.attr("y", this.FRAME_DIMENSIONS.height / 1.5)
		// 	.attr("text-anchor", "end")
		// 	.style("font-family", "Monospace")
		// 	.style("font-size", "0.9em")
		// 	.text((d) => d.pointer);

		const dataLabel = frameGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("x", this.scaleX.bandwidth() / 2)
			.attr("y", this.scaleY.bandwidth() / 2)
			.attr("dy", 5)
			.text((d) => `${d.val}`)
			.style("font-family", "Fira")
			.style("font-size", `0.8rem`)
			.attr("fill", (d) => {
				if (d.colors && d.colors?.text) {
					return d.colors.text;
				} else {
					return this.COLORS.textColor;
				}
			});
	}
}
