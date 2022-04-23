import CSMD from "../core/csmd/csmd.mjs";
import D3Base from "../core/d3_base/D3Base.mjs";
import { LinkedList } from "../components/linked_list/LinkedList.mjs";
import { Plot } from "../components/plot/plot.mjs";
import { TruthTable } from "../components/truth_table/truth_table.mjs";
import { Matrix } from "../components/matrix/matrix.mjs";
import { Sequence } from "../components/sequence/sequence.mjs";
import { Network } from "../components/network/network.mjs";
import { Graph } from "../components/graph/graph.mjs";
import { Tree } from "../components/tree/tree.mjs";
import { Plot3d } from "../components/plot3d/plot3d.mjs";

export const cdemo = {
	linkedList: (obj) => new LinkedList(obj).render(),
	plot: (obj) => new Plot(obj).render(),
	plot3d: (obj) => new Plot3d(obj).render(),
	truthTable: (obj) => new TruthTable(obj).render(),
	matrix: (obj) => new Matrix(obj).render(),
	array: (obj) => new Sequence(obj).render(),
	network: (obj) => new Network(obj).render(),
	graph: (obj) => new Graph(obj).render(),
	tree: (obj) => new Tree(obj).render(),
}

export class Digraph extends D3Base {
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

		// The SVG container is <div> that wraps the SVG. This allows for resizing.
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
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

		this.COLORS = {
			nodeColor: "#FFFDDE",
			nodeOutlineColor: "#DAB88B",
			radialNodeColor: "#C8F2EF",
			radialNodeOutlineColor: "#54BAB9",
			edgeLabelColor: "#5EAAA8",
			linkColor: this.OBJ.linkColor ? this.OBJ.linkColor : "#ECA6A6",
			textColor: "black",
		};

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
					.x(this.DIMENSIONS.width / 2)
					.y(this.DIMENSIONS.height / 2),
			)
			.force("collision", d3.forceCollide().radius(this.COLLISION_RADIUS));
	}
	render() {
		const edges = this.SVG.selectAll("line")
			.data(this.EDGES)
			.enter()
			// .append("path")
			.append("line")
			.style("stroke", this.COLORS.linkColor)
			.style("stroke-width", 1)
			.attr("fill", "none")
			.attr("marker-end", "url(#end)");

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
			.attr("r", (d) => (d.radius ? d.radius : 8));

		const radialNode = nodeGroup
			.filter((d) => d.radial)
			.append("circle")
			.attr("fill", this.COLORS.radialNodeColor)
			.attr("stroke", this.COLORS.radialNodeOutlineColor)
			.attr("opacity", 0.4)
			.attr("r", (d) => d.radial);

		const nodeLabel = nodeGroup
			.append("text")
			.text((d) => d.name)
			.attr("text-anchor", "middle")
			.attr("dx", "-1.3em")
			.attr("fill", this.COLORS.textColor)
			.style("font-family", "system-ui")
			.style("font-size", "0.65rem");

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
			.style("display", "block")
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
			.style("font-family", "system-ui")
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
			.style("font-family", "system-ui")
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
				.style("font-family", "system-ui")
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
			.style("display", "block")
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
			.style("font-family", "system-ui")
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

export class BarGraph extends D3Base {
	constructor(obj) {
		super(obj);
		this.userData = this.OBJ.data;

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

		this.MARGIN = {
			top: 15,
			right: 10,
			bottom: 20,
			left: 30,
		};

		// Set the SVG's dimensions
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
		};

		// The SVG container is <div> that wraps the SVG. This allows for resizing.
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
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
		this.DATA = {
			x: d3
				.scaleBand()
				.range([0, this.DIMENSIONS.width], 0.05)
				.padding(0.05),
			y: d3.scaleLinear().range([this.DIMENSIONS.height, 0]),
		};
		this.AXIS = {
			x: d3.axisBottom().scale(this.DATA.x),
			y: d3.axisLeft().scale(this.DATA.y),
		};
		this.DATA.x.domain(
			this.userData.map((d) => {
				return d.x;
			}),
		);
		this.DATA.y.domain([
			0,
			d3.max(this.userData, (d) => {
				return d.y;
			}),
		]);
	}
	render() {
		const xAxis = this.SVG.append("g")
			.attr("transform", `translate(0, ${this.DIMENSIONS.height})`)
			.call(this.AXIS.x)
			.selectAll("text")
			.style("text-anchor", "end");
		const yAxis = this.SVG.append("g")
			.call(this.AXIS.y)
			.style("text-anchor", "end");
		const bars = this.SVG.selectAll("bar")
			.data(this.userData)
			.enter()
			.append("rect")
			.attr("fill", "red")
			.attr("x", (d) => this.DATA.x(d.x))
			.attr("y", (d) => this.DATA.y(d.y))
			.attr("height", (d) => this.DIMENSIONS.height - this.DATA.y(d.y))
			.attr("width", this.DATA.x.bandwidth());
		const barLabel = this.SVG.selectAll("label")
			.data(this.userData)
			.enter()
			.append("text")
			.attr("fill", "black")
			.attr("x", (d) => this.DATA.x(d.x))
			.attr("y", (d) => this.DATA.y(d.y))
			.attr("dx", (d) => this.DATA.x.bandwidth() / 2)
			.attr("dy", -2)
			.attr("text-anchor", "middle")
			.text((d) => d.label);
	}
}

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
			.style("display", "block")
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

export class Flowchart extends D3Base {
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
			.style("display", "block")
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
		this.COLLISION_RADIUS = this.OBJ.collide ? this.OBJ.collide : 60;
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
			nodeColor: "#FFFDDE",
			nodeOutlineColor: "#DAB88B",
			radialNodeColor: "#C8F2EF",
			radialNodeOutlineColor: "#54BAB9",
			edgeLabelColor: "#5EAAA8",
			linkColor: "#96C7C1",
			textColor: "black",
		};

		// Arrow Definitions

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
		this.SVG.append("svg:defs")
			.selectAll("marker")
			.data(this.EDGES)
			.enter()
			.append("svg:marker")
			.attr("viewBox", "0 -5 10 10")
			.attr("id", "arrowEnd")
			.attr("refX", 80)
			.attr("refY", 0)
			.attr("markerWidth", 6)
			.attr("markerHeight", 6)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5")
			.attr("fill", this.COLORS.linkColor);

		const edges = this.SVG.selectAll("line")
			.data(this.EDGES)
			.enter()
			.append("line")
			.style("stroke", this.COLORS.linkColor)
			.style("stroke-width", 1)
			.attr("marker-end", "url(#arrowEnd)");

		const nodeGroup = this.SVG.selectAll("g")
			.data(this.NODES)
			.enter()
			.append("g");

		const nodeLabel = nodeGroup
			.append("foreignObject")
			.attr("width", (d) => (d.width ? d.width : 80))
			.attr("height", (d) => (d.height ? d.height : 40))
			.attr("x", (d) => (d.width ? -d.width / 2 : -40))
			.attr("y", (d) => (d.height ? -d.height / 2 : -20));

		const span = nodeLabel
			.append("xhtml:div")
			.html((d) => d.name)
			.style("display", "block")
			.style("padding", "2px 0.4em")
			.style("background-color", (d) => (d.fill ? d.fill : "white"))
			.style("border", "solid thin black")
			.style("text-align", "left")
			.style("font-size", "0.7rem")
			.style("color", "black");

		this.FORCE.on("tick", function () {
			edges
				.attr("x1", (d) => d.source.x)
				.attr("y1", (d) => d.source.y)
				.attr("x2", (d) => d.target.x)
				.attr("y2", (d) => d.target.y);
			nodeGroup.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
		});
	}
}

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
			.style("display", "block")
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
			.style("font-family", "system-ui")
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

