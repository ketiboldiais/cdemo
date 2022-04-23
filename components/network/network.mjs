import D3Base from "../../core/d3_base/D3Base.mjs";

export class Network extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(10, 10, 10, 10);
		this.svg = () => this.setSVGDimensions(300, 250);
		this.SVG_CONTAINER = this.generateSVGContainer(60, 60);
		this.SVG = this.generateSVG();
		
		this.containerWidthDefault = "60%";

		this.containerHeightDefault = "50%";

		this.EDGES = this.OBJ.data;

		this.generateNode = () => {
			let nodes = {};
			this.EDGES.forEach(function (link) {
				if (link.hasOwnProperty("sattr")) {
					nodes[link.source] = { name: link.source, attr: link.sattr };
				}
				if (link.hasOwnProperty("tattr")) {
					nodes[link.target] = { name: link.target, attr: link.tattr };
				}
				link.source =
					nodes[link.source] ||
					(nodes[link.source] = { name: link.source });
				link.target =
					nodes[link.target] ||
					(nodes[link.target] = { name: link.target });
			});
			return nodes;
		};

		this.isDirected = this.OBJ.directed ? this.OBJ.directed : false;

		this.NODES = Object.values(this.generateNode());
		this.COLLISION_RADIUS = this.OBJ.collide ? this.OBJ.collide : 20;
		this.FORCE_STRENGTH = this.OBJ.strength ? this.OBJ.strength : -1;
		this.FORCE_DISTANCE = this.OBJ.distance ? this.OBJ.distance : 1;
		this.NODE_COUNT = this.NODES.length;

		this.COLORS = {
			nodeColor: "#FFFDDE",
			nodeOutlineColor: "#DAB88B",
			radialNodeColor: "#C8F2EF",
			radialNodeOutlineColor: "#54BAB9",
			edgeLabelColor: "#5EAAA8",
			linkColor: this.OBJ.linkColor ? this.OBJ.linkColor : "#ECA6A6",
			textColor: "currentColor",
		};

		if (this.isDirected) {
			this.ARROW = this.SVG.append("svg:defs")
				.selectAll("marker")
				.data(["end"])
				.enter()
				.append("svg:marker")
				.attr("id", "networkArrow")
				.attr("viewBox", "0 -5 10 10")
				.attr("refX", 16)
				.attr("refY", 0)
				.attr("markerWidth", 8)
				.attr("markerHeight", 8)
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
					.x(this.svg().width / 2)
					.y(this.svg().height / 2),
			)
			.force("collision", d3.forceCollide().radius(this.COLLISION_RADIUS));
	}
	render() {
		const edges = this.SVG.selectAll("line")
			.data(this.EDGES)
			.enter()
			.append("line")
			.style("stroke", this.COLORS.linkColor)
			.style("stroke-width", 1)
			.attr("fill", "none")
			.attr("marker-end", "url(#networkArrow)");

		const edgeLabel = this.SVG.selectAll("text")
			.data(this.EDGES)
			.enter()
			.append("text")
			.attr("text-anchor", "middle")
			.attr("fill", this.COLORS.edgeLabelColor)
			.style("font-family", "system-ui")
			.style("font-size", "0.65rem")
			.text((d) => d.label);

		const nodeGroup = this.SVG.selectAll("g")
			.data(this.NODES)
			.enter()
			.append("g");

		const node = nodeGroup
			.append("circle")
			.attr("fill", (d) => {
				if (d?.attr?.fill) {
					return d.attr.fill;
				} else if (d?.attr?.radial) {
					return this.COLORS.radialNodeColor;
				} else {
					return this.COLORS.nodeColor;
				}
			})
			.attr("stroke", (d) => {
				if (d?.attr?.stroke) {
					return d.attr.stroke;
				} else if (d?.attr?.radial) {
					return this.COLORS.radialNodeOutlineColor;
				} else {
					return this.COLORS.nodeOutlineColor;
				}
			})
			.attr("r", (d) => (d.radius ? d.radius : 5));

		const radialNode = nodeGroup
			.filter((d) => d?.attr?.radial)
			.append("circle")
			.attr("fill", this.COLORS.radialNodeColor)
			.attr("stroke", this.COLORS.radialNodeOutlineColor)
			.attr("opacity", 0.4)
			.attr("r", (d) => d.attr.radial);

		const nodeLabel = nodeGroup
			.append("text")
			.text((d) => d.name)
			.attr("text-anchor", "middle")
			.attr("dx", "-1.3em")
			.attr("fill", this.COLORS.textColor)
			.style("font-family", "system-ui")
			.style("font-size", "0.6rem");

		this.FORCE.on("tick", function () {
			edges
				.attr("x1", (d) => d.source.x)
				.attr("y1", (d) => d.source.y)
				.attr("x2", (d) => d.target.x)
				.attr("y2", (d) => d.target.y);
			edgeLabel
				.attr("x", (d) => (d.source.x + d.target.x) / 2)
				.attr("y", (d) => (d.source.y + d.target.y) / 2);
			node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
			radialNode.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
			nodeLabel.attr("x", (d) => d.x).attr("y", (d) => d.y);
		});
	}
}
