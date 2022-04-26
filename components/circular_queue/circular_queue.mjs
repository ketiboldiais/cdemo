import D3Base from "../../core/d3_base/D3Base.mjs";
import setValue from "../../core/utils/setValue.mjs";

export class CircularQueue extends D3Base {
	constructor(obj) {
		super(obj);

		this.margins = () => this.setMargin(80, 55, 80, 55);

		this.DATA = this.generateDataFromArray(obj.data);

		this.svg = () => this.setSVGDimensions(160, 160);

		this.SVG_CONTAINER = this.generateSVGContainer(30, 30);

		this.SVG = this.generateSVG();

		this.defaultPalette = "orangeBlackScheme";

		this.SCALE = d3
			.scaleLinear()
			.domain([0, d3.max(this.DATA, (d) => d[0])])
			.range([0, this.svg().width]);

		this.pieData = d3.pie().value((d) => d.data)(this.DATA);

		this.ARC = d3
			.arc()
			.innerRadius(this.props().innerRadius)
			.outerRadius(this.props().outerRadius);

		this.INDEX_ARC = d3
			.arc()
			.innerRadius(this.props().innerRadius * 1.5)
			.outerRadius(this.props().outerRadius * 1.8);

		this.ANNOTATION_ARC = d3
			.arc()
			.innerRadius(this.props().innerRadius * 1.6)
			.outerRadius(this.props().outerRadius * 2.6);

		this.IsIndexed = obj.indexed ? obj.indexed : false;
	}

	props() {
		return {
			strokeWidth: setValue(this.OBJ.strokeWidth, 2),
			outerRadius: setValue(this.OBJ.innerRadius, this.svg().width / 2),
			innerRadius: setValue(this.OBJ.innerRadius, 50),
		};
	}

	generateDataFromArray(arr) {
		let data = [];
		for (let i = 0; i < arr.length; i++) {
			if (typeof arr[i] === "object") {
				data.push(arr[i]);
			} else {
				let obj = { val: arr[i], data: 1 };
				data.push(obj);
			}
		}
		return data;
	}

	render() {
		// generate pie paths
		this.SVG.selectAll("paths")
			.data(this.pieData)
			.enter()
			.append("path")
			.attr("d", (d) => this.ARC(d))
			.attr("fill", this.colors().fillColor)
			.attr("stroke", this.colors().strokeColor)
			.attr("stroke-width", this.props().strokeWidth);

		// queuer text content
		this.SVG.selectAll("labels")
			.data(this.pieData)
			.enter()
			.append("text")
			.attr("dy", "0.3em")
			.style("text-anchor", "middle")
			.style("font-family", "Fira")
			.style("font-size", this.mainFontSize)
			.attr("transform", (d) => `translate(${this.ARC.centroid(d)})`)
			.attr("fill", this.colors().textColor)
			.text((d) => d.data.val);

		// annotations
		this.SVG.selectAll("ants")
			.data(this.pieData)
			.enter()
			.append("text")
			.attr("dy", "0.3em")
			.style("font-family", "Fira")
			.attr("dx", (d, i) => -1 * this.ARC.centroid(d)[0] * 4.4)
			.style("font-size", this.secondaryFontSize)
			.attr(
				"transform",
				(d) => `translate(${this.ANNOTATION_ARC.centroid(d)})`,
			)
			.attr("fill", "black")
			.attr("text-anchor", (d) => setValue(d.data.anchor, "middle"))
			.text((d) => d.data.annotate);

		// render index numbers if true
		if (this.IsIndexed) {
			this.SVG.selectAll("indices")
				.data(this.pieData)
				.enter()
				.append("text")
				.attr("dy", "0.3em")
				.style("font-family", "Fira")
				.style("font-size", this.secondaryFontSize)
				.attr("fill", "black")
				.attr(
					"transform",
					(d) => `translate(${this.INDEX_ARC.centroid(d)})`,
				)
				.text((d, i) => i);
		}
	}
}