export class ScatterPlot extends D3Base {
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
		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 350;
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 250;
		this.MARGIN = {
			top: this.OBJ.margin ? this.OBJ.margin[0] : 20,
			right: this.OBJ.margin ? this.OBJ.margin[1] : 20,
			bottom: this.OBJ.margin ? this.OBJ.margin[2] : 20,
			left: this.OBJ.margin ? this.OBJ.margin[3] : 20,
		};
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
		};
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
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
		this.data = this.OBJ.data;
		this.max_X = d3.max(this.data, (d) => {
			return +d.x;
		});
		this.min_X = d3.min(this.data, (d) => {
			return +d.x;
		});
		this.max_Y = d3.max(this.data, (d) => {
			return +d.y;
		});
		this.min_Y = d3.min(this.data, (d) => {
			return +d.y;
		});

		this.xMin = this.OBJ.xMin ? this.OBJ.xMin : this.min_X;
		this.xMax = this.OBJ.xMax ? this.OBJ.xMax : this.max_X;
		this.yMin = this.OBJ.yMin ? this.OBJ.yMin : this.min_Y;
		this.yMax = this.OBJ.yMax ? this.OBJ.yMax : this.max_Y;

		this.scales = {
			x: d3
				.scaleLinear()
				.domain([this.xMin, this.xMax])
				.range([0, this.DIMENSIONS.width]),
			y: d3
				.scaleLinear()
				.domain([this.yMin, this.yMax])
				.range([this.DIMENSIONS.height, 0]),
			sqrt: d3
				.scaleSqrt()
				.domain([
					0,
					d3.max(this.data, (d) => {
						return +d.y;
					}),
				])
				.range([0, 10]),
		};
		this.attributes = {
			xAxisTickCount: this.OBJ.tickCount ? this.OBJ.tickCount.x : 5,
			yAxisTickCount: this.OBJ.tickCount ? this.OBJ.tickCount.y : 5,
			circleRadius: 5,
			xLabel: this.OBJ.xLabel ? this.OBJ.xLabel : "",
			yLabel: this.OBJ.yLabel ? this.OBJ.yLabel : "",
		};
		this.axis = {
			x: d3
				.axisBottom()
				.scale(this.scales.x)
				.ticks(this.attributes.xAxisTickCount),
			y: d3
				.axisLeft()
				.scale(this.scales.y)
				.ticks(this.attributes.yAxisTickCount),
			padding: 0,
		};
		this.colorPalette = this.OBJ.color
			? this.palette(this.OBJ.color)
			: this.palette("greenScheme");
		this.colors = {
			xAxisTextColor: this.colorPalette.stroke,
			xAxisLineColor: this.colorPalette.stroke,
			yAxisTextColor: this.colorPalette.stroke,
			yAxisLineColor: this.colorPalette.stroke,
			circleFillColor: this.colorPalette.fill,
			circleStrokeColor: this.colorPalette.stroke,
		};
		this.radialMagnitude = this.OBJ.radialMagnitude
			? this.OBJ.radialMagnitude
			: false;
	}
	render() {
		const circles = this.SVG.selectAll("circle")
			.data(this.data)
			.enter()
			.append("circle")
			.attr("fill", this.colors.circleFillColor)
			.attr("stroke", this.colors.circleStrokeColor)
			.attr("cx", (d) => this.scales.x(d.x))
			.attr("cy", (d) => this.scales.y(d.y))
			.attr("r", (d) => {
				if (this.radialMagnitude) {
					return this.scales.sqrt(d.y);
				} else {
					return this.attributes.circleRadius;
				}
			});
		const xAxis = this.SVG.append("g").attr(
			"transform",
			`translate(0, ${this.DIMENSIONS.height - this.axis.padding})`,
		);
		const xAxisRender = xAxis.call(this.axis.x);
		const xAxisTextColor = xAxisRender
			.selectAll("text")
			.attr("fill", this.colors.xAxisTextColor);
		const xAxisLineColor = xAxisRender
			.selectAll("line")
			.attr("stroke", this.colors.xAxisLineColor);
		const xAxisColor = xAxisRender
			.selectAll("path")
			.attr("stroke", this.colors.xAxisLineColor);
		const xAxislabel = xAxisRender
			.append("text")
			.attr("text-anchor", "start")
			.attr("x", this.DIMENSIONS.width + 5)
			.attr("dy", "1em")
			.attr("fill", this.colors.xAxisTextColor)
			.text(this.attributes.xLabel);

		const yAxis = this.SVG.append("g").attr(
			"transform",
			`translate(${this.axis.padding}, 0)`,
		);
		const yAxisRender = yAxis.call(this.axis.y);
		const yAxisTextColor = yAxisRender
			.selectAll("text")
			.attr("fill", this.colors.yAxisTextColor);
		const yAxisLineColor = yAxisRender
			.selectAll("line")
			.attr("stroke", this.colors.yAxisLineColor);
		const yAxisColor = yAxisRender
			.selectAll("path")
			.attr("stroke", this.colors.yAxisLineColor);
		const yAxislabel = yAxisRender
			.append("text")
			.attr("text-anchor", "end")
			.attr("dy", "-1em")
			.attr("fill", this.colors.yAxisTextColor)
			.text(this.attributes.yLabel);
	}
}

