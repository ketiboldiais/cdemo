import D3Base from "../../core/d3_base/D3Base.mjs";

export class Sequence extends D3Base {
	constructor(obj) {
		super(obj);
		this.FRAME_COUNT = this.OBJ.data.length;
		this.SEQUENCE_NAME = this.OBJ.name;
		this.userMargin = this.OBJ.margin ? this.OBJ.margin : false;

		this.containerWidthDefault = "50%";
		this.containerHeightDefault = "15%";

		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;

		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;

		// Set the SVG's width
		this.SVG_WIDTH = this.OBJ.svg_width
			? this.OBJ.svg_width
			: this.FRAME_COUNT * 30;

		// Set the SVG's height
		this.SVG_HEIGHT = this.OBJ.svg_height
			? this.OBJ.svg_height
			: this.FRAME_COUNT * 30;

		this.MARGIN = {
			top: this.userMargin[0] ? this.userMargin[0] : 20,
			left: this.userMargin[1] ? this.userMargin[1] : 5,
			bottom: this.userMargin[2] ? this.userMargin[2] : 20,
			right: this.userMargin[3] ? this.userMargin[3] : 20,
		};

		// Set the SVG's dimensions
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
			.style('display', 'inline-block')
			.style('position', 'absolute')
			.style('top', '0')
			.style('left', '0')
			.append("g")
			.attr(
				"transform",
				`translate(${this.MARGIN.left}, ${this.MARGIN.top})`,
			);

		// Arrow Definitions
		this.indexed = this.OBJ.indexed === false ? this.OBJ.indexed : true;

		this.DATA = this.OBJ.data;

		this.scaleY = d3
			.scaleBand()
			.domain(this.DATA)
			.range([0, this.DIMENSIONS.height])
			.paddingInner(0);

		this.scaleX = d3
			.scaleBand()
			.domain(this.DATA)
			.range([0, this.DIMENSIONS.width])
			.paddingInner(0.7);

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
			.attr("class", "sequence-element")
			.attr("transform", (d) => `translate(${this.scaleX(d)}, 0)`);

		if (this.SEQUENCE_NAME) {
			const sequenceName = this.SVG.select("g")
				.append("text")
				.attr("text-anchor", "middle")
				.attr("x", this.DIMENSIONS.width / 2)
				.attr("y", -this.scaleY.bandwidth() / 1.5)
				.attr("dy", 5)
				.text(this.SEQUENCE_NAME)
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

		if (this.indexed) {
			frameGroup
				.append("text")
				.attr("text-anchor", "middle")
				// .attr("x", 0)
				.attr("x", this.scaleY.bandwidth() / 2)
				.attr("y", this.scaleY.bandwidth() + this.scaleY.bandwidth() / 4)
				.attr("dy", "0.5em")
				.text((d, i) => i)
				.style("font-family", "system-ui")
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

		const annotation = frameGroup
			.filter((d) => d.ant)
			.append("text")
			.attr("text-anchor", "middle")
			.attr("x", this.scaleY.bandwidth() / 2)
			.attr("y", -this.scaleY.bandwidth() / 2)
			.text((d) => `${d.ant}`)
			.style("font-family", "system-ui")
			.style("font-size", `0.7rem`)
			.attr("fill", this.COLORS.textColor);

		const dataLabel = frameGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("x", this.scaleY.bandwidth() / 2)
			.attr("y", this.scaleY.bandwidth() / 2)
			.attr("dy", 5)
			.text((d) => `${d.val}`)
			.style("font-family", "system-ui")
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