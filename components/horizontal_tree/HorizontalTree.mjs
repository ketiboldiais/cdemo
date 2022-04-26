import D3Base from "../../core/d3_base/D3Base.mjs";
import setValue from "../../core/utils/setValue.mjs";

export class HorizontalTree extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(70, 70, 70, 70);
		this.svg = () => this.setSVGDimensions(400, 400);
		this.SVG_CONTAINER = this.generateSVGContainer(70, 70);
		this.SVG = this.generateSVG();
		this.mainFontSize = "0.6rem";
		this.secondaryFontSize = "0.7rem";
		this.nodeRadius = setValue(this.OBJ.nodeRadius, 5);
		this.root = d3
			.stratify()
			.id((d) => d.child)
			.parentId((d) => d.parent)(this.OBJ.data);
		this.sibSpace = setValue(this.OBJ.sibSpace, 1);
		this.nsibSpace = setValue(this.OBJ.nsibSpace, 2);
	}
	diagonal = (from, to) => {
		const midX = (from.y + to.y) / 2;
		return `M ${from.y},${from.x} C ${midX},${from.x} ${midX},${to.x} ${to.y},${to.x}`;
	};

	render() {
		const treeStructure = d3
			.tree()
			.size([this.svg().height, this.svg().width])
			.separation((a, b) =>
				a.parent == b.parent ? this.sibSpace : this.nsibSpace,
			);
		const root = treeStructure(this.root);
		const links = root.links();
		const nodes = root.descendants();
		this.insertArrowDefinitions({
			id: "ctend",
			refX: this.nodeRadius * 3.5,
			refY: 0,
			markerWidth: 6,
			markerHeight: 8,
			orient: "auto",
			fill: setValue(this.OBJ.edgeColor, "#316B83"),
		});

		const g = this.SVG.append("g");
		g.selectAll(".link")
			.data(links)
			.enter()
			.filter((d) => !(d.source.data.display || d.target.data.display))
			.append("path")
			.attr("fill", "none")
			.attr("d", (d) => this.diagonal(d.source, d.target))
			.attr("stroke", setValue(this.OBJ.edgeColor, "#316B83"))
			.attr("marker-end", "url(#ctend)");

		const node = g
			.selectAll(".node")
			.data(nodes)
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
			.attr("r", this.nodeRadius)
			.attr("fill", (d) => {
				if (d.data.fill) {
					return d.data.fill;
				} else {
					return setValue(this.OBJ.nodeColor, "#C1FFD7");
				}
			})
			.attr("stroke", (d) => {
				if (d.data.stroke) {
					return d.data.stroke;
				} else {
					return setValue(this.OBJ.nodeStrokeColor, "#316B83");
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
			.attr("font-size", this.mainFontSize)
			.attr("fill", setValue(this.OBJ.textColor, "black"))
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

		// pointers
		node
			.filter((d) => d.data.pointer)
			.append("text")
			.attr("font-family", "Fira")
			.attr("text-anchor", "middle")
			.attr("dy", (d) => d.x * 2)
			.attr("font-size", this.mainFontSize)
			.text((d) => d.data.pointer);

		node
			.filter((d) => d.data.pointer)
			.append("path")
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr(
				"d",
				`M ${0} ${this.nodeRadius * 2.8} L ${0} ${this.nodeRadius} Z`,
			);
	}
}