export class LinePlot extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "60%";
		this.containerHeightDefault = "40%";
		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;
		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;
		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 350;
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 250;
		this.MARGIN = {
			top: 20,
			right: 50,
			bottom: 20,
			left: 50,
		};
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
		};
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
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
		this.data = this.OBJ.data;
		this.max_X = d3.max(this.data, (d) => {
			return +d.x;
		});
		this.min_X = d3.min(this.data, (d) => {
			return +d.x;
		});
		this.max_Y = d3.max(this.data, (d) => {
			return +d.y;
		});
		this.min_Y = d3.min(this.data, (d) => {
			return +d.y;
		});

		this.xMin = this.OBJ.xMin ? this.OBJ.xMin : this.min_X;
		this.xMax = this.OBJ.xMax ? this.OBJ.xMax : this.max_X;
		this.yMin = this.OBJ.yMin ? this.OBJ.yMin : this.min_Y;
		this.yMax = this.OBJ.yMax ? this.OBJ.yMax : this.max_Y;

		this.xAxisDisplay = this.OBJ.axisDisplay
			? this.OBJ.axisDisplay.x
			: true;
		this.yAxisDisplay = this.OBJ.axisDisplay
			? this.OBJ.axisDisplay.y
			: true;
		this.scales = {
			x: d3
				.scaleLinear()
				.domain([this.xMin, this.xMax])
				.range([0, this.DIMENSIONS.width]),
			y: d3
				.scaleLinear()
				.domain([this.yMin, this.yMax])
				.range([this.DIMENSIONS.height, 0]),
			sqrt: d3
				.scaleSqrt()
				.domain([
					0,
					d3.max(this.data, (d) => {
						return d[1];
					}),
				])
				.range([0, 10]),
		};
		this.attributes = {
			xAxisTickCount: this.OBJ.tickCount ? this.OBJ.tickCount.x : 5,
			yAxisTickCount: this.OBJ.tickCount ? this.OBJ.tickCount.y : 5,
			circleRadius: 3,
			xLabel: this.OBJ.label ? this.OBJ.label.x : "",
			yLabel: this.OBJ.label ? this.OBJ.label.y : "",
		};
		this.axis = {
			x: d3
				.axisBottom()
				.scale(this.scales.x)
				.ticks(this.attributes.xAxisTickCount)
				.tickFormat(d3.format("d")),
			y: d3
				.axisLeft()
				.scale(this.scales.y)
				.ticks(this.attributes.yAxisTickCount),
			padding: 0,
		};
		this.colorPalette = this.OBJ.color
			? this.palette(this.OBJ.color)
			: this.palette("plainScheme");
		this.colors = {
			xAxisTextColor: this.colorPalette.stroke,
			xAxisLineColor: this.colorPalette.stroke,
			yAxisTextColor: this.colorPalette.stroke,
			yAxisLineColor: this.colorPalette.stroke,
			circleFillColor: this.colorPalette.fill,
			circleStrokeColor: this.colorPalette.stroke,
		};
		this.radialMagnitude = this.OBJ.radialMagnitude
			? this.OBJ.radialMagnitude
			: false;

		this.dataGroups = d3.group(this.data, (d) => d.group);
	}
	render() {
		const lineRender = this.SVG.selectAll("lines")
			.data(this.dataGroups)
			.enter()
			.append("path")
			.attr("fill", "none")
			.attr("stroke", (d, i) =>
				this.OBJ.lineColors
					? this.OBJ.lineColors[i]
					: this.colors.circleStrokeColor,
			)
			.attr("stroke-width", 1.5)
			.style("stroke-dasharray", (d) => {
				if (d[1][0].type === "asym") {
					return "3,3";
				} else {
					return "0,0";
				}
			})
			.attr("d", (d) => {
				return d3
					.line()
					.x((d) => {
						return this.scales.x(d.x);
					})
					.y((d) => {
						return this.scales.y(d.y);
					})(d[1]);
			});
		if (this.OBJ.plotPoints) {
			const circles = this.SVG.selectAll("circle")
				.data(this.data)
				.enter()
				.filter((d) => d.type != "asym")
				.filter((d) => d.display != "none")
				.append("circle")
				.attr("fill", (d) =>
					d.color ? d.color.fill : this.colors.circleFillColor,
				)
				.attr("stroke", (d) =>
					d.color ? d.color.stroke : this.colors.circleStrokeColor,
				)
				.attr("cx", (d) => this.scales.x(d.x))
				.attr("cy", (d) => this.scales.y(d.y))
				.attr("r", (d) => {
					if (this.radialMagnitude) {
						return this.scales.sqrt(d[1]);
					} else {
						return this.attributes.circleRadius;
					}
				});
		}
		if (this.xAxisDisplay) {
			const xAxis = this.SVG.append("g").attr(
				"transform",
				`translate(0, ${this.DIMENSIONS.height - this.axis.padding})`,
			);
			const xAxisRender = xAxis.call(this.axis.x);
			const xAxisTextColor = xAxisRender
				.selectAll("text")
				.attr("fill", this.colors.xAxisTextColor);
			const xAxisLineColor = xAxisRender
				.selectAll("line")
				.attr("stroke", this.colors.xAxisLineColor);
			const xAxisColor = xAxisRender
				.selectAll("path")
				.attr("stroke", this.colors.xAxisLineColor);
			const xAxislabel = xAxisRender
				.append("text")
				.attr("text-anchor", "start")
				.attr("x", this.DIMENSIONS.width + this.MARGIN.right / 2)
				.attr("dy", "1em")
				.attr("fill", this.colors.xAxisTextColor)
				.text(this.attributes.xLabel);
		}
		if (this.yAxisDisplay) {
			const yAxis = this.SVG.append("g").attr(
				"transform",
				`translate(${this.axis.padding}, 0)`,
			);
			const yAxisRender = yAxis.call(this.axis.y);
			const yAxisTextColor = yAxisRender
				.selectAll("text")
				.attr("fill", this.colors.yAxisTextColor);
			const yAxisLineColor = yAxisRender
				.selectAll("line")
				.attr("stroke", this.colors.yAxisLineColor);
			const yAxisColor = yAxisRender
				.selectAll("path")
				.attr("stroke", this.colors.yAxisLineColor);
			const yAxislabel = yAxisRender
				.append("text")
				.attr("text-anchor", "end")
				.attr("dy", "-1em")
				.attr("fill", this.colors.yAxisTextColor)
				.text(this.attributes.yLabel);
		}
	}
}

