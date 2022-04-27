import D3Base from "../../core/d3_base/D3Base.mjs";
import setValue from "../../core/utils/setValue.mjs";
import { minOfArray } from "../../core/utils/minOfArray.mjs";
import { maxOfArray } from "../../core/utils/maxOfArray.mjs";
import { arrayOfPropertyValues } from "../../core/utils/arrayOfPropertyValues.mjs";
import { isObjectLiteral } from "../../core/utils/isObjectLiteral.mjs";
import { linePlotDefault } from "./linePlotDefault.mjs";
import { translate } from "../../core/utils/translate.mjs";

export class LinePlot extends D3Base {
	constructor(obj) {
		super(obj);
		this.OBJ = obj;
		this.rightMargin = this.OBJ.legend ? 2 : 1;
		this.margins = () => this.setMargin(50, 20, 45, 50 * this.rightMargin);
		this.svg = () => this.setSVGDimensions(600, 450);

		this.SVG_CONTAINER = this.generateSVGContainer(85, 65);

		this.SVG = this.generateSVG();

		this.data = this.generateDataFromArray(obj.data);

		this.tickFontSize = setValue(
			obj.tickFontSize,
			linePlotDefault.tickFontSize,
		);

		this.legendFontSize = setValue(
			obj.legendFontSize,
			linePlotDefault.legendFontSize,
		);

		this.labelFontSize = setValue(
			obj.labelFontSize,
			linePlotDefault.labelFontSize,
		);

		this.trendLineWidth = setValue(
			obj.trendLineWidth,
			linePlotDefault.trendLineWidth,
		);

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
		this.xAxisDisplay = setValue(this.OBJ.xAxisDisplay, true);
		this.yAxisDisplay = setValue(this.OBJ.yAxisDisplay, true);

		this.xLinearScale = d3
			.scaleLinear()
			.domain([this.xMin, this.xMax])
			.range([0, this.svg().width]);

		this.yLinearScale = d3
			.scaleLinear()
			.domain([this.yMin, this.yMax])
			.range([this.svg().height, 0]);

		this.sqrtScale = d3
			.scaleSqrt()
			.domain([
				0,
				d3.max(this.data, (d) => {
					return d[1];
				}),
			])
			.range([0, 10]);

		this.colorPalette = this.OBJ.color
			? this.palette(this.OBJ.color)
			: this.palette("plainScheme");

		this.axisTextColor = this.colorPalette.stroke;
		this.axisLineColor = this.colorPalette.stroke;
		this.circleFillColor = this.colorPalette.fill;
		this.circleStrokeColor = this.colorPalette.stroke;

		this.radialMagnitude = this.OBJ.radialMagnitude
			? this.OBJ.radialMagnitude
			: false;

		this.dataGroups = d3.group(this.data, (d) => d.group);
	}

	generateDataFromArray() {
		let dataSet = [];
		for (let i = 0; i < this.data.length; i++) {
			if (isObjectLiteral(this.data[i])) {
				dataSet.push(this.data[i]);
			} else {
				let datum = {
					x: this.data[i][0],
					y: this.data[i][1],
					group: setValue(this.data[i][2], "group"),
				};
				dataSet.push(datum);
			}
		}
		return dataSet;
	}

	generate_d_attribute(d) {
		return d3
			.line()
			.x((d) => {
				return this.xLinearScale(d.x);
			})
			.y((d) => {
				return this.yLinearScale(d.y);
			})(d[1]);
	}

	renderTrendLines() {
		this.SVG.selectAll("lines")
			.data(this.dataGroups)
			.enter()
			.append("path")
			.attr("fill", "none")
			.attr("stroke", (d) =>
				setValue(this.OBJ.legend[d[0]], this.axisLineColor),
			)
			.attr("stroke-width", this.trendLineWidth)
			.attr("d", (d) => this.generate_d_attribute(d));
	}

	render_legend_circles(groups, cx, cy, radius) {
		groups
			.append("circle")
			.attr("fill", (d) => `${d}`)
			.attr("cx", cx)
			.attr("cy", cy)
			.attr("r", radius);
	}

	render_legend_labels(groups, keys, x, y) {
		groups
			.select("texts")
			.data(keys)
			.enter()
			.append("text")
			.attr("fill", "black")
			.attr("font-family", "system-ui")
			.attr("x", (d, i) => x)
			.attr("y", (d, i) => y(i))
			.attr("font-size", this.legendFontSize)
			.text((d) => d);
	}

