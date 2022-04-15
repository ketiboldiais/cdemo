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