export class TimeLine extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "100%";
		this.containerHeightDefault = "35%";
		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;
		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;
		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 650;
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 250;
		this.MARGIN = {
			top: 0,
			right: 50,
			bottom: 20,
			left: 50,
		};
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
		};
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
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
		this.data = this.OBJ.data;
		this.startTime = this.OBJ.timeRange[0];
		this.endTime = this.OBJ.timeRange[1];
		this.event = (d) => {
			return d.event;
		};
		this.eventYear = (d) => {
			return d.time[0];
		};
		this.yPosition = (d) => {
			return d.y;
		};
		this.attributes = {
			xAxisTickCount: this.OBJ.tickCount ? this.OBJ.tickCount.x : 5,
			yAxisTickCount: this.OBJ.tickCount ? this.OBJ.tickCount.y : 5,
			circleRadius: 5,
			xLabel: this.OBJ.xLabel ? this.OBJ.xLabel : "",
			yLabel: this.OBJ.yLabel ? this.OBJ.yLabel : "",
			yMax: this.OBJ.yMax ? this.OBJ.yMax : 30,
		};
		this.scales = {
			x: d3
				.scaleLinear()
				.domain([this.startTime, this.endTime])
				.range([0, this.DIMENSIONS.width]),
			y: d3
				.scaleLinear()
				.domain([0, this.attributes.yMax])
				.range([this.DIMENSIONS.height, 0]),
		};
		this.axis = {
			x: d3
				.axisBottom()
				.scale(this.scales.x)
				.ticks(this.attributes.xAxisTickCount)
				.tickFormat(d3.format("d")),
			y: d3
				.axisLeft()
				.scale(this.scales.y)
				.ticks(this.attributes.yAxisTickCount),
			padding: 0,
		};
		this.colorPalette = this.OBJ.color
			? this.palette(this.OBJ.color)
			: this.palette("greenScheme");
		this.colors = {
			xAxisTextColor: this.colorPalette.stroke,
			xAxisLineColor: this.colorPalette.stroke,
			yAxisTextColor: this.colorPalette.stroke,
			yAxisLineColor: this.colorPalette.stroke,
			circleFillColor: this.colorPalette.fill,
			circleStrokeColor: this.colorPalette.stroke,
		};
		this.radialMagnitude = this.OBJ.radialMagnitude
			? this.OBJ.radialMagnitude
			: false;
	}
	render() {
		const plot = this.SVG.selectAll("circle")
			.data(this.data)
			.enter()
			.append("g")
			.attr(
				"transform",
				(d) =>
					`translate(${this.scales.x(this.eventYear(d))}, ${this.scales.y(
						this.yPosition(d),
					)})`,
			);

		const lineToAxis = plot
			.append("line")
			.attr("stroke", this.colors.circleStrokeColor)
			.attr("x1", 0)
			.attr("y2", 0)
			.attr("x2", 0)
			.attr(
				"y2",
				(d) => this.DIMENSIONS.height - this.scales.y(this.yPosition(d)),
			);
		const circles = plot
			.append("circle")
			.attr("fill", this.colors.circleFillColor)
			.attr("stroke", this.colors.circleStrokeColor)
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", (d) => this.attributes.circleRadius);

		const xAxis = this.SVG.append("g").attr(
			"transform",
			`translate(0, ${this.DIMENSIONS.height - this.axis.padding})`,
		);
		const xAxisRender = xAxis.call(this.axis.x);
		const xAxisTextColor = xAxisRender
			.selectAll("text")
			.attr("fill", this.colors.xAxisTextColor);
		const xAxisLineColor = xAxisRender
			.selectAll("line")
			.attr("stroke", this.colors.xAxisLineColor);
		const xAxisColor = xAxisRender
			.selectAll("path")
			.attr("stroke", this.colors.xAxisLineColor);
		const xAxislabel = xAxisRender
			.append("text")
			.attr("text-anchor", "start")
			.attr("x", this.DIMENSIONS.width + 5)
			.attr("dy", "1em")
			.attr("fill", this.colors.xAxisTextColor)
			.text(this.attributes.xLabel);

		const circleLabels = plot
			.append("text")
			.attr("fill", "black")
			.attr("font-size", "0.7rem")
			.attr("text-anchor", (d, i) => {
				if (undefined != d.anchor) {
					return d.anchor;
				} else if (i === 0) {
					return "middle";
				} else if (i % 2 === 0) {
					return "end";
				} else {
					return "start";
				}
			})
			.attr(
				"dy",
				-this.attributes.circleRadius - this.attributes.circleRadius / 2,
			)
			.text((d) => this.event(d));
	}
}

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
			.style("display", "block")
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
			.style("font-family", "system-ui")
			.style("font-size", "0.75rem")
			.attr("fill", (d) => (d.text ? d.text : this.COLORS.textColor));
	}
}



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
			.style("display", "block")
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
			.style("display", "block")
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
			.attr("font-family", "system-ui")
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
			.attr("font-family", "system-ui")
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

export class HeatMap extends D3Base {
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

		this.MARGIN = {
			top: this.OBJ.margin ? this.OBJ.margin[0] : 10,
			right: this.OBJ.margin ? this.OBJ.margin[1] : 10,
			bottom: this.OBJ.margin ? this.OBJ.margin[2] : 10,
			left: this.OBJ.margin ? this.OBJ.margin[3] : 10,
		};

		// Set the SVG's dimensions
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
		};

		// The SVG container is <div> that wraps the SVG. This allows for resizing.
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
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

		this.DATA = this.OBJ.data;

		this.KEYS = this.OBJ.key;

		this.GROUPS = d3.map(obj.data, (d) => {
			return d.g;
		});

		this.VARS = d3.map(obj.data, (d) => {
			return d.v;
		});

		this.ANNOTATIONS = d3.map(obj.data, (d) => {
			return d.a;
		});

		this.X_SCALE = d3
			.scaleBand()
			.range([0, this.DIMENSIONS.width])
			.domain(this.GROUPS)
			.padding(0.05);

		this.X_AXIS = this.SVG.append("g")
			.style("font-size", 10)
			.style("font-family", "system-ui")
			.attr("transform", `translate(0, ${this.DIMENSIONS.height})`)
			.call(d3.axisBottom(this.X_SCALE).tickSize(0));

		this.X_AXIS.selectAll("text")
			.attr("transform", "rotate(45)")
			.style("text-anchor", "start");

		this.X_AXIS.selectAll(".domain").remove();

		this.Y_SCALE = d3
			.scaleBand()
			.range([this.DIMENSIONS.height, 0])
			.domain(this.VARS)
			.padding(0.05);

		this.Y_SCALE2 = d3
			.scaleBand()
			.range([0, this.DIMENSIONS.width])
			.domain(this.ANNOTATIONS)
			.padding(0.05);

		this.Y_AXIS = this.SVG.append("g")
			.style("font-size", 10)
			.style("font-family", "system-ui")
			.call(d3.axisLeft(this.Y_SCALE).tickSize(0))
			.select(".domain")
			.remove();

		this.Y_AXIS2 = this.SVG.append("g")
			.style("font-size", 8)
			.style("font-family", "system-ui")
			.attr("transform", `translate(${this.DIMENSIONS.width}, 0)`)
			.call(d3.axisRight(this.Y_SCALE2).tickSize(0))
			.select(".domain")
			.remove();

		this.COLOR = d3
			// .interpolateWarm()
			.quantize(d3.interpolateHcl("#C2F784", "#FD5D5D"), 8);
		// .quantize(d3.interpolateHcl("#BBEAA6", "#FF7878"), 8);
		// .scaleSequential()
		// .interpolator(d3.interpolatePlasma)
		// .domain([1, 14]);

		// this.MOUSEOVER = (d) => {
		// 	this.TOOLTIP.style("opacity", 1);
		// 	d3.select(this).style("stroke", "black").style("opacity", 1);
		// };

		// this.MOUSEMOVE = (d) => {
		// 	this.TOOLTIP.html("test")
		// 		.style("left", d3.mouse(this)[0] + 70 + "px")
		// 		.style("top", d3.mouse(this)[1] + "px");
		// };

		// this.MOUSELEAVE = (d) => {
		// 	this.TOOLTIP.style("opacity", 0);
		// 	d3.select(this).style("stroke", "none").style("opacity", 0.8);
		// };
	}
	render() {
		const g = this.SVG.selectAll()
			.data(this.DATA, (d) => {
				`${d.g}:${d.v}`;
			})
			.enter()
			.append("g")
			.attr(
				"transform",
				(d) => `translate(${this.X_SCALE(d.g)}, ${this.Y_SCALE(d.v)})`,
			);

		const square = g
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", this.X_SCALE.bandwidth())
			.attr("height", this.Y_SCALE.bandwidth())
			.style("stroke-width", 4)
			.style("stroke", "none")
			.style("opacity", 0.8)
			.style("fill", (d) => {
				if (d.l === 0) {
					return "#EEEEEE";
				} else {
					return this.COLOR[d.l];
				}
			});

		// const foreignbject = g
		// 	.append("foreignObject")
		// 	.attr("width", this.X_SCALE.bandwidth())
		// 	.attr("height", this.Y_SCALE.bandwidth());

		// const span = foreignbject
		// 	.append("xhtml:span")
		// 	.html((d) => this.KEYS[d.l])
		// 	.style("display", "flex")
		// 	.style("justify-content", "center")
		// 	.style("text-align", "center")
		// 	.style("font-size", "0.5rem")
		// 	.style("color", "black");
	}
}

