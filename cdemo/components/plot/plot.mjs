import D3Base from "../../core/d3_base/D3Base.mjs";
import setValue from "../../core/utils/setValue.mjs";

export class Plot extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(30, 30, 30, 30);
		this.svg = () => this.setSVGDimensions(400, 400);
		this.SVG_CONTAINER = this.generateSVGContainer(60, 60);
		this.SVG = this.generateSVG();

		this.xAxisPosition = setValue(obj.xAxisPosition, "center");

		this.USER_INPUT_PRECISION = this.OBJ.precision
			? this.OBJ.precision
			: 100;

		this.COLORS = {
			plotColor: "firebrick",
			yAxisColor: "#AECBD6",
			xAxisColor: "#AECBD6",
		};

		// fn is a mathematical function written in JavaScript
		this.f = this.OBJ.fn;

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
		this.DATAPOINTS = this.generateData();

		// Line generator
		this.LINE = d3
			.line()
			.x((d) => this.SCALE.xAxis(d[0]))
			.y((d) => this.SCALE.yAxis(d[1]));

		// Clip Path
		this.CLIP_PATH = this.SVG
			.append("clipPath")
			.attr("id", "chart-area")
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", this.svg().width)
			.attr("height", this.svg().height);
	}

	generateData() {
		let dataset = [];
		let x, y;
		for (let i = 0; i <= this.DATA.domain.length-1; i++) {
			x = this.DATA.domain[i];
			y = this.f(x);
			if (isNaN(y) || !isFinite(y)) {
				continue;
			} else {
				dataset.push([x, y]);
			}
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

	render() {
		const xAxis = d3
			.axisBottom(this.SCALE.xAxis)
			.tickSizeInner(3)
			.tickSizeOuter(0);

		const yAxis = d3
			.axisLeft(this.SCALE.yAxis)
			.tickSizeInner(3)
			.tickSizeOuter(0);

		// Append x-axis
		const append_xAxis = this.SVG.append("g")
			.attr("transform", `translate(0, ${this.xAxisShift()})`)
			.style("font-size", this.FONTS.size.medium)
			.style("color", this.COLORS.xAxisColor)
			.call(xAxis);

		// Append y-axis
		const append_yAxis = this.SVG.append("g")
			.attr("transform", `translate(${this.svg().width / 2}, ${0})`)
			.style("font-size", this.FONTS.size.medium)
			.style("color", this.COLORS.yAxisColor)
			.call(yAxis);

		const xAxis_ticks = append_xAxis.selectAll(".tick").selectAll("line");
		const yAxis_ticks = append_yAxis.selectAll(".tick").selectAll("line");
		xAxis_ticks.attr("y1", -3);
		yAxis_ticks.attr("x1", 3);

		// generate path
		this.SVG.append("path")
			.datum(this.DATAPOINTS)
			.attr("clip-path", `url(#chart-area)`)
			.attr("fill", "none")
			.attr("stroke", this.COLORS.plotColor)
			.attr("stroke-width", 1)
			.attr("d", this.LINE);
	}
}
