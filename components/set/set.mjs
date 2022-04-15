export class Set extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "80%";
		this.containerHeightDefault = "50%";
		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;
		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;
		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 300;
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 250;
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
		};
		this.SCALE = d3
			.scaleBand()
			.domain(d3.range(this.NODE_COUNT))
			.rangeRound([0, this.DIMENSIONS.height]);
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

		this.NODES = this.OBJ.data.nodes;
		this.EDGES = this.OBJ.data.edges;
		this.COLLISION_RADIUS = this.OBJ.collide ? this.OBJ.collide : 30;
		this.FORCE_STRENGTH = this.OBJ.strength ? this.OBJ.strength : 1;
		this.FORCE_DISTANCE = this.OBJ.distance ? this.OBJ.distance : 1;
		this.NODE_COUNT = this.NODES.length;
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
		this.COLORS = {
			nodeColor: "rgba(255, 253, 222, 0.1)",
			nodeOutlineColor: "#DAB88B",
			radialNodeColor: "#C8F2EF",
			radialNodeOutlineColor: "#54BAB9",
			edgeLabelColor: "#5EAAA8",
			linkColor: this.OBJ.linkColor ? this.OBJ.linkColor : "#ECA6A6",
			textColor: "black",
		};

		this.defaultRadius = this.OBJ.radius ? this.OBJ.radius : 50;

		if (!this.OBJ.undirected) {
			this.ARROW = this.SVG.append("svg:defs")
				.selectAll("marker")
				.data(["end"])
				.enter()
				.append("svg:marker")
				.attr("id", String)
				.attr("viewBox", "0 -5 10 10")
				.attr("refX", 16)
				.attr("refY", 0)
				.attr("markerWidth", 10)
				.attr("markerHeight", 10)
				.attr("orient", "auto")
				.append("svg:path")
				.attr("d", "M0,-5L10,0L0,5")
				.attr("fill", () => {
					if (this.OBJ.linkColor) {
						return this.OBJ.linkColor;
					} else {
						return this.COLORS.linkColor;
					}
				});
		}

		this.FORCE = d3
			.forceSimulation(this.NODES)
			.force("charge", d3.forceManyBody().strength(this.FORCE_STRENGTH))
			.force(
				"link",
				d3.forceLink(this.EDGES).distance(this.FORCE_DISTANCE),
			)
			.force(
				"center",
				d3
					.forceCenter()
					.x(this.DIMENSIONS.width / 2)
					.y(this.DIMENSIONS.height / 2),
			)
			.force("collision", d3.forceCollide().radius(this.COLLISION_RADIUS));
	}
	render() {
		const nodeGroup = this.SVG.selectAll("g")
			.data(this.NODES)
			.enter()
			.append("g");

		const node = nodeGroup
			.append("circle")
			.attr("fill", (d) => {
				if (d.fill) {
					return d.fill[0];
				} else if (d.radial) {
					return this.COLORS.radialNodeColor;
				} else {
					return this.COLORS.nodeColor;
				}
			})
			.attr("stroke", (d) => {
				if (d.fill) {
					return d.fill[1];
				} else if (d.radial) {
					return this.COLORS.radialNodeOutlineColor;
				} else {
					return this.COLORS.nodeOutlineColor;
				}
			})
			.attr("r", (d) =>
				d.radius ? d.radius : this.SCALE(this.defaultRadius),
			);

		const nodeLabel = nodeGroup
			.append("text")
			.text((d) => d.name)
			.attr("text-anchor", "middle")
			.attr("fill", this.COLORS.textColor)
			.style("font-family", "Fira")
			.style("font-size", "0.65rem");

		const nodes = this.NODES;
		const radius = this.defaultRadius;

		this.FORCE.on("tick", function () {
			node
				.attr("r", (d, i) => {
					if (d.subset >= 0) {
						return radius / (i * 2);
					} else {
						return radius;
					}
				})
				.attr("cx", (d, i) => {
					if (d.subset >= 0) {
						return (d.x = nodes[d.subset].x);
					} else {
						return d.x;
					}
				})
				.attr("cy", (d, i) => {
					if (d.subset >= 0) {
						return (d.y = nodes[d.subset].y);
					} else {
						return d.y;
					}
				});
			nodeLabel
				.attr("x", (d) => d.x)
				.attr("y", (d) => d.y)
				.attr("dy", (d, i) => {
					if (d.subset >= 0) {
						return -radius + radius / (i * 1.1);
					} else {
						return -radius - 2;
					}
				});
		});
	}
}