export class BubbleMap extends D3Base {
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

		this.MARGIN = this.OBJ.margin
			? this.OBJ.margin
			: {
					top: 10,
					bottom: 10,
					left: 10,
					right: 10,
			  };

		// Set the SVG's dimensions
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
		};

		// The SVG container is <div> that wraps the SVG. This allows for resizing.
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
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

		this.DATA = this.OBJ.data;

		this.KEYS = this.OBJ.key;

		this.GROUPS = d3.map(obj.data, (d) => {
			return d.g;
		});

		this.VARS = d3.map(obj.data, (d) => {
			return d.v;
		});

		this.X_SCALE = d3
			.scaleBand()
			.range([0, this.DIMENSIONS.width])
			.domain(this.GROUPS)
			.padding(0.05);

		this.X_AXIS = this.SVG.append("g")
			.style("font-size", 10)
			.style("font-family", "system-ui")
			.attr("transform", `translate(0, ${this.DIMENSIONS.height})`)
			.call(d3.axisBottom(this.X_SCALE).tickSize(0));

		this.X_AXIS.selectAll("text")
			.attr("transform", "rotate(45)")
			.style("text-anchor", "start");
		this.X_AXIS.selectAll(".domain").remove();

		this.Y_SCALE = d3
			.scaleBand()
			.range([this.DIMENSIONS.height, 0])
			.domain(this.VARS)
			.padding(0.05);

		this.R_SCALE = d3
			.scaleLinear()
			.domain([0, this.DATA.length])
			.range([5, 50]);

		this.Y_AXIS = this.SVG.append("g")
			.style("font-size", 10)
			.style("font-family", "system-ui")
			.call(d3.axisLeft(this.Y_SCALE).tickSize(0))
			.select(".domain")
			.remove();

		this.COLOR = d3.quantize(d3.interpolateHcl("#C2F784", "#FD5D5D"), 8);
	}
	render() {
		const g = this.SVG.selectAll()
			.data(this.DATA, (d) => {
				`${d.g}:${d.v}`;
			})
			.enter()
			.append("g")
			.attr(
				"transform",
				(d) => `translate(${this.X_SCALE(d.g)}, ${this.Y_SCALE(d.v)})`,
			);

		const square = g
			.append("circle")
			.attr("cx", this.X_SCALE.bandwidth() / 2)
			.attr("cy", this.Y_SCALE.bandwidth() / 2)
			.attr("r", (d) => this.R_SCALE(d.l))
			.attr("fill", (d) => {
				if (d.l === 0) {
					return "grey";
				} else {
					return this.COLOR[d.l];
				}
			})
			.attr("fill-opacity", 0.2)
			.attr("stroke", (d) => {
				if (d.l === 0) {
					return "lightgrey";
				} else {
					return this.COLOR[d.l];
				}
			});

		const foreignbject = g
			.append("foreignObject")
			.attr("width", this.X_SCALE.bandwidth())
			.attr("height", this.Y_SCALE.bandwidth() / 2);

		const span = foreignbject
			.append("xhtml:span")
			.html((d) => this.KEYS[d.l])
			.style("display", "flex")
			.style("justify-content", "center")
			.style("text-align", "center")
			.style("font-size", "0.7rem")
			.style("opacity", 0)
			.style("color", (d) => {
				if (d.l === 0) {
					return "lightgrey";
				} else {
					return this.COLOR[d.l];
				}
			})
			.on("mouseover", function (d) {
				d3.select(this).transition().duration(50).style("opacity", 1);
			})
			.on("mouseout", function (d) {
				d3.select(this).transition().duration(50).style("opacity", 0);
			});
	}
}

export class TreeMap extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "50%";

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
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 300;

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

		// The SVG container is <div> that wraps the SVG. This allows for resizing.
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
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

		this.treemap = d3
			.treemap()
			.size([this.DIMENSIONS.width, this.DIMENSIONS.height])
			.padding(5)
			.round(true);

		this.data = this.OBJ.data;

		this.hierarchy = d3
			.hierarchy(this.data)
			.sum((d) => d.value)
			.sort((a, b) => b.value - a.value);

		this.root = this.treemap(this.hierarchy);

		this.leaves = this.root.leaves();

		this.colors = {
			// fill: d3.scaleOrdinal().range(d3.schemePastel1),
			fill: "white",
			// stroke: d3.scaleOrdinal().range(d3.schemeSet1),
			stroke: "black",
		};
	}
	render() {
		const groups = this.SVG.selectAll("rect")
			.data(this.root)
			.enter()
			.append("g")
			.attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);
		const rects = groups
			.append("rect")
			.attr("width", (d) => d.x1 - d.x0)
			.attr("height", (d) => d.y1 - d.y0)
			.attr("fill", (d, i) => this.colors.fill)
			.attr("stroke", (d, i) => this.colors.stroke)
			.attr("stroke-width", 1);
		const rectLabel = groups
			.append("text")
			.attr("fill", "black")
			.attr("text-anchor", "middle")
			.attr("x", (d) => (d.x1 - d.x0) / 2)
			.attr("y", (d) => d.y1 - d.y0 - 5)
			// .attr("y", (d) => (d.y1 - d.y0)/2)
			.style("font-family", "system-ui")
			.style("font-size", "0.7rem")
			.text((d) => d.data.name);
	}
}

export class TangledTree extends D3Base {
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

		// The SVG container is <div> that wraps the SVG. This allows for resizing.
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
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
		this.COLOR = d3.scaleOrdinal(d3.schemeDark2);

		this.LEVELS = this.OBJ.data;
		this.LEVELS.forEach((l, i) => l.forEach((n) => (n.level = i)));

