import D3Base from "../../core/d3_base/D3Base.mjs";
import { isObjectLiteral } from "../../core/utils/isObjectLiteral.mjs";
import setValue from "../../core/utils/setValue.mjs";
import { rem } from "../../core/utils/size.mjs";

export class BarGraph extends D3Base {
	constructor(obj) {
		super(obj);

		this.margins = () => this.setMargin(70, 70, 70, 70);

		this.svg = () => this.setSVGDimensions(500, 400);

		this.SVG_CONTAINER = this.generateSVGContainer(80, 70);

		this.SVG = this.generateSVG();

		this.userData = this.formatData(obj.data);

		this.xTickRotate = obj.xTickRotate;

		this.colorWeight = setValue(obj.colorWeight, null);

		this.DATA = {
			x: d3.scaleBand().range([0, this.svg().width], 0.05).padding(0.05),
			y: d3.scaleLinear().range([this.svg().height, 0]),
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

		this.yMax = d3.max(this.userData, (d) => {
			return d.y;
		});

		this.yMin = d3.min(this.userData, (d) => {
			return d.y;
		});

		this.COLOR = this.colorWeight
			? (this.COLOR = d3
					.scaleLinear()
					.domain([this.yMin, this.yMax])
					.range(this.colorWeight))
			: "salmon";
	}

	formatData() {
		let userData = this.OBJ.data;
		let data = [];
		for (let i = 0; i < userData.length; i++) {
			if (isObjectLiteral(userData[i])) {
				data.push(userData[i]);
			} else {
				let datum = {
					x: userData[i][0],
					y: userData[i][1],
					label: userData[i][2],
				};
				data.push(datum);
			}
		}
		return data;
	}

	generateBars() {
		this.SVG.selectAll("bar")
			.data(this.userData)
			.enter()
			.append("rect")
			.attr("fill", (d) => {
				if (this.OBJ.colorWeight) {
					return this.COLOR(d.y);
				} else {
					return "red";
				}
			})
			.attr("x", (d) => this.DATA.x(d.x))
			.attr("y", (d) => this.DATA.y(d.y))
			.attr("height", (d) => this.svg().height - this.DATA.y(d.y))
			.attr("width", this.DATA.x.bandwidth());
	}

	render_x_axis() {
		const xAxis = this.SVG.append("g").attr(
			"transform",
			`translate(0, ${this.svg().height})`,
		);

		xAxis.call(this.AXIS.x).selectAll("text").attr("text-anchor", "end");

		// rotate xTicks if user indicates
		if (this.xTickRotate) {
			xAxis
				.selectAll(".tick")
				.select("text")
				.attr("text-anchor", "start")
				.attr("transform", `rotate(45)`)
				.attr("dx", "0.6em");
		}

		// add x-label if provided by user
		if (this.OBJ.xLabel) {
			const labelXPosition = this.svg().width;
			const labelYPosition = this.margins().bottom / 7;
			const xAxisLabel = xAxis
				.select("g")
				.append("g")
				.attr(
					"transform",
					`translate(${labelXPosition}, ${labelYPosition})`,
				);
			xAxisLabel
				.append("text")
				.attr("fill", "black")
				.text(this.OBJ.xLabel);
		}
	}

	render_y_axis() {
		const yAxis = this.SVG.append("g")
			.call(this.AXIS.y)
			.style("text-anchor", "end");

		// add y-axis tick labels
		this.SVG.selectAll("label")
			.data(this.userData)
			.enter()
			.append("text")
			.attr("fill", "black")
			.attr("font-size", rem(0.7))
			.attr("text-anchor", "middle")
			.attr("x", (d) => this.DATA.x(d.x))
			.attr("y", (d) => this.DATA.y(d.y))
			.attr("dx", this.DATA.x.bandwidth() / 2)
			.attr("dy", -2)
			.text((d) => d.label);

		// add y-label if provided by user
		if (this.OBJ.yLabel) {
			const labelYPosition = -this.svg().height - this.margins().top / 5;
			const labelXPosition = 0;
			const yAxisLabel = yAxis
				.select("g")
				.append("g")
				.attr(
					"transform",
					`translate(${labelXPosition}, ${labelYPosition})`,
				);
			yAxisLabel
				.append("text")
				.attr("fill", "black")
				.text(this.OBJ.yLabel);
		}
	}

	render() {
		this.generateBars();
		this.render_x_axis();
		this.render_y_axis();
	}
}
