import D3Base from "../../core/d3_base/D3Base.mjs";
export class Queue extends D3Base {
	constructor(obj) {
		super(obj);

		this.margins = () => this.setMargin(20, 20, 20, 20);

		this.frameCount = this.data.length;

		this.userData = obj.data;

		this.DATA = this.generateDataFromArray(this.userData);

		this.svg = () => this.setSVGDimensions(300, 300);

		this.SVG_CONTAINER = this.generateSVGContainer(35, 13);

		this.SVG = this.generateSVG();

		this.FRAME_COUNT = this.DATA.length;

		this.xSCALE = d3
			.scaleBand()
			.domain(d3.range(this.FRAME_COUNT))
			.range([0, this.svg().width])
			.paddingInner(0.1);

		this.ySCALE = d3
			.scaleBand()
			.domain(d3.range(this.FRAME_COUNT))
			.range([this.svg().height, 0]);
	}

	render() {
		const queueGroup = this.SVG.selectAll("g")
			.data(this.DATA)
			.enter()
			.append("g")
			.attr("transform", (d, i) => `translate(${this.xSCALE(i)}, 0)`);

		// data rectangle
		queueGroup
			.append("rect")
			.attr("width", this.xSCALE.bandwidth())
			.attr("height", this.ySCALE.bandwidth())
			.attr("fill", "white")
			.attr("stroke", "#C3DBD9");

		// data rectangle text
		queueGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("fill", "#709FB0")
			.attr("x", this.xSCALE.bandwidth() / 2)
			.attr("y", this.ySCALE.bandwidth() / 2)
			.attr("dy", "0.4em")
			.style("font-family", "Fira")
			.style("font-size", "1.2rem")
			.text((d) => d.val);

		// index rectangle
		queueGroup
			.append("rect")
			.attr("width", this.xSCALE.bandwidth())
			.attr("height", this.ySCALE.bandwidth() / 2)
			.attr("y", this.ySCALE.bandwidth())
			.attr("fill", "#EFFFFD")
			.attr("stroke", "#C3DBD9");

		// index rectangle text
		queueGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("fill", "#8AC6D1")
			.attr("x", this.xSCALE.bandwidth() / 2)
			.attr("y", this.ySCALE.bandwidth() + this.ySCALE.bandwidth() / 3)
			.style("font-family", "system-ui")
			.style("font-size", "0.9rem")
			.text((d, i) => i);
	}
}