		this.NODES = this.LEVELS.reduce((a, x) => a.concat(x), []);
		this.NODES_INDEX = {};
		this.NODES.forEach((d) => (this.NODES_INDEX[d.id] = d));

		this.NODES.forEach((d) => {
			d.parents = (d.parents === undefined ? [] : d.parents).map(
				(p) => this.NODES_INDEX[p],
			);
		});

		this.LINKS = [];

		this.LEVELS.forEach((l, i) => {
			var index = {};
			l.forEach((n) => {
				if (n.parents.length == 0) {
					return;
				}
				var id = n.parents
					.map((d) => d.id)
					.sort()
					.join("--");
				if (id in index) {
					index[id].parents = index[id].parents.concat(n.parents);
				} else {
					index[id] = { id: id, parents: n.parents.slice(), level: i };
				}
				n.bundle = index[id];
			});
			l.bundles = Object.keys(index).map((k) => index[k]);
			l.bundles.forEach((b, i) => (b.i = i));
		});

		this.NODES.forEach((d) => {
			d.parents.forEach((p) =>
				this.LINKS.push({ source: d, bundle: d.bundle, target: p }),
			);
		});

		this.BUNDLES = this.LEVELS.reduce((a, x) => a.concat(x.bundles), []);
		this.NODE_HEIGHT = 17;
		this.NODE_WIDTH = 120;
		this.BUNDLE_WIDTH = 30;
		this.LEVEL_Y_PADDING = 20;
		this.X_OFFSET = 0;
		this.Y_OFFSET = 0;

		this.LEVELS.forEach((l) => {
			this.X_OFFSET += l.bundles.length * this.BUNDLE_WIDTH;
			this.Y_OFFSET += this.LEVEL_Y_PADDING;
			l.forEach((n, i) => {
				n.x =
					n.level * this.NODE_WIDTH + this.X_OFFSET + this.NODE_HEIGHT / 2;
				n.y = i * this.NODE_HEIGHT + this.Y_OFFSET;
			});
			this.Y_OFFSET += l.length * this.NODE_HEIGHT;
		});

		this.LEVELS.forEach((l) => {
			let i = 0;
			l.bundles.forEach((b) => {
				b.x =
					b.parents[0].x +
					this.NODE_WIDTH +
					(l.bundles.length - 1 - b.i) * this.BUNDLE_WIDTH;
				b.y = i * this.NODE_HEIGHT;
			});
			i += l.length;
		});
		this.LINKS.forEach((l) => {
			l.xt = l.target.x;
			l.yt = l.target.y;
			l.xb = l.bundle.x;
			l.yb = l.bundle.y;
			l.xs = l.source.x;
			l.ys = l.source.y;
		});
		this.curveFactor = 16;
		this.pathGenerate = (d) => {
			return `M${d.xt} ${d.yt}
			L${d.xb - this.curveFactor} ${d.yt}
			A${this.curveFactor} ${this.curveFactor} 90 0 1 ${d.xb} ${
				d.yt + this.curveFactor
			}
			L${d.xb} ${d.ys - this.curveFactor}
			A${this.curveFactor} ${this.curveFactor} 90 0 0 ${
				d.xb + this.curveFactor
			} ${d.ys}
			L${d.xs} ${d.ys}`;
		};
		this.attrs = {
			font: {
				size: 12,
				color: "#000",
			},
		};
	}
	render() {
		const paths = this.SVG.selectAll("path")
			.data(this.LINKS)
			.enter()
			.append("path")
			.attr("fill", "none")
			.attr("stroke", (d) => `${this.COLOR(d.bundle.id)}`)
			.attr("d", (d) => this.pathGenerate(d));
		const whiteText = this.SVG.selectAll("text")
			.data(this.NODES)
			.enter()
			.append("text")
			.style("font-size", this.attrs.font.size)
			.style("font-family", this.styles.font)
			.attr("stroke", "white")
			.attr("stroke-width", this.styles.fontSize)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("dy", "0.35em")
			.text((d) => d.id);
		const text = this.SVG.selectAll("foo")
			.data(this.NODES)
			.enter()
			.append("text")
			.attr("fill", (d) => (d.focus ? d.focus : this.attrs.font.color))
			.style("font-size", this.styles.fontSize)
			.style("font-family", this.styles.font)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("dy", "0.35em")
			.text((d) => d.id);
	}
}

export class HashTable extends D3Base {
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

		// The SVG container is <div> that wraps the SVG. This allows for resizing.
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
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
		this.COLOR = d3.scaleOrdinal(d3.schemeDark2);

		this.LEVELS = this.OBJ.data;
		this.LEVELS.forEach((l, i) => l.forEach((n) => (n.level = i)));

		this.NODES = this.LEVELS.reduce((a, x) => a.concat(x), []);
		this.NODES_INDEX = {};
		this.NODES.forEach((d) => (this.NODES_INDEX[d.id] = d));

		this.NODES.forEach((d) => {
			d.parents = (d.parents === undefined ? [] : d.parents).map(
				(p) => this.NODES_INDEX[p],
			);
		});

		this.LINKS = [];

		this.LEVELS.forEach((l, i) => {
			var index = {};
			l.forEach((n) => {
				if (n.parents.length == 0) {
					return;
				}
				var id = n.parents
					.map((d) => d.id)
					.sort()
					.join("--");
				if (id in index) {
					index[id].parents = index[id].parents.concat(n.parents);
				} else {
					index[id] = { id: id, parents: n.parents.slice(), level: i };
				}
				n.bundle = index[id];
			});
			l.bundles = Object.keys(index).map((k) => index[k]);
			l.bundles.forEach((b, i) => (b.i = i));
		});

		this.NODES.forEach((d) => {
			d.parents.forEach((p) =>
				this.LINKS.push({ source: d, bundle: d.bundle, target: p }),
			);
		});

		this.BUNDLES = this.LEVELS.reduce((a, x) => a.concat(x.bundles), []);
		this.NODE_HEIGHT = 20;
		this.NODE_WIDTH = 90;
		this.BUNDLE_WIDTH = 15;
		this.LEVEL_Y_PADDING = 15;
		this.X_OFFSET = 0;
		this.Y_OFFSET = 0;

		this.LEVELS.forEach((l) => {
			this.X_OFFSET += l.bundles.length * this.BUNDLE_WIDTH;
			this.Y_OFFSET += this.LEVEL_Y_PADDING;
			l.forEach((n, i) => {
				n.x =
					n.level * this.NODE_WIDTH + this.X_OFFSET + this.NODE_HEIGHT / 2;
				n.y = i * this.NODE_HEIGHT + this.Y_OFFSET;
			});
			this.Y_OFFSET += l.length * this.NODE_HEIGHT;
		});

