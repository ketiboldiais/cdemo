import D3Base from "../../core/d3_base/D3Base.mjs";
import setValue from "../../core/utils/setValue.mjs";

export class DoublyLinkedList extends D3Base {
	constructor(obj) {
		super(obj);

		this.listName = setValue(this.OBJ.name, "root")

		this.margins = () => this.setMargin(20, 25, 20, 40);

		this.svg = () => this.setSVGDimensions(240, 240);

		this.SVG_CONTAINER = this.generateSVGContainer(80, 15);

		this.SVG = this.generateSVG();

		this.nodes = this.generateDataFromArray(this.OBJ.data);

		this.isIndexed = setValue(this.OBJ.isIndexed, false);

		this.nodeCount = this.OBJ.data.length;

		this.scale = d3
			.scaleBand()
			.domain(d3.range(this.nodeCount))
			.rangeRound([0, this.svg().width])
			.paddingInner(0.5);

		this.NODE = {
			width: this.scale.bandwidth(),
			height: this.scale.bandwidth() / 2,
		};

		this.vars = this.OBJ.vars ? this.OBJ.vars : false;
	}

	colors() {
		return {
			arrowColor: "#BB6464",
			dataFieldColor: "#FFF",
			dataFieldStrokeColor: "#2B2B2B",
			nextFieldColor: "#F0ECE3",
			nextFieldStrokeColor: "#2B2B2B",
			indexColor: "grey",
			antColor: "#03506F",
		};
	}
	render() {
		this.insertArrowDefinitions({
			id: "arrowEnd",
			refX: 8,
			refY: 0,
			markerWidth: 4,
			markerHeight: 4,
			orient: "auto",
			fill: this.colors().arrowColor,
		});

		const nodeGroup = this.SVG.selectAll("g")
			.data(this.nodes)
			.enter()
			.append("g")
			.attr("transform", (d, i) => {
				return `translate(${this.scale(i)}, 0)`;
			})
			.attr("y", 0);

		if (this.vars) {
			const varGroup = this.SVG.selectAll("g.vars")
				.data(this.vars)
				.enter()
				.append("g")
				.attr("transform", (d, i) => {
					return `translate(${this.scale(i) / 3}, -5)`;
				});
			varGroup
				.append("text")
				.attr("text-anchor", "middle")
				.attr("font-size", "7px")
				.style("font-family", "Fira")
				.attr("fill", this.colors().nextFieldStrokeColor)
				.text((d) => d);
		}

		// Data Field
		const dataField = nodeGroup
			.append("g")
			.attr("transform", `translate(${this.scale.bandwidth() / 3}, 0)`);

		// Data field rectangle
		dataField
			.append("rect")
			.attr("width", this.NODE.width)
			.attr("stroke", this.colors().dataFieldStrokeColor)
			.attr("fill", (d) => setValue(d.fill, this.colors().dataFieldColor))
			.attr("height", this.NODE.height);

		// Data field text
		dataField
			.append("text")
			.attr("fill", (d) =>
				setValue(d.textColor, this.colors().dataFieldStrokeColor),
			)
			.attr("text-anchor", "middle")
			.style("font-size", "7px")
			.style("font-family", "Fira")
			.attr("x", this.NODE.width / 3)
			.attr("y", this.NODE.height / 2)
			.attr("dy", "0.3em")
			.text((d) => d.val);

		// Indexing
		if (this.isIndexed) {
			dataField
				.append("text")
				.attr("text-anchor", "middle")
				.attr("fill", this.colors().indexColor)
				.style("font-size", "8px")
				.style("font-family", "CMU")
				.attr("x", this.NODE.width / 3)
				.attr("y", this.NODE.height + 10)
				.text((d, i) => i + 1);
		}

		// Next Field Group
		const nextField = nodeGroup
			.append("g")
			.classed("next-field", true)
			.attr("transform", `translate(${this.scale.bandwidth()}, 0)`);

		// Next field rectangle
		nextField
			.append("rect")
			.attr("stroke", this.colors().nextFieldStrokeColor)
			.attr("fill", this.colors().nextFieldColor)
			.attr("width", this.NODE.width / 3)
			.attr("height", this.NODE.height);

		// Prev field group
		const prevField = nodeGroup.append("g");

		// Prev field rectangle
		prevField
			.append("rect")
			.attr("stroke", this.colors().nextFieldStrokeColor)
			.attr("fill", this.colors().nextFieldColor)
			.attr("width", this.NODE.width / 3)
			.attr("height", this.NODE.height);

		// next pointer arrow
		nodeGroup
			.filter((d) => !d.alone)
			.append("line")
			.attr("stroke", this.colors().arrowColor)
			.attr("x1", this.NODE.width + this.NODE.width / 8)
			.attr("y1", this.NODE.height / 4)
			.attr("x2", this.NODE.width + this.scale.bandwidth())
			.attr("y2", this.NODE.height / 4)
			.attr("marker-end", "url(#arrowEnd)");

		// prev pointer arrow
		nodeGroup
			.filter((d) => !d.alone)
			.append("line")
			.attr("stroke", this.colors().arrowColor)
			.attr(
				"x1",
				-this.NODE.width +
					(this.scale.bandwidth() + this.scale.bandwidth() / 5),
			)
			.attr("y1", this.NODE.height / 1.5)
			.attr("x2", -this.NODE.width + this.NODE.width / 3)
			.attr("y2", this.NODE.height / 1.5)
			.attr("marker-end", "url(#arrowEnd)");

		// next pointer circle
		nodeGroup
			.filter((d) => !d.alone)
			.append("circle")
			.attr("fill", this.colors().arrowColor)
			.attr("r", 1.5)
			.attr("cx", this.NODE.width + this.NODE.width / 6)
			.attr("cy", this.NODE.height / 4);

		// prev pointer circle
		nodeGroup
			.filter((d) => !d.alone)
			.append("circle")
			.attr("fill", this.colors().arrowColor)
			.attr("r", 1.5)
			.attr(
				"cx",
				-this.NODE.width +
					(this.scale.bandwidth() + this.scale.bandwidth() / 6),
			)
			.attr("cy", this.NODE.height / 1.5);

		// annotations
		nextField
			.filter((d) => d.ant)
			.append("text")
			.attr("text-anchor", "middle")
			.style("font-size", "8px")
			.style("font-family", "Fira")
			.attr("x", -this.scale.bandwidth() / 8)
			.attr("y", -4)
			.text((d) => d.ant)
			.style("fill", this.colors().antColor);

		// root pointer
		const rootPointer = this.SVG.append("g").attr(
			"transform",
			`translate(${-this.scale.bandwidth() / 2}, ${
				-this.scale.bandwidth() / 4
			})`,
		);
		rootPointer
			.append("text")
			.attr("font-family", "Fira")
			.attr("font-size", "7px")
			.attr("text-anchor", "middle")
			.text(this.listName);
		rootPointer
			.append("path")
			.attr("fill", "none")
			.attr("stroke", this.colors().arrowColor)
			.attr("d", () => {
				let m1 = 0;
				let m2 = 2;

				let L1 = 0;
				let L2 = this.scale.bandwidth() / 3;

				let l1 = this.scale.bandwidth() / 2;
				let l2 = 0;
				return `M ${m1},${m2} L ${L1},${L2} l ${l1},${l2}`;
			})
			.attr("marker-end", "url(#arrowEnd)");
	}
}