	renderLegend() {
		const legendValues = Object.values(this.OBJ.legend),
			xPosition = -this.margins().left,
			legendRadius = 5,
			cx = -xPosition / 2 + legendRadius * 2,
			cy = -legendRadius / 2,
			yPosition = (i) => this.yLinearScale(i * legendRadius) / 2,
			legendLabel_x_coordinate = xPosition + legendRadius * 2;

		const legendGroups = this.SVG.selectAll("legends")
			.data(legendValues)
			.enter()
			.append("g")
			.attr("transform", (d, i) => translate(xPosition, yPosition(i)));

		this.render_legend_circles(legendGroups, cx, cy, legendRadius);

		const legendKeys = Object.keys(this.OBJ.legend);
		
		this.render_legend_labels(
			legendGroups,
			legendKeys,
			legendLabel_x_coordinate,
			yPosition,
		);
	}

	renderPoints() {
		this.SVG.selectAll("circle")
			.data(this.data)
			.enter()
			.filter((d) => d.type != "asym")
			.filter((d) => d.display != "none")
			.append("circle")
			.attr("fill", (d) => (d.color ? d.color.fill : this.circleFillColor))
			.attr("stroke", (d) =>
				d.color ? d.color.stroke : this.circleStrokeColor,
			)
			.attr("cx", (d) => this.xLinearScale(d.x))
			.attr("cy", (d) => this.yLinearScale(d.y))
			.attr("r", (d) => {
				if (this.radialMagnitude) {
					return this.sqrtScale(d[1]);
				} else {
					setValue(d.r, linePlotDefault.circleRadius);
				}
			});
	}

	color_axis(axis) {
		axis.selectAll("line, path").attr("stroke", this.axisLineColor);
	}

	render_axis_text(axis) {
		axis
			.selectAll("text")
			.attr("font-size", this.tickFontSize)
			.attr("fill", this.axisTextColor);
	}

	render_x_label(xAxis) {
		xAxis
			.append("text")
			.attr("text-anchor", "start")
			.attr("font-size", this.labelFontSize)
			.attr("x", this.svg().width / 2)
			.attr("y", this.margins().bottom / 1.5)
			.attr("dy", "1em")
			.attr("fill", this.axisTextColor)
			.text(setValue(this.OBJ.xLabel, linePlotDefault.xLabel));
	}

	xAxisGenerator() {
		return d3
			.axisBottom()
			.scale(this.xLinearScale)
			.ticks(setValue(this.OBJ.xTickCount, linePlotDefault.xTickCount))
			.tickFormat(d3.format("d"));
	}

	render_x_axis() {
		const x_axis_shift =
			this.svg().height -
			setValue(this.OBJ.axisPadding, linePlotDefault.axisPadding);
		const xAxis = this.SVG.append("g").attr(
			"transform",
			translate(0, x_axis_shift),
		);
		const rendered_x_axis = xAxis.call(this.xAxisGenerator());

		// set x tick font size
		this.render_axis_text(rendered_x_axis);

		// color lines and paths
		this.color_axis(rendered_x_axis);
		this.render_x_label(rendered_x_axis);
	}

	render_y_label(yAxis) {
		yAxis
			.append("text")
			.attr("text-anchor", "end")
			.attr("dy", "-1em")
			.attr("font-size", this.labelFontSize)
			.attr("fill", this.axisTextColor)
			.text(setValue(this.OBJ.yLabel, linePlotDefault.yLabel));
	}

	yAxisGenerator() {
		return d3
			.axisLeft()
			.scale(this.yLinearScale)
			.ticks(setValue(this.OBJ.yTickCount, linePlotDefault.yTickCount));
	}

	render_y_axis() {
		const y_axis_shift = setValue(
			this.OBJ.axisPadding,
			linePlotDefault.axisPadding,
		);

		const yAxis = this.SVG.append("g").attr(
			"transform",
			translate(y_axis_shift, 0),
		);

		const rendered_yAxis = yAxis.call(this.yAxisGenerator());

		// color text and sent font size
		this.render_axis_text(rendered_yAxis);

		// color axis
		this.color_axis(rendered_yAxis);

		// render y-label
		this.render_y_label(yAxis);
	}

	render() {
		this.renderTrendLines();

		if (this.OBJ.legend) this.renderLegend();

		if (this.OBJ.plotPoints) this.renderPoints();

		if (this.xAxisDisplay) this.render_x_axis();

		if (this.yAxisDisplay) this.render_y_axis();
	}
}
