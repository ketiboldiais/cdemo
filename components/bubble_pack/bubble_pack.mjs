export class BubblePack extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "100%";
		this.setCount = this.OBJ.data.length;
		this.containerHeightDefault = "100%";
		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;

		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;

		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 200;
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 200;
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
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
		this.MARGIN = {
			top: 30,
			right: 30,
			bottom: 30,
			left: 30,
		};
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.bottom,
		};
		this.COLORS = {
			nodeColor: "#FFFDDE",
			nodeOutlineColor: "#DAB88B",
			radialNodeColor: "#C8F2EF",
			radialNodeOutlineColor: "#54BAB9",
			edgeLabelColor: "#5EAAA8",
			linkColor: this.OBJ.linkColor ? this.OBJ.linkColor : "#ECA6A6",
			textColor: "black",
		};
		this.STRATIFY = d3
			.stratify()
			.id((d) => d.name)
			.parentId((d) => d.parent);
		this.ROOT_NODE = this.STRATIFY(this.OBJ.data).sum((d) => d.set.length);
		this.PACK = d3
			.pack()
			.size([this.DIMENSIONS.width, this.DIMENSIONS.height])
			.padding(10);
		this.BUBBLE_DATA = this.PACK(this.ROOT_NODE).descendants();
	}
	render() {
		const nodes = this.SVG.selectAll("g")
			.data(this.BUBBLE_DATA)
			.enter()
			.append("g")
			.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
		nodes
			.append("circle")
			.attr("r", (d, i) => {
				return d.r;
			})
			.attr("stroke", "#323232")
			.attr("stroke-width", "1")
			.attr("fill", (d) => "white");
		nodes
			.filter((d) => !d.children)
			.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "0.3em")
			.attr("fill", "black")
			.style("font-size", (d) => "0.4rem")
			.text((d) => d.data.name);
		nodes
			.filter((d) => d.children)
			.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", (d) => -d.r - 10)
			.attr("fill", "#323232")
			.style("font-size", "0.4rem")
			.text((d) => d.data.name);
	}
}
