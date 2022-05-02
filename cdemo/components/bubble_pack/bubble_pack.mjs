import D3Base from "../../core/d3_base/D3Base.mjs";
import setValue from "../../core/utils/setValue.mjs";

export class BubblePack extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(50, 50, 50, 50);
		this.svg = () => this.setSVGDimensions(420, 420);
		this.SVG_CONTAINER = this.generateSVGContainer(80, 80);
		this.SVG = this.generateSVG();
		this.circleCount = this.OBJ.data.length;
		this.maxDataValue = d3.map(obj.data, (d) => d.val);

		this.STRATIFY = d3
			.stratify()
			.id((d) => d.id)
			.parentId((d) => d.parent);

		this.ROOT_NODE = this.STRATIFY(this.OBJ.data).sum((d) => d.val);

		this.PACK = d3
			.pack()
			.size([this.svg().width, this.svg().height])
			.padding(5);

		this.BUBBLE_DATA = this.PACK(this.ROOT_NODE).descendants();
		this.circleStrokeColor = setValue(obj.circleStrokeColor, "#54BAB9");
		this.textColor = setValue(obj.textColor, "teal");
		this.strokeWidth = setValue(obj.strokeWidth, 1);
		this.colorWeight = setValue(obj.circleFillColor, [
			"#e0fffe",
			"#f9fffe",
		]);

		this.circleFillColor = d3
			.scaleLinear()
			.domain([0, this.ROOT_NODE.height])
			.range(this.colorWeight);
	}
	render() {
		const nodes = this.SVG.selectAll("g")
			.data(this.BUBBLE_DATA)
			.enter()
			.append("g")
			.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
		nodes
			.append("circle")
			.attr("r", (d) => d.r)
			.attr("stroke", this.circleStrokeColor)
			.attr("stroke-width", this.strokeWidth)
			.attr("fill", (d) => this.circleFillColor(d.depth));
		nodes
			.filter((d) => !d.children)
			.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", "0.3em")
			.attr("fill", this.textColor)
			.style("font-size", `0.7rem`)
			.text((d) => d.data.id);
		nodes
			.filter((d) => d.children)
			.append("text")
			.attr("text-anchor", "middle")
			.attr("dy", (d) => -d.r - 10)
			.attr("fill", this.textColor)
			.style("font-size", "1rem")
			.text((d) => d.id);
	}
}
