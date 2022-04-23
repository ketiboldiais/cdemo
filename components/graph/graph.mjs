import D3Base from "../../core/d3_base/D3Base.mjs";

export class Graph extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(30, 30, 30, 30);
		this.svg = () => this.setSVGDimensions(300, 300);
		this.SVG_CONTAINER = this.generateSVGContainer(60, 60);
		this.SVG = this.generateSVG();

		this.EDGES = this.OBJ.data;

		this.generateNode = () => {
			let nodes = {};
			this.EDGES.forEach(function (link) {
				link.source =
					nodes[link.source] ||
					(nodes[link.source] = { name: link.source });
				link.target =
					nodes[link.target] ||
					(nodes[link.target] = { name: link.target });
			});
			return nodes;
		};

		this.NODES = Object.values(this.generateNode());

		this.colorPalette = this.OBJ.color
			? this.palette(this.OBJ.color)
			: this.palette("plainScheme");

		this.COLORS = {
			linkColor: this.colorPalette.stroke,
			nodeColor: this.colorPalette.fill,
			nodeStrokeColor: this.colorPalette.stroke,
			textColor: this.colorPalette.text,
		};

		this.ATTRIBUTES = {
			radius: 5,
			fontSize: 0.65,
		};

		this.COLLISION_RADIUS = this.OBJ.collide ? this.OBJ.collide : 40;
		this.FORCE_STRENGTH = this.OBJ.strength ? this.OBJ.strength : -10;
		this.FORCE_DISTANCE = this.OBJ.distance ? this.OBJ.distance : 50;

		if (!this.OBJ.undirected) {
			this.ARROW = this.SVG.append("svg:defs")
				.selectAll("marker")
				.data(["end"])
				.enter()
				.append("svg:marker")
				.attr("id", "garrow")
				.attr("viewBox", "0 -5 10 10")
				.attr("refX", 15)
				.attr("refY", -1.5)
				.attr("markerWidth", 8)
				.attr("markerHeight", 8)
				.attr("orient", "auto")
				.append("svg:path")
				.attr("d", "M0,-5L10,0L0,5")
				.attr("fill", this.COLORS.linkColor);
		}

		this.FORCE = d3
			.forceSimulation(this.NODES)
			.force("charge", d3.forceManyBody().strength(this.FORCE_STRENGTH))
			.force(
				"link",
				d3.forceLink(this.EDGES).distance(this.FORCE_DISTANCE),
			)
			.force("collision", d3.forceCollide().radius(this.COLLISION_RADIUS))
			.force(
				"center",
				d3
					.forceCenter()
					.x(this.svg().width / 2)
					.y(this.svg().height / 2),
			);
	}
	render() {
		const path = this.SVG.append("g")
			.selectAll("path")
			.data(this.EDGES)
			.enter()
			.append("path")
			.style("stroke-width", 1)
			.attr("fill", "none")
			.attr("stroke", this.COLORS.linkColor)
			.attr("marker-end", "url(#garrow)");

		const node = this.SVG.selectAll("node")
			.data(this.NODES)
			.enter()
			.append("g");
		node
			.append("circle")
			.attr("fill", this.COLORS.nodeColor)
			.attr("stroke", this.COLORS.nodeStrokeColor)
			.attr("r", this.ATTRIBUTES.radius);
		node
			.append("text")
			.attr("font-family", "system-ui")
			.attr("fill", this.COLORS.textColor)
			.attr("dy", "1em")
			.attr("font-size", `${this.ATTRIBUTES.fontSize}rem`)
			.attr("x", this.ATTRIBUTES.radius)
			.text((d) => d.name);

		this.FORCE.on("tick", function () {
			path.attr("d", (d) => {
				let dx = d.target.x - d.source.x;
				let dy = d.target.y - d.source.y;
				let dr = Math.sqrt(dx * dx + dy * dy);
				return (
					"M" +
					d.source.x +
					"," +
					d.source.y +
					"A" +
					dr +
					"," +
					dr +
					" 0 0,1 " +
					d.target.x +
					"," +
					d.target.y
				);
			});
			node.attr("transform", (d) => {
				return `translate(${d.x}, ${d.y})`;
			});
		});
	}
}
