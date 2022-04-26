import D3Base from "../../core/d3_base/D3Base.mjs";

export class LinkedList extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(10, 20, 10, 20);
		this.svg = () => this.setSVGDimensions(250, 200);
		this.SVG_CONTAINER = this.generateSVGContainer(80, 10);
		this.SVG = this.generateSVG();

		this.NODES = this.generateDataFromArray(this.OBJ.data);

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
	}

	colors() {
		return {
			arrowColor: "#FF4C29",
			dataFieldColor: "#FFF",
			dataFieldStrokeColor: "#2B2B2B",
			nextFieldColor: "#DDDDDD",
			nextFieldStrokeColor: "#2B2B2B",
			indexColor: "grey",
			antColor: "#03506F",
		}
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

		this.insertArrowDefinitions({
			id: "end",
			refX: 8,
			refY: 0,
			markerWidth: 5,
			markerHeight: 5,
			orient: "auto",
			fill: this.colors().arrowColor,
		});

		const dataField = nodeGroup
			.append("g")

		dataField
			.append("rect")
			.attr("width", this.NODE.width)
			.attr("stroke", this.colors().dataFieldStrokeColor)
			.attr("fill", this.colors().dataFieldColor)
			.attr("height", this.NODE.height);

		dataField
			.append("text")
			.attr("fill", this.colors().dataFieldStrokeColor)
			.attr("text-anchor", "middle")
			.style("font-size", "7px")
			.style("font-family", "")
			.attr("x", this.NODE.width / 2)
			.attr("y", this.NODE.height / 2)
			.attr("dy", "0.3em")
			.text((d) => d.val);

		if (this.isIndexed) {
			dataField
				.append("text")
				.attr("text-anchor", "middle")
				.attr("fill", this.colors().indexColor)
				.style("font-size", "8px")
				.style("font-family", "CMU")
				.attr("x", this.NODE.width / 1.5)
				.attr("y", this.NODE.height + 10)
				.text((d, i) => i);
		}

		const nextField = nodeGroup
			.append("g")
			.attr("transform", `translate(${this.SCALE.bandwidth()}, 0)`);

		nextField
			.append("rect")
			.attr("stroke", this.colors().nextFieldStrokeColor)
			.attr("fill", this.colors().nextFieldColor)
			.attr("width", this.NODE.width / 2)
			.attr("height", this.NODE.height);

		nodeGroup
			.filter((d) => !d.alone)
			.append("line")
			.attr("stroke", this.colors().arrowColor)
			.attr("x1", this.NODE.width + this.NODE.width / 4)
			.attr("y1", this.NODE.height / 2)
			.attr("x2", this.NODE.width + this.SCALE.bandwidth())
			.attr("y2", this.NODE.height / 2)
			.attr("marker-end", "url(#end)");

		nodeGroup
			.filter((d) => !d.alone)
			.append("circle")
			.attr("fill", this.colors().arrowColor)
			.attr("r", 1.5)
			.attr("cx", this.NODE.width + this.NODE.width / 4)
			.attr("cy", this.NODE.height / 2);

		nextField
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
