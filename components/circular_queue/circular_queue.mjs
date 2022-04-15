export class CircularQueue extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "50%";

		this.containerHeightDefault = "25%";

		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;

		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;

		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 300;

		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 150;

		this.MARGIN = {
			top: 65,
			right: 105,
			bottom: 110,
			left: 140,
		};

		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.bottom,
		};

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
		this.DATA = obj.data;
		this.SECTIONS = [];
		for (let i = 0; i < this.DATA.length; i++) {
			this.SECTIONS.push(1);
		}

		this.ATTRIBUTES = {
			edgeStroke: 1,
			strokeWidth: 1,
			radius: "0.65rem",
			outerRadius: this.DIMENSIONS.width / 2,
			innerRadius: 50,
			fontSize: "0.85rem",
			edgeLabelFontSize: "0.65rem",
			levelFontSize: "0.85rem",
		};
		this.SCALE = d3
			.scaleLinear()
			.domain([0, d3.max(this.DATA, (d) => d[0])])
			.range([0, this.DIMENSIONS.width]);
		this.pie = d3.pie();
		this.DATA_READY = this.pie(this.SECTIONS);
		this.PIE_DATA = this.pie(this.DATA);
		this.ARC = d3
			.arc()
			.innerRadius(this.ATTRIBUTES.innerRadius)
			.outerRadius(this.ATTRIBUTES.outerRadius);
		this.INDEX_ARC = d3
			.arc()
			.innerRadius(this.ATTRIBUTES.innerRadius * 1.5)
			.outerRadius(this.ATTRIBUTES.outerRadius * 1.8);
		this.ANNOTATION_ARC = d3
			.arc()
			.innerRadius(this.ATTRIBUTES.innerRadius * 1.6)
			.outerRadius(this.ATTRIBUTES.outerRadius * 2.6);

		this.IsIndexed = obj.indexed ? obj.indexed : false;
	}
	render() {
		const paths = this.SVG.selectAll("paths")
			.data(this.DATA_READY)
			.enter()
			.append("path")
			.attr("d", (d) => this.ARC(d))
			.attr("fill", "white")
			.attr("stroke", "black")
			.attr("stroke-width", "1px");

		const labels = this.SVG.selectAll("labels")
			.data(this.DATA_READY)
			.enter()
			.append("text")
			.attr("dy", "0.3em")
			.style("text-anchor", "middle")
			.style("font-family", "Fira")
			.style("font-size", "0.6rem")
			.attr("transform", (d) => `translate(${this.ARC.centroid(d)})`)
			.data(this.PIE_DATA)
			.attr("fill", "black")
			.text((d) => d.data.val);

		const annotations = this.SVG.selectAll("anns")
			.data(this.DATA_READY)
			.enter()
			.append("text")
			.attr("dy", "0.3em")
			.style("font-family", "Fira")
			.attr("dx", (d, i) => -1 * this.ARC.centroid(d)[0] * 4.4)
			.style("font-size", "0.6rem")
			.attr(
				"transform",
				(d) => `translate(${this.ANNOTATION_ARC.centroid(d)})`,
			)
			.data(this.PIE_DATA)
			.attr("fill", "black")
			.attr("text-anchor", (d) =>
				d.data.anchor ? d.data.anchor : "middle",
			)
			.text((d) => d.data.annotate);

		if (this.IsIndexed) {
			const indices = this.SVG.selectAll("indices")
				.data(this.DATA_READY)
				.enter()
				.append("text")
				.attr("dy", "0.3em")
				.style("font-family", "Fira")
				.style("font-size", "0.6rem")
				.attr("fill", "black")
				.attr(
					"transform",
					(d) => `translate(${this.INDEX_ARC.centroid(d)})`,
				)
				.data(this.PIE_DATA)
				.text((d, i) => i);
		}
	}
}
