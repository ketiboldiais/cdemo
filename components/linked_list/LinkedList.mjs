import D3Base from "../../core/d3_base/D3Base.mjs";

export class LinkedList extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(10, 30, 10, 30);
		this.svg = () => this.setSVGDimensions(300, 200);
		this.SVG_CONTAINER = this.generateSVGContainer(70, 10);
		this.SVG = this.generateSVG();


		this.NODES = this.OBJ.data;

		this.isIndexed = this.OBJ.indexed ? this.OBJ.indexed : false;

		this.NODE_COUNT = this.OBJ.data.length;

		this.SCALE = d3
			.scaleBand()
			.domain(d3.range(this.NODE_COUNT))
			.rangeRound([0, this.svg().width])
			.paddingInner(0.5);

		this.NODE = {
			width: this.SCALE.bandwidth(),
			height: 10,
		};

		this.COLORS = {
			arrowColor: "#FF7878",
			dataFieldColor: "#FFF",
			dataFieldStrokeColor: "#79B4B7",
			nextFieldColor: "#C1FFD7",
			nextFieldStrokeColor: "#79B4B7",
			indexColor: "#8CA1A5",
		};
	}
	render() {
		const nodeGroup = this.SVG.selectAll("g")
			.data(this.NODES)
			.enter()
			.append("g")
			.attr("transform", (d, i) => {
				return `translate(${this.SCALE(i)}, 0)`;
			})
			.attr("y", 0);

		const arrows = this.SVG.append("svg:defs")
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", String)
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", 8)
			.attr("refY", 0)
			.attr("markerWidth", 5)
			.attr("markerHeight", 5)
			.attr("orient", "auto")
			.attr("fill", this.COLORS.arrowColor)
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");

		// Data Field
		const dataField = nodeGroup.append("g");

		// Deleted Node

		const dataFieldRectangle = dataField
			.append("rect")
			.attr("width", this.NODE.width)
			.attr("stroke", this.COLORS.dataFieldStrokeColor)
			.attr("fill", this.COLORS.dataFieldColor)
			.attr("height", this.NODE.height);

		const dataFieldLabel = dataField
			.append("text")
			.attr("fill", this.COLORS.dataFieldStrokeColor)
			.attr("text-anchor", "middle")
			.style("font-size", "7px")
			.style("font-family", "")
			.attr("x", this.NODE.width / 2)
			.attr("y", this.NODE.height / 2)
			.attr("dy", "0.3em")
			.text((d) => d.val);

		// Indexing
		if (this.isIndexed) {
			const index = dataField
				.append("text")
				.attr("text-anchor", "middle")
				.attr("fill", this.COLORS.indexColor)
				.style("font-size", "8px")
				.style("font-family", "CMU")
				.attr("x", this.NODE.width / 1.5)
				.attr("y", this.NODE.height + 10)
				.text((d, i) => i);
		}

		// Next Field
		const nextField = nodeGroup
			.append("g")
			.classed("next-field", true)
			.attr("transform", `translate(${this.SCALE.bandwidth()}, 0)`);

		const nextFieldRectangle = nextField
			.append("rect")
			.attr("stroke", this.COLORS.nextFieldStrokeColor)
			.attr("fill", this.COLORS.nextFieldColor)
			.attr("width", this.NODE.width / 2)
			.attr("height", this.NODE.height);

		// arrow
		const link = nodeGroup
			.filter((d) => !d.alone)
			.append("line")
			.attr("stroke", this.COLORS.arrowColor)
			.attr("x1", this.NODE.width + this.NODE.width / 4)
			.attr("y1", this.NODE.height / 2)
			.attr("x2", this.NODE.width + this.SCALE.bandwidth())
			.attr("y2", this.NODE.height / 2)
			.attr("marker-end", "url(#end)");

		const linkStarter = nodeGroup
			.filter((d) => !d.alone)
			.append("circle")
			.attr("fill", this.COLORS.arrowColor)
			.attr("r", 1.5)
			.attr("cx", this.NODE.width + this.NODE.width / 4)
			.attr("cy", this.NODE.height / 2);

		const annotation = nextField
			.filter((d) => d.annotate)
			.append("text")
			.attr("text-anchor", "middle")
			.style("font-size", "9px")
			.style("font-family", "system-ui")
			.attr("x", -this.SCALE.bandwidth() / 4)
			.attr("y", -4)
			.text((d, i) => d.annotate)
			.style("fill", "let(--darkRed)");
	}
}
