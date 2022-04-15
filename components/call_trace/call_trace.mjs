export class CallTrace extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "70%";
		this.containerHeightDefault = "35%";
		this.NODE_COUNT = this.OBJ.data.length;
		this.svg_width = this.OBJ.svg_width ? this.OBJ.svg_width : 300;
		this.svg_height = this.OBJ.svg_height ? this.OBJ.svg_height : 150;
		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;

		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;

		this.MARGIN = {
			top: this.OBJ.margin ? this.OBJ.margin[0] : 20,
			right: this.OBJ.margin ? this.OBJ.margin[1] : 20,
			bottom: this.OBJ.margin ? this.OBJ.margin[2] : 20,
			left: this.OBJ.margin ? this.OBJ.margin[3] : 20,
		};
		this.DIMENSIONS = {
			width: this.svg_width - this.MARGIN.left - this.MARGIN.right,
			height: this.svg_height - this.MARGIN.top - this.MARGIN.bottom,
			edgeStroke: 1,
			strokeWidth: 1,
			radius: 10,
			fontSize: "0.6rem",
			annotationFontSize: "0.7rem",
			edgeLabelFontSize: "0.65rem",
			levelFontSize: "0.85rem",
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

		this.ROOT = d3
			.stratify()
			.id((d) => d.child)
			.parentId((d) => d.parent)(this.OBJ.data);

		this.sibSpace = this.OBJ.sibSpace ? this.OBJ.sibSpace : 1;
		this.nsibSpace = this.OBJ.nsibSpace ? this.OBJ.nsibSpace : 2;

		this.treeStructure = d3
			.tree()
			.size([this.DIMENSIONS.height, this.DIMENSIONS.width])
			.separation((a, b) =>
				a.parent == b.parent ? this.sibSpace : this.nsibSpace,
			);

		this.ROOT = this.treeStructure(this.ROOT);
		this.NODES = this.ROOT.descendants();
		this.LINKS = this.ROOT.links();
		this.diagonal = (from, to) => {
			const midX = (from.y + to.y) / 2;
			return `M ${from.y},${from.x} C ${midX},${from.x} ${midX},${to.x} ${to.y},${to.x}`;
		};
	}

	render() {
		const colors = {
			stroke: "#316B83",
			nodeStroke: "#316B83",
			nodeFill: "#C1FFD7",
			leafFill: "#FF0000",
			leafStroke: "#3D0000",
			fill: "white",
			text: "black",
		};

		const arrow = this.SVG.append("svg:defs")
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", "ctend")
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 19)
			.attr("refY", 0)
			.attr("fill", colors.stroke)
			.attr("markerWidth", 6)
			.attr("markerHeight", 8)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");
		const g = this.SVG.append("g");
		const link = g
			.selectAll(".link")
			.data(this.LINKS)
			.enter()
			.filter((d) => !(d.source.data.display || d.target.data.display))
			.append("path")
			.attr("fill", "none")
			.attr("d", (d) => this.diagonal(d.source, d.target))
			.attr("stroke", colors.stroke)
			.attr("marker-end", "url(#ctend)");
		const node = g
			.selectAll(".node")
			.data(this.NODES)
			.enter()
			.filter((d) => !(d.data.display === "none"))
			.append("g")
			.attr("class", function (d) {
				return "node" + (d.children ? " node--internal" : " node--leaf");
			})
			.attr("transform", function (d) {
				return "translate(" + d.y + "," + d.x + ")";
			});

		// adds the circle to the node
		node
			.append("circle")
			.attr("r", 5)
			.attr("fill", (d) => {
				if (d.data.colors) {
					return d.data.colors?.fill;
				} else if (d.children || d.data.call) {
					return colors.nodeFill;
				} else {
					return colors.leafFill;
				}
			})
			.attr("stroke", (d) => {
				if (d.data.colors) {
					return d.data.colors?.stroke;
				} else if (d.children || d.data.call) {
					return colors.nodeStroke;
				} else {
					return colors.leafStroke;
				}
			});

		// adds the text to the node
		node
			.append("text")
			.attr("dy", (d, i) => {
				if (!d.children) {
					return "-1em";
				} else if (i % 2 === 0) {
					return "-1em";
				} else {
					return "2em";
				}
			})
			.attr("font-family", "Fira")
			.attr("font-size", this.DIMENSIONS.fontSize)
			.attr("fill", colors.text)
			.attr("x", function (d) {
				return d.children ? -5 : 5;
			})
			.style("text-anchor", (d) => {
				if (d.data.anchor) {
					return d.data.anchor;
				} else {
					return d.children ? "end" : "start";
				}
			})
			.text((d) => d.id);

		const pointer = node
			.filter((d) => d.data.pointer)
			.append("text")
			.attr("font-family", "Fira")
			.attr("text-anchor", "middle")
			.attr("dy", (d) => d.x * 2)
			.attr("font-size", this.DIMENSIONS.fontSize)
			.text((d) => d.data.pointer);

		const pointerArrow = node
			.filter((d) => d.data.pointer)
			.append("path")
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr(
				"d",
				(d) =>
					`M ${0} ${this.DIMENSIONS.radius * 2.8} L ${0} ${
						this.DIMENSIONS.radius
					} Z`,
			);
	}
}
