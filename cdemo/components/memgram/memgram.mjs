export class Memgram extends D3Base {
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
		this.DATA = this.OBJ.registers;
		this.REGISTER_COUNT = this.OBJ.registers.length;
		this.MARGIN = {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
		};
		this.REGISTER_DIMENSIONS = {
			width: 60,
			height: 20,
		};
		this.SCALE = d3
			.scaleBand()
			.domain(this.DATA)
			.range([0, this.REGISTER_COUNT * 28]);
		this.COLORS = {
			registerColor: "rgba(48, 71, 94, 0.9)",
			registerContentColor: "#EEEEEE",
			addressTextColor: "#EEEEEE",
		};
	}
	render() {
		const registerGroup = this.SVG.selectAll("g")
			.data(this.DATA)
			.enter()
			.append("g")
			.attr(
				"transform",
				(d) => `translate(${this.DIMENSIONS.width / 2}, ${this.SCALE(d)})`,
			);

		const data = registerGroup
			.append("rect")
			.attr("x", this.REGISTER_DIMENSIONS.width / 2)
			.attr("y", 0)
			.attr("fill", (d) => {
				if (d.focus) {
					return d.focus;
				} else {
					return this.COLORS.registerContentColor;
				}
			})
			.attr("stroke", "lightgrey")
			.attr("height", this.REGISTER_DIMENSIONS.height)
			.attr("width", this.REGISTER_DIMENSIONS.width)
			.attr("filter", "drop-shadow(0px 3px 0px rgba(0, 0, 0, 0.4))");

		const register = registerGroup
			.append("rect")
			.attr("x", -this.REGISTER_DIMENSIONS.width / 2)
			.attr("y", 0)
			.attr("fill", (d) => {
				if (d.focus) {
					return d.focus;
				} else {
					return this.COLORS.registerColor;
				}
			})
			.attr("stroke", "#30475E")
			.attr("height", this.REGISTER_DIMENSIONS.height)
			.attr("width", this.REGISTER_DIMENSIONS.width)
			.attr("filter", "drop-shadow( 0px 3px 0px rgb(48, 71, 94))");

		const address = registerGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("x", 0)
			.attr("y", this.REGISTER_DIMENSIONS.height / 2)
			.attr("dy", 5)
			.text((d) => (d.ad ? d.ad : "⋮"))
			.style("font-family", "system-ui")
			.style("font-size", "0.75rem")
			.attr("fill", this.COLORS.addressTextColor);

		const registerName = registerGroup
			.append("text")
			.attr("text-anchor", "end")
			.attr("x", -this.REGISTER_DIMENSIONS.width / 1.5)
			.attr("y", this.REGISTER_DIMENSIONS.height / 2)
			.attr("dy", 5)
			.text((d) => (d.id ? d.id : "⋮"))
			.style("font-family", "system-ui")
			.style("font-size", "0.75rem")
			.attr("fill", "black");

		const dataLabel = registerGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("x", this.REGISTER_DIMENSIONS.width)
			.attr("y", this.REGISTER_DIMENSIONS.height / 2)
			.attr("dy", 5)
			.text((d) => (d.val ? d.val : "⋮"))
			.style("font-family", "system-ui")
			.style("font-size", "0.75rem")
			.attr("fill", "black");
	}
}
