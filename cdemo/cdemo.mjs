import CSMD from "./core/csmd/csmd.mjs";
import D3Base from "./core/d3_base/D3Base.mjs";
import { LinkedList } from "./components/linked_list/LinkedList.mjs";
import { DoublyLinkedList } from "./components/doubly_linked_list/doubly_linked_list.mjs";
import { Plot } from "./components/plot/plot.mjs";
import { TruthTable } from "./components/truth_table/truth_table.mjs";
import { Matrix } from "./components/matrix/matrix.mjs";
import { Sequence } from "./components/sequence/sequence.mjs";
import { Network } from "./components/network/network.mjs";
import { Graph } from "./components/graph/graph.mjs";
import { Tree } from "./components/tree/tree.mjs";
import { Plot3d } from "./components/plot3d/plot3d.mjs";
import { Stack } from "./components/stack/stack.mjs";
import { Queue } from "./components/queue/queue.mjs";
import { CircularQueue } from "./components/circular_queue/circular_queue.mjs";
import { HorizontalTree } from "./components/horizontal_tree/HorizontalTree.mjs";
import { ScatterPlot } from "./components/scatter_plot/scatter_plot.mjs";
import { LinePlot } from "./components/line_plot/line_plot.mjs";
import { Bipartite } from "./components/bipartite_graph/bipartite.mjs";

export const cdemo = {
	stack: (obj) => stack(obj),
	linkedList: (obj) => linkedList(obj),
	doublyLinkedList: (obj) => doublyLinkedList(obj),
	plot: (obj) => plot(obj),
	plot3d: (obj) => plot3d(obj),
	truthTable: (obj) => truthTable(obj),
	matrix: (obj) => matrix(obj),
	sequence: (obj) => sequence(obj),
	tree: (obj) => tree(obj),
	queue: (obj) => queue(obj),
	circularQueue: (obj) => circularQueue(obj),
	horizontalTree: (obj) => horizontalTree(obj),
	network: (obj) => network(obj),
	graph: (obj) => graph(obj),
	scatterPlot: (obj) => scatterPlot(obj),
	linePlot: (obj) => linePlot(obj),
	bipartite: (obj) => bipartite(obj),
};

export function bipartite(obj) {
	return new Bipartite(obj).render();
}

export function linePlot(obj) {
	return new LinePlot(obj).render();
}

export function scatterPlot(obj) {
	return new ScatterPlot(obj).render();
}

export function graph(obj) {
	return new Graph(obj).render();
}

export function network(obj) {
	return new Network(obj).render();
}

export function horizontalTree(obj) {
	return new HorizontalTree(obj).render();
}

export function doublyLinkedList(obj) {
	return new DoublyLinkedList(obj).render();
}

export function circularQueue(obj) {
	return new CircularQueue(obj).render();
}

export function queue(obj) {
	return new Queue(obj).render();
}

export function stack(obj) {
	return new Stack(obj).render();
}

export function binaryTree(obj) {
	return new Sequence(obj).render();
}

export function sequence(obj) {
	return new Sequence(obj).render();
}

export function truthTable(obj) {
	return new TruthTable(obj).render();
}

export function matrix(obj) {
	return new Matrix(obj).render();
}

export function tree(obj) {
	return new Tree(obj).render();
}

export function plot3d(obj) {
	return new Plot3d(obj).render();
}

export function plot(obj) {
	return new Plot(obj).render();
}

export function linkedList(obj) {
	return new LinkedList(obj).render();
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
