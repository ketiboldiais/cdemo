import D3Base from "../../core/d3_base/D3Base.mjs";
import { arrayOfPropertyValues } from "../../core/utils/arrayOfPropertyValues.mjs";
import setValue from "../../core/utils/setValue.mjs";
import { isObjectLiteral } from "../../core/utils/isObjectLiteral.mjs";
import { maxOfArray } from "../../core/utils/maxOfArray.mjs";
import { minOfArray } from "../../core/utils/minOfArray.mjs";

export class ScatterPlot extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(40, 40, 40, 40);
		this.svg = () => this.setSVGDimensions(500, 400);
		this.SVG_CONTAINER = this.generateSVGContainer(80, 65);
		this.SVG = this.generateSVG();
		this.data = this.generateDataFromArray();
		this.xMin = setValue(
			this.OBJ.xMin,
			minOfArray(arrayOfPropertyValues(this.data, "x")),
		);
		this.xMax = setValue(
			this.OBJ.xMax,
			maxOfArray(arrayOfPropertyValues(this.data, "x")),
		);
		this.yMax = setValue(
			this.OBJ.yMax,
			maxOfArray(arrayOfPropertyValues(this.data, "y")),
		);
		this.yMin = setValue(
			this.OBJ.yMin,
			minOfArray(arrayOfPropertyValues(this.data, "y")),
		);

		this.scales = {
			x: d3
				.scaleLinear()
				.domain([this.xMin, this.xMax])
				.range([0, this.svg().width]),
			y: d3
				.scaleLinear()
				.domain([this.yMin, this.yMax])
				.range([this.svg().height, 0]),
			sqrt: d3
				.scaleSqrt()
				.domain([
					0,
					d3.max(this.data, (d) => {
						return +d.y;
					}),
				])
				.range([0, 10]),
		};
		this.attributes = {
			xAxisTickCount: this.OBJ.tickCount ? this.OBJ.tickCount.x : 5,
			yAxisTickCount: this.OBJ.tickCount ? this.OBJ.tickCount.y : 5,
			circleRadius: 5,
			xLabel: this.OBJ.xLabel ? this.OBJ.xLabel : "",
			yLabel: this.OBJ.yLabel ? this.OBJ.yLabel : "",
		};
		this.axis = {
			x: d3
				.axisBottom()
				.scale(this.scales.x)
				.ticks(this.attributes.xAxisTickCount),
			y: d3
				.axisLeft()
				.scale(this.scales.y)
				.ticks(this.attributes.yAxisTickCount),
			padding: 0,
		};
		this.colorPalette = this.OBJ.color
			? this.palette(this.OBJ.color)
			: this.palette("greenScheme");
		this.colors = {
			xAxisTextColor: this.colorPalette.stroke,
			xAxisLineColor: this.colorPalette.stroke,
			yAxisTextColor: this.colorPalette.stroke,
			yAxisLineColor: this.colorPalette.stroke,
			circleFillColor: this.colorPalette.fill,
			circleStrokeColor: this.colorPalette.stroke,
		};
		this.radialMagnitude = setValue(obj.radialMagnitude, false);
	}
	generateDataFromArray() {
		let dataSet = [];
		for (let i = 0; i < this.data.length; i++) {
			if (isObjectLiteral(this.data[i])) {
				dataSet.push(this.data[i]);
			} else {
				let datum = { x: this.data[i][0], y: this.data[i][1] };
				dataSet.push(datum);
			}
		}
		return dataSet;
	}
	render() {
		const circles = this.SVG.selectAll("foo")
			.data(this.data)
			.enter()
			.append("g");
		circles
			.append("circle")
			.attr("fill", this.colors.circleFillColor)
			.attr("stroke", this.colors.circleStrokeColor)
			.attr("cx", (d) => this.scales.x(d.x))
			.attr("cy", (d) => this.scales.y(d.y))
			.attr("r", (d) =>
				this.radialMagnitude ? this.scales.sqrt(d.y) : 10,
			);
		const xAxis = this.SVG.append("g").attr(
			"transform",
			`translate(0, ${this.svg().height - this.axis.padding})`,
		);
		const xAxisRender = xAxis.call(this.axis.x);
		const xAxisTextColor = xAxisRender
			.selectAll("text")
			.attr("fill", this.colors.xAxisTextColor);
		const xAxisLineColor = xAxisRender
			.selectAll("line")
			.attr("stroke", this.colors.xAxisLineColor);
		const xAxisColor = xAxisRender
			.selectAll("path")
			.attr("stroke", this.colors.xAxisLineColor);
		const xAxislabel = xAxisRender
			.append("text")
			.attr("text-anchor", "start")
			.attr("x", this.svg().width + 5)
			.attr("dy", "1em")
			.attr('font-size', '0.9rem')
			.attr("fill", this.colors.xAxisTextColor)
			.text(this.attributes.xLabel);

		const yAxis = this.SVG.append("g").attr(
			"transform",
			`translate(${this.axis.padding}, 0)`,
		);
		const yAxisRender = yAxis.call(this.axis.y);
		const yAxisTextColor = yAxisRender
			.selectAll("text")
			.attr("fill", this.colors.yAxisTextColor);
		const yAxisLineColor = yAxisRender
			.selectAll("line")
			.attr("stroke", this.colors.yAxisLineColor);
		const yAxisColor = yAxisRender
			.selectAll("path")
			.attr("stroke", this.colors.yAxisLineColor);
		const yAxislabel = yAxisRender
			.append("text")
			.attr("text-anchor", "end")
			.attr("dy", "-1em")
			.attr('font-size', '0.9rem')
			.attr("fill", this.colors.yAxisTextColor)
			.text(this.attributes.yLabel);
	}
}
