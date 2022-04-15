export class Stack extends D3Base {
	constructor(obj) {
		super(obj);
		this.FRAME_COUNT = this.OBJ.data.length;
		this.containerWidthDefault = "40%";

		this.containerHeightDefault = `8%`;

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

		this.DATA = this.OBJ.data;
		this.MARGIN = {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		};
		this.FRAME_DIMENSIONS = {
			width: this.OBJ.frameWidth ? this.OBJ.frameWidth : 60,
			height: this.OBJ.frameHeight ? this.OBJ.frameHeight : 20,
		};
		this.SCALE = d3
			.scaleBand()
			.domain(this.DATA)
			.range([0, this.FRAME_COUNT * 23]);

		this.COLORS = {
			frameColor: this.OBJ.palette
				? this.palette(this.OBJ.palette).fill
				: this.palette("darkRedScheme").fill,
			frameStrokeColor: this.OBJ.palette
				? this.palette(this.OBJ.palette).stroke
				: this.palette("darkRedScheme").stroke,
			textColor: this.OBJ.palette
				? this.palette(this.OBJ.palette).text
				: this.palette("darkRedScheme").text,
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
			.attr(
				"transform",
				(d) => `translate(${this.DIMENSIONS.width / 2}, ${this.SCALE(d)})`,
			);

		const rect = frameGroup
			.append("rect")
			.attr("stroke", this.COLORS.frameStrokeColor)
			.attr("x", (d) => {
				if (d.popped) {
					return this.FRAME_DIMENSIONS.width / 2;
				} else {
					return -this.FRAME_DIMENSIONS.width / 2;
				}
			})
			.attr("y", 0)
			.attr("fill", (d) => {
				if (d.fill) {
					return d.fill;
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
			.attr("height", this.FRAME_DIMENSIONS.height)
			.attr("width", this.FRAME_DIMENSIONS.width);

		const pointer = frameGroup
			.append("line")
			.filter((d) => d.pointer)
			.attr("stroke", this.COLORS.frameStrokeColor)
			.attr("x1", -this.FRAME_DIMENSIONS.width)
			.attr("y1", this.FRAME_DIMENSIONS.height / 2)
			.attr("x2", -this.FRAME_DIMENSIONS.width / 2)
			.attr("y2", this.FRAME_DIMENSIONS.height / 2)
			.attr("marker-end", "url(#arrow)");

		const pointerText = frameGroup
			.append("text")
			.filter((d) => d.pointer)
			.attr("fill", "black")
			.attr("x", -this.FRAME_DIMENSIONS.width)
			.attr("dx", "-0.3em")
			.attr("y", this.FRAME_DIMENSIONS.height / 1.5)
			.attr("text-anchor", "end")
			.style("font-family", "Monospace")
			.style("font-size", "0.9em")
			.text((d) => d.pointer);

		const dataLabel = frameGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("x", (d) => {
				if (d.popped) {
					return this.FRAME_DIMENSIONS.width;
				} else {
					return 0;
				}
			})
			.attr("y", this.FRAME_DIMENSIONS.height / 2)
			.attr("dy", 5)
			.text((d) => `${d.val}`)
			.style("font-family", "Fira")
			.style("font-size", "0.75rem")
			.attr("fill", (d) => (d.text ? d.text : this.COLORS.textColor));
	}
}
