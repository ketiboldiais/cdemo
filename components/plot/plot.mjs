import D3Base from "../../core/d3_base/D3Base.mjs";

export class Plot extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "60%";

		this.containerHeightDefault = "0%";

		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;

		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;

		// Set the SVG's width
		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 300;

		// Set the SVG's height
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 250;

		// Set the SVG's dimensions
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
		};

		// The SVG container is <div> that wraps the SVG. This allows for resizing.
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "block")
			.style("position", "relative")
			.style("width", this.D3_CONTAINER_WIDTH)
			.style("padding-bottom", this.D3_CONTAINER_HEIGHT)
			.style("overflow", "hidden");

		this.SVG = this.SVG_CONTAINER.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${
					this.DIMENSIONS.width + this.MARGIN.left + this.MARGIN.right
				} ${
					this.DIMENSIONS.height + this.MARGIN.top + this.MARGIN.bottom
				}`,
			)
			.classed("svg-content-responsive", true)
			.append("g")
			.attr(
				"transform",
				`translate(${this.MARGIN.left}, ${this.MARGIN.top})`,
			);

		// Arrow Definitions
		this.SVG_DEFINITIONS = this.SVG.append("svg:defs")
			.attr("id", "arrow")
			.append("svg:marker")
			.attr("viewBox", "0 0 10 10")
			.attr("refX", 5)
			.attr("refY", 5)
			.attr("markerWidth", 6)
			.attr("markerHeight", 6)
			.attr("orient", "auto")
			.append("svg:path")
			.attr("d", "M 0 0 L 10 5 L 0 10 z")
			.attr("stroke", "#000")
			.attr("stroke-width", 2);
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
		this.MARGIN = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10,
		};
		this.FONTS = {
			serif: "CMU",
			mono: "system-ui",
			size: {
				tiny: "0.45rem",
				small: "0.6rem",
				medium: "0.8rem",
				large: "1rem",
			},
		};
		this.SCALE = {
			xAxis: d3.scaleLinear(
				[this.DATA.domainLowerBound, this.DATA.domainUpperBound],
				[this.DIMENSIONS.width, 0],
			),
			yAxis: d3.scaleLinear(
				[this.DATA.rangeLowerBound, this.DATA.rangeUpperBound],
				[0, this.DIMENSIONS.height],
			),
			xValue: d3.scaleLinear([0, 100]),
			yValue: d3.scaleLinear([100, 0]),
		};

		// Data point generator
		this.DATAPOINTS = () => {
			let dataset = [];
			let x, y;
			for (let i = 0; i <= this.DATA.domain.length - 1; i++) {
				x = this.DATA.domain[i];
				y = this.f(x);
				if (isNaN(y) || !isFinite(y)) {
					continue;
				} else {
					dataset.push([x, y]);
				}
			}
			return dataset;
		};

		// Line generator
		this.LINE = d3
			.line()
			.x((d) => this.SCALE.xAxis(d[0]))
			.y((d) => this.SCALE.yAxis(d[1]));

		// Clip Path
		this.CLIP_PATH = this.SVG.append("clipPath")
			.attr("id", "chart-area")
			.append("rect")
			.attr("x", this.MARGIN.right)
			.attr("y", this.MARGIN.top)
			.attr("width", this.DIMENSIONS.width)
			.attr("height", this.DIMENSIONS.height);
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
			.attr("transform", `translate(0, ${this.DIMENSIONS.height / 2})`)
			.style("font-size", this.FONTS.size.tiny)
			.style("font-family", this.FONTS.serif)
			.style("color", this.COLORS.xAxisColor)
			.call(xAxis);

		// Append y-axis
		const append_yAxis = this.SVG.append("g")
			.attr("transform", `translate(${this.DIMENSIONS.width / 2}, 0)`)
			.style("font-size", this.FONTS.size.tiny)
			.style("color", this.COLORS.yAxisColor)
			.call(yAxis);

		// Select x-axis ticks
		const xAxis_ticks = append_xAxis.selectAll(".tick").selectAll("line");

		// Select y-axis ticks
		const yAxis_ticks = append_yAxis.selectAll(".tick").selectAll("line");

		// Last ticks selection
		const last_xTick = append_xAxis
			.selectAll(".tick:last-child")
			.selectAll("line");
		const last_xTick_text = append_xAxis
			.selectAll(".tick:last-child")
			.selectAll("text");

		const first_xTick = append_xAxis.select(".tick").selectAll("line");
		const first_xTick_text = append_xAxis
			.select(".tick")
			.selectAll("text");

		const last_yTick = append_yAxis
			.selectAll(".tick:last-child")
			.selectAll("line");
		const last_yTick_text = append_yAxis
			.selectAll(".tick:last-child")
			.selectAll("text");

		const first_yTick = append_yAxis.select(".tick").selectAll("line");
		const first_yTick_text = append_yAxis
			.select(".tick")
			.selectAll("text");

		const ticks = [
			first_xTick,
			first_xTick_text,
			last_xTick,
			last_xTick_text,

			first_yTick,
			first_yTick_text,
			last_yTick,
			last_yTick_text,
		];
		for (let i = 0; i < ticks.length; i++) {
			ticks[i].style("display", "none");
		}
		xAxis_ticks.attr("y1", -3);
		yAxis_ticks.attr("x1", 3);

		const plot = this.SVG.append("path")
			.datum(this.DATAPOINTS())
			.attr("clip-path", `url(#chart-area)`)
			.attr("fill", "none")
			.attr("stroke", this.COLORS.plotColor)
			.attr("stroke-width", 1)
			.attr("d", this.LINE);
	}
}
