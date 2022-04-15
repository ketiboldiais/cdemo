export class Queue extends D3Base {
	constructor(obj) {
		super(obj);
		this.DATA = this.OBJ.data;
		this.FRAME_COUNT = this.DATA.length;
		this.containerWidthDefault = "35%";
		this.containerHeightDefault = "13%";

		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;

		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;

		// Set the SVG's width
		this.SVG_WIDTH = this.OBJ.svg_width
			? this.OBJ.svg_width
			: this.FRAME_COUNT * 60;

		// Set the SVG's height
		this.SVG_HEIGHT = this.OBJ.svg_height
			? this.OBJ.svg_height
			: this.FRAME_COUNT * 100;

		this.MARGIN = {
			top: 20,
			right: 20,
			bottom: 20,
			left: 20,
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

		this.xSCALE = d3
			.scaleBand()
			.domain(d3.range(this.FRAME_COUNT))
			.rangeRound([0, this.DIMENSIONS.width])
			.paddingInner(0.1);
		this.ySCALE = d3
			.scaleBand()
			.domain(d3.range(this.FRAME_COUNT))
			.range([this.DIMENSIONS.height, 0]);
	}

	render() {
		const arrows = this.SVG.append("svg:defs")
			.attr("id", "arrow")
			.append("svg:marker")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 80)
			.attr("refY", 0)
			.attr("markerWidth", 8)
			.attr("markerHeight", 8)
			.attr("orient", "auto")
			.attr("fill", "#000")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");
		const queueGroup = this.SVG.selectAll("g")
			.data(this.DATA)
			.enter()
			.append("g")
			.attr("transform", (d, i) => `translate(${this.xSCALE(i)}, 0)`);
		const dataFrame = queueGroup
			.append("rect")
			.attr("width", this.xSCALE.bandwidth())
			.attr("height", this.ySCALE.bandwidth() * 0.75)
			.attr("fill", "white")
			.attr("stroke", "#C3DBD9");
		const indexFrame = queueGroup
			.append("rect")
			.attr("width", this.xSCALE.bandwidth())
			.attr("height", this.ySCALE.bandwidth() * 0.25)
			.attr("y", this.ySCALE.bandwidth() / 2)
			.attr("fill", "#EFFFFD")
			.attr("stroke", "#C3DBD9");
		const dataLabel = queueGroup
			.append("text")
			.attr("text-anchor", "middle")
			// .attr("fill", "#1572A1")
			.attr("fill", "#709FB0")
			.attr("x", this.xSCALE.bandwidth() / 2)
			.attr("y", this.ySCALE.bandwidth() / 4)
			.attr("dy", "0.4em")
			.style("font-family", "Fira")
			.style("font-size", "1.2rem")
			.text((d) => d.val);
		const indexLabel = queueGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("fill", "#8AC6D1")
			.attr("x", this.xSCALE.bandwidth() / 2)
			.attr("y", this.ySCALE.bandwidth() / 1.65)
			.attr("dy", "0.4em")
			.style("font-family", "system-ui")
			.style("font-size", "0.9rem")
			.text((d, i) => i);
	}
}
