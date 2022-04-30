import D3Base from "../../core/d3_base/D3Base.mjs";
import { arrayOfPropertyValues } from "../../core/utils/arrayOfPropertyValues.mjs";
import setValue from "../../core/utils/setValue.mjs";

export class Plot extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(50, 50, 50, 50);
		this.svg = () => this.setSVGDimensions(500, 500);
		this.SVG_CONTAINER = this.generateSVGContainer(90, 90);
		this.SVG = this.generateSVG();

		this.xAxisPosition = setValue(obj.xAxisPosition, "center");

		this.USER_INPUT_PRECISION = this.OBJ.precision
			? this.OBJ.precision
			: 100;

		this.plotLineColor = setValue(this.plotLineColor, "firebrick");
		this.plotLineColors = arrayOfPropertyValues(obj.functions, "color");

		this.COLORS = {
			plotColor: "firebrick",
			yAxisColor: "#AECBD6",
			xAxisColor: "#AECBD6",
		};

		// fn is a mathematical function written in JavaScript
		this.userFunctions = arrayOfPropertyValues(obj.functions, "f");

		this.DATA = {
			domain: d3.ticks(
				this.OBJ.domain[0],
				this.OBJ.domain[1],
				this.USER_INPUT_PRECISION,
			),
			// Range is a 2-element array object attribute
			domainUpperBound: this.OBJ.domain[0],
			domainLowerBound: this.OBJ.domain[1],
			rangeUpperBound: this.OBJ.range[0],
			rangeLowerBound: this.OBJ.range[1],
		};

		this.FONTS = {
			serif: "CMU",
			mono: "system-ui",
			size: {
				tiny: "0.45rem",
				small: "0.6rem",
				medium: "0.7rem",
				large: "1rem",
			},
		};

		this.SCALE = {
			xAxis: d3.scaleLinear(
				[this.DATA.domainLowerBound, this.DATA.domainUpperBound],
				[this.svg().width, 0],
			),
			yAxis: d3.scaleLinear(
				[this.DATA.rangeLowerBound, this.DATA.rangeUpperBound],
				[0, this.svg().height],
			),
			xValue: d3.scaleLinear([0, 100]),
			yValue: d3.scaleLinear([100, 0]),
		};

		// Data point generator
		this.funcGroupData = this.generateFunctionData();
	}

	setPlotBoundaries() {
		this.SVG.append("clipPath")
			.attr("id", "chart-area")
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", this.svg().width)
			.attr("height", this.svg().height);
	}

	generateFunctionData() {
		let group = {};
		let groups = [];
		let data = [];
		if (this.userFunctions === undefined) {
			return;
		} else {
			for (let i = 0; i < this.userFunctions.length; i++) {
				let func = this.userFunctions[i];
				data.push(this.generateDataFromUserFunction(func));
				group = {
					group: i,
					data: this.generateDataFromUserFunction(func),
					...this.OBJ.functions[i],
				};
				groups.push(group);
			}
		}
		return groups;
	}

	generateFunctionPlot() {
		for (let i = 0; i < this.funcGroupData.length; i++) {
			this.SVG.append("path")
				.datum(this.funcGroupData[i].data)
				.attr("shape-rendering", "geometricPrecision")
				.attr("clip-path", `url(#chart-area)`)
				.attr("fill", "none")
				.attr("stroke", this.funcGroupData[i].color)
				.attr(
					"stroke-width",
					setValue(this.funcGroupData[i].strokeWidth, 2),
				)
				.attr("stroke-dasharray", setValue(this.funcGroupData[i].dash, 0))
				.attr("d", this.generate_d_attribute());
		}
	}

	generate_d_attribute(d) {
		return d3
			.line()
			.x((d) => {
				return this.SCALE.xAxis(d.x);
			})
			.y((d) => {
				return this.SCALE.yAxis(d.y);
			});
	}

	generateDataFromUserFunction(f) {
		let dataset = [];
		let x, y;
		let j = 0;
		for (let i = 0; i <= this.DATA.domain.length - 1; i++) {
			if (typeof f !== "function") {
				x = f;
				y = this.DATA.domain[i];
			} else {
				x = this.DATA.domain[i];
				y = f(x);
			}
			if (isNaN(y) || !isFinite(y)) {
				continue;
			} else {
				dataset.push({ x: x, y: y });
			}
			j++;
		}
		return dataset;
	}

	xAxisShift() {
		let position;
		switch (this.xAxisPosition) {
			case "center":
				position = this.svg().height / 2;
				break;
			case "top":
				position = 0;
				break;
			case "bottom":
				position = this.svg().height;
				break;
			default:
				position = this.svg().height / 2;
		}
		return position;
	}

	addYAxis() {
		const yAxis = d3
			.axisLeft(this.SCALE.yAxis)
			.tickSizeInner(3)
			.tickSizeOuter(0);

		// Append y-axis
		const append_yAxis = this.SVG.append("g")
			.attr("transform", `translate(${this.svg().width / 2}, ${0})`)
			.style("font-size", this.FONTS.size.medium)
			.style("color", this.COLORS.yAxisColor)
			.attr("class", "yAxis")
			.call(yAxis);

		const yAxis_ticks = append_yAxis.selectAll(".tick").selectAll("line");
		yAxis_ticks.attr("x1", 3);

		// generate path
		append_yAxis
			.select("path")
			.attr("marker-end", "url(#yArrowTop)")
			.attr("marker-start", "url(#yArrowBottom)");
	}

	addXAxis() {
		const xAxis = d3
			.axisBottom(this.SCALE.xAxis)
			.tickSizeInner(3)
			.tickSizeOuter(0);
		// Append x-axis
		const append_xAxis = this.SVG.append("g")
			.attr("transform", `translate(0, ${this.xAxisShift()})`)
			.style("font-size", this.FONTS.size.medium)
			.style("color", this.COLORS.xAxisColor)
			.attr("class", "xAxis")
			.call(xAxis);
		const xAxis_ticks = append_xAxis.selectAll(".tick").selectAll("line");
		append_xAxis
			.select("path")
			.attr("marker-end", "url(#xArrowLeft)")
			.attr("marker-start", "url(#xArrowRight)");
		xAxis_ticks.attr("y1", -3);
	}

	removeEndTicks() {
		const xTickCount = d3.selectAll("g.xAxis .tick")._groups[0].length;
		const yTickCount = d3.selectAll("g.yAxis .tick")._groups[0].length;
		this.SVG.selectAll("g.xAxis .tick line").each(function (d, i) {
			if (i === 0 || i === xTickCount - 1) {
				this.remove();
			}
		});
		this.SVG.selectAll("g.yAxis .tick line").each(function (d, i) {
			if (i === 0 || i === yTickCount - 1) {
				this.remove();
			}
		});
	}

	render() {
		this.setPlotBoundaries();
		this.insertArrowDefinitions({
			id: "xArrowLeft",
			refX: 8,
			refY: 0,
			markerWidth: 6,
			markerHeight: 6,
			orient: "auto",
			fill: this.COLORS.xAxisColor,
		});
		this.insertArrowDefinitions({
			id: "xArrowRight",
			refX: 8,
			refY: 0,
			markerWidth: 6,
			markerHeight: 6,
			orient: "0",
			fill: this.COLORS.xAxisColor,
		});
		this.insertArrowDefinitions({
			id: "yArrowTop",
			refX: 8,
			refY: 0,
			markerWidth: 6,
			markerHeight: 6,
			orient: "90",
			fill: this.COLORS.xAxisColor,
		});
		this.insertArrowDefinitions({
			id: "yArrowBottom",
			refX: 8,
			refY: 0,
			markerWidth: 6,
			markerHeight: 6,
			orient: "-90",
			fill: this.COLORS.xAxisColor,
		});
		this.addXAxis();
		this.addYAxis();
		this.removeEndTicks();
		this.generateFunctionPlot();
	}
}