		this.LEVELS.forEach((l) => {
			let i = 0;
			l.bundles.forEach((b) => {
				b.x =
					b.parents[0].x +
					this.NODE_WIDTH +
					(l.bundles.length - 1 - b.i) * this.BUNDLE_WIDTH;
				b.y = i * this.NODE_HEIGHT;
			});
			i += l.length;
		});
		this.LINKS.forEach((l) => {
			l.xt = l.target.x;
			l.yt = l.target.y;
			l.xb = l.bundle.x;
			l.yb = l.bundle.y;
			l.xs = l.source.x;
			l.ys = l.source.y;
		});
		this.curveFactor = 5;
		this.pathGenerate = (d) => {
			return `M${d.xt} ${d.yt}
			L${d.xb - this.curveFactor} ${d.yt}
			A${this.curveFactor} ${this.curveFactor} 90 0 1 ${d.xb} ${
				d.yt + this.curveFactor
			}
			L${d.xb} ${d.ys - this.curveFactor}
			A${this.curveFactor} ${this.curveFactor} 90 0 0 ${
				d.xb + this.curveFactor
			} ${d.ys}
			L${d.xs} ${d.ys}`;
		};
		this.STYLES = {
			font: {
				family: "system-ui",
				size: 12,
				color: "#000",
			},
		};
	}
	render() {
		const paths = this.SVG.selectAll("path")
			.data(this.LINKS)
			.enter()
			.append("path")
			.attr("fill", "none")
			.attr("stroke-width", 2)
			.attr("stroke", (d) => `${this.COLOR(d.bundle.id)}`)
			.attr("d", (d) => this.pathGenerate(d));

		const nodeRect = this.SVG.selectAll("rect")
			.data(this.NODES)
			.enter()
			.append("rect")
			.attr("fill", "white")
			.attr("stroke", "black")
			.attr("width", this.NODE_WIDTH)
			.attr("height", this.NODE_HEIGHT)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y - 10);

		const text = this.SVG.selectAll("foo")
			.data(this.NODES)
			.enter()
			.append("text")
			.attr("fill", (d) => (d.focus ? d.focus : this.STYLES.font.color))
			.style("font-size", this.STYLES.font.size)
			.style("font-family", this.STYLES.font.family)
			.attr("x", (d) => d.x)
			.attr("y", (d) => d.y)
			.attr("dy", "0.35em")
			.attr("dx", "0.3em")
			.text((d) => d.id);
	}
}

export class CBA extends CSMD {
	constructor(obj) {
		super(obj);
		this.SECTIONS = this.CONTAINER.querySelectorAll("section");
		this.COST_TD = this.CONTAINER.querySelector("td:first-child");
		this.BENEFIT_TD = this.CONTAINER.querySelector("td:last-child");
		this.TABLE_STYLES = {
			backgroundColor: "none",
			margin: "0 auto",
			border: "none",
		};
		this.COST_TD_STYLES = {
			border: "none",
			"vertical-align": "top",
			width: "50%",
		};
		this.BENEFIT_TD_STYLES = {
			border: "none",
			// borderLeft: 'solid thin #E3CAA5',
			"vertical-align": "top",
			width: "50%",
		};
		this.TH_BENEFIT_STYLES = {
			"border-bottom": "solid 3px #95CD41",
			color: "#4E9F3D",
		};
		this.TH_COST_STYLES = {
			"border-bottom": "solid 3px #FC4F4F",
			color: "#FF0000",
		};
		this.TH_STYLES = {
			"text-align": "center",
			border: "none",
			width: "50%",
		};
		this.SECTION_STYLES = {
			padding: "5px",
			fontSize: "0.75rem",
			margin: "1px 0",
		};
	}
	render() {
		Object.assign(this.CONTAINER.style, this.TABLE_STYLES);
		Object.assign(this.COST_TD.style, this.COST_TD_STYLES);
		Object.assign(this.BENEFIT_TD.style, this.BENEFIT_TD_STYLES);
		const costs = this.TH();
		costs.innerText = "Cost(s)";
		Object.assign(costs.style, this.TH_STYLES);
		Object.assign(costs.style, this.TH_COST_STYLES);
		const benefits = this.TH();
		benefits.innerText = "Benefit(s)";
		Object.assign(benefits.style, this.TH_STYLES);
		Object.assign(benefits.style, this.TH_BENEFIT_STYLES);
		const headings = this.THEAD();
		headings.append(benefits);
		headings.append(costs);
		this.CONTAINER.append(headings);
		for (let i = 0; i < this.SECTIONS.length; i++) {
			Object.assign(this.SECTIONS[i].style, this.SECTION_STYLES);
		}
	}
}

export class Circuit extends CSMD {
	constructor(obj) {
		super(obj);
		this.CIRCUIT = document.querySelector(`#${this.OBJ.id}`);
		this.CIRCUIT_LABEL = this.OBJ.name;
		this.INPUT_PINS = this.OBJ.in;
		this.INPUT_PIN_COUNT = this.INPUT_PINS.length;
		this.OUT_PINS = this.OBJ.out;
		this.OUT_PIN_COUNT = this.OUT_PINS.length;
		this.CIRCUIT_CONTAINER_STYLES = {
			display: "flex",
			justifyContent: "center",
		};
		this.CHIP_CONTAINER_STYLES = {
			display: "grid",
			"grid-template-columns": "1fr 1fr 1fr",
			"font-family": "system-ui",
			"font-size": "0.6rem",
		};
		this.INPUT_PIN_STYLE = {
			display: "block",
			margin: "5px 0",
			"padding-right": "20px",
			color: `${this.COLORS.fireBrick}`,
			"border-bottom": `solid thin ${this.COLORS.fireBrick}`,
			display: "flex",
			"flex-direction": "column",
		};
		this.OUTPUT_PIN_STYLE = {
			display: "block",
			margin: "5px 0",
			"padding-left": "20px",
			color: `${this.COLORS.darkBlue}`,
			"border-bottom": `solid thin ${this.COLORS.darkBlue}`,
			"text-align": "right",
			display: "flex",
			"flex-direction": "column",
		};
		this.IC_CONTAINTER_STYLE = {
			display: "flex",
			"justify-content": "center",
			"background-color": "rgb(80, 80, 80)",
			"border-radius": "12px",
			"box-shadow":
				"0 2px 2px 0px rgb(19, 19, 19), 0 4px 2px 0px rgb(0, 0, 0)",
		};
		this.IC_LABEL_STYLE = {
			display: "block",
			color: "gold",
			"font-size": "0.7rem",
			margin: "auto",
		};
	}
	render() {
		const circuit = document.createElement("div");
		Object.assign(circuit.style, this.CIRCUIT_CONTAINER_STYLES);

		const chip = document.createElement("div");
		Object.assign(chip.style, this.CHIP_CONTAINER_STYLES);

		circuit.append(chip);

		const inputPinContainer = document.createElement("div");
		for (let i = 0; i < this.INPUT_PIN_COUNT; i++) {
			const in_pin = document.createElement("span");
			Object.assign(in_pin.style, this.INPUT_PIN_STYLE);
			in_pin.innerHTML = this.INPUT_PINS[i];
			inputPinContainer.append(in_pin);
		}
		const outputPinContainer = document.createElement("div");
		for (let i = 0; i < this.OUT_PIN_COUNT; i++) {
			const out_pin = document.createElement("span");
			Object.assign(out_pin.style, this.OUTPUT_PIN_STYLE);
			out_pin.innerHTML = this.OUT_PINS[i];
			outputPinContainer.append(out_pin);
		}

		const ic = document.createElement("div");
		Object.assign(ic.style, this.IC_CONTAINTER_STYLE);
		const ic_label = document.createElement("span");
		ic_label.innerHTML = this.CIRCUIT_LABEL;
		Object.assign(ic_label.style, this.IC_LABEL_STYLE);
		ic.append(ic_label);

		chip.append(inputPinContainer);
		chip.append(ic);
		chip.append(outputPinContainer);

		this.CIRCUIT.append(circuit);
	}
}

export class Logic {
	constructor(obj) {
		this.OBJ = obj;
		this.COLORS = {
			textColor: "gold",
			bitOff: "#24E0FF",
			bitOn: "#ABFF00",

			bitBorder: "none",
			chassisBackground: "#334756",
			chassisShadow: "0px 1px 0 #bbbbbb, 1px 1px 2px #bdbdbd",
			bitShadowOn:
				"rgba(0, 0, 0, 0.2) 0 -1px 2px 1px, inset #304701 0 -1px 2px, #89FF00 0 0px 4px",
			bitShadowOff:
				"rgba(0, 0, 0, 0.2) 0 -1px 2px 1px, inset #006 0 -1px 2px, #3F8CFF 0 0px 4px",
			chassisBorder: "solid thin black",
		};
	}
}

export class Bit extends Logic {
	static #COMPONENT_COUNT = 0;
	constructor(obj) {
		super(obj);
		this.DEFAULT = obj.default ? obj.default : false;
		this._id = Bit.#COMPONENT_COUNT++;
		this.BOARD = document.createElement("div");
		this.BITID = `bit${this._id}`;
		this.CHECKBOX = document.createElement("input");

		this.LABEL = document.createElement("label");
		this.LABEL.htmlFor = this.BITID;
		Object.assign(this.LABEL.style, {
			display: "table-row",
			textAlign: "center",
			fontFamily: "system-ui",
			fontSize: "0.6rem",
			lineHeight: "0.5",
			margin: "0",
			padding: "0",
			color: this.COLORS.textColor,
			transition: "all 0.5s",
		});

		this.CHECKBOX.type = "checkbox";
		// this.CHECKBOX.checked = false;
		// this.LABEL.innerText = this.CHECKBOX.defaultChecked ? '1' : '0';
		this.CHECKBOX.checked = this.DEFAULT;
		this.CHECKBOX.style.backgroundColor = this.CHECKBOX.checked
			? this.COLORS.bitOn
			: this.COLORS.bitOff;
		this.CHECKBOX.id = this.BITID;
		Object.assign(this.CHECKBOX.style, {
			width: "0.7rem",
			height: "0.7rem",
			padding: "0",
			"border-radius": "50%",
			"vertical-align": "middle",
			border: this.COLORS.bitBorder,
			"box-shadow": this.COLORS.bitShadowOff,
			appearance: "none",
			outline: "none",
			cursor: "pointer",
			transition: "all 0.2s",
		});
		if (this.CHECKBOX.checked) {
			this.LABEL.innerText = "1";
		} else {
			this.LABEL.innerText = "0";
		}
		this.CHECKBOX.addEventListener("change", () => {
			if (this.CHECKBOX.checked) {
				this.CHECKBOX.style.backgroundColor = this.COLORS.bitOn;
				this.CHECKBOX.style.boxShadow = this.COLORS.bitShadowOn;
			} else {
				this.CHECKBOX.style.backgroundColor = this.COLORS.bitOff;
				this.CHECKBOX.style.boxShadow = this.COLORS.bitShadowOff;
			}
			this.LABEL.innerText = this.CHECKBOX.checked ? "1" : "0";
		});

		Object.assign(this.BOARD.style, {
			display: "table",
			margin: "0 auto",
			padding: "0.3rem 0.3rem 0 0.3rem",
			backgroundColor: this.COLORS.chassisBackground,
			"box-shadow": this.COLORS.chassisShadow,
			border: this.COLORS.chassisBorder,
			borderRadius: "5px",
		});
	}
	render(_container = document.querySelector(`#${this.OBJ.id}`)) {
		this.BOARD.append(this.LABEL);
		this.BOARD.append(this.CHECKBOX);
		_container.append(this.BOARD);
	}
}

export class Gate {
	constructor(obj) {
		this.OBJ = obj;
		this.IN = obj.in; // Array<Bit>
		this.OUT = obj.out; // Array<Bit>
		this.PARTS = obj.parts; // Array<Gate>

		this.INPUT_PIN_COUNT = obj.in.length; // Length of IN
		this.OUT_PIN_COUNT = obj.out.length; // Length of OUT

		this.TABLE = document.createElement("table");
		Object.assign(this.TABLE.style, {
			backgroundColor: "#fdfdfd",
			borderRadius: "5px",
			border: "solid thin #f0f0f0",
			"border-collapse": "separate",
			margin: "0 auto",
			boxShadow:
				"inset -1px 1px 2px rgb(173,173,173), -1px 1px 2px rgb(132,132,132)",
		});

		this.TD_styles = {
			margin: "0",
			padding: "2px",
			border: "none",
		};

		this.TBODY = document.createElement("tbody");
	}
	render(_container = document.querySelector(`#${this.OBJ.id}`)) {
		this.TABLE.append(this.TBODY);
		_container.append(this.TABLE);

		for (let i = 0; i < this.INPUT_PIN_COUNT; i++) {
			// new bit object
			const input_bit = new Bit({ default: false });

			// create TR cell for in pins
			const tr_for_input = document.createElement("tr");

			// casing for IN pins (TD elements)
			const td_for_input = document.createElement("td");
			Object.assign(td_for_input.style, this.TD_styles);

			// add bit to TD
			input_bit.render(td_for_input);

			// td_for_input.innerText='test'

			// add TD to tr
			tr_for_input.append(td_for_input);

			// add TR to table
			this.TBODY.append(tr_for_input);
		}
		const existing_rows = this.TABLE.querySelectorAll("tr");
		for (let i = 0; i < this.OUT_PIN_COUNT; i++) {
			const current_row = existing_rows[i];
			// new bit object
			const output_bit = new Bit({});

			const td_for_output = document.createElement("td");
			Object.assign(td_for_output.style, this.TD_styles);

			// add bit to TD
			output_bit.render(td_for_output);

			// add TD to tr
			current_row.append(td_for_output);
		}
		const pins = this.TABLE.querySelectorAll('input[type="checkbox"]');
		for (let i = 0; i < pins.length; i++) {
			pins[i].addEventListener("change", () => {
				if (pins[0].checked && pins[2].checked) {
					pins[1].checked = false;
				} else {
					pins[1].checked = true;
				}
			});
		}
	}
}
