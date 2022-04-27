export class TimeLine extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "100%";
		this.containerHeightDefault = "35%";
		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;
		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;
		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 650;
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 250;
		this.MARGIN = {
			top: 0,
			right: 50,
			bottom: 20,
			left: 50,
		};
		this.DIMENSIONS = {
			width: this.SVG_WIDTH - this.MARGIN.left - this.MARGIN.right,
			height: this.SVG_HEIGHT - this.MARGIN.top - this.MARGIN.left,
		};
		this.SVG_CONTAINER = this.D3_CONTAINER.append("div")
			.style("display", "inline-block")
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
		this.data = this.OBJ.data;
		this.startTime = this.OBJ.timeRange[0];
		this.endTime = this.OBJ.timeRange[1];
		this.event = (d) => {
			return d.event;
		};
		this.eventYear = (d) => {
			return d.time[0];
		};
		this.yPosition = (d) => {
			return d.y;
		};
		this.attributes = {
			xAxisTickCount: this.OBJ.tickCount ? this.OBJ.tickCount.x : 5,
			yAxisTickCount: this.OBJ.tickCount ? this.OBJ.tickCount.y : 5,
			circleRadius: 5,
			xLabel: this.OBJ.xLabel ? this.OBJ.xLabel : "",
			yLabel: this.OBJ.yLabel ? this.OBJ.yLabel : "",
			yMax: this.OBJ.yMax ? this.OBJ.yMax : 30,
		};
		this.scales = {
			x: d3
				.scaleLinear()
				.domain([this.startTime, this.endTime])
				.range([0, this.DIMENSIONS.width]),
			y: d3
				.scaleLinear()
				.domain([0, this.attributes.yMax])
				.range([this.DIMENSIONS.height, 0]),
		};
		this.axis = {
			x: d3
				.axisBottom()
				.scale(this.scales.x)
				.ticks(this.attributes.xAxisTickCount)
				.tickFormat(d3.format("d")),
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
		this.radialMagnitude = this.OBJ.radialMagnitude
			? this.OBJ.radialMagnitude
			: false;
	}
	render() {
		const plot = this.SVG.selectAll("circle")
			.data(this.data)
			.enter()
			.append("g")
			.attr(
				"transform",
				(d) =>
					`translate(${this.scales.x(this.eventYear(d))}, ${this.scales.y(
						this.yPosition(d),
					)})`,
			);

		const lineToAxis = plot
			.append("line")
			.attr("stroke", this.colors.circleStrokeColor)
			.attr("x1", 0)
			.attr("y2", 0)
			.attr("x2", 0)
			.attr(
				"y2",
				(d) => this.DIMENSIONS.height - this.scales.y(this.yPosition(d)),
			);
		const circles = plot
			.append("circle")
			.attr("fill", this.colors.circleFillColor)
			.attr("stroke", this.colors.circleStrokeColor)
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", (d) => this.attributes.circleRadius);

		const xAxis = this.SVG.append("g").attr(
			"transform",
			`translate(0, ${this.DIMENSIONS.height - this.axis.padding})`,
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
			.attr("x", this.DIMENSIONS.width + 5)
			.attr("dy", "1em")
			.attr("fill", this.colors.xAxisTextColor)
			.text(this.attributes.xLabel);

		const circleLabels = plot
			.append("text")
			.attr("fill", "black")
			.attr("font-size", "0.7rem")
			.attr("text-anchor", (d, i) => {
				if (undefined != d.anchor) {
					return d.anchor;
				} else if (i === 0) {
					return "middle";
				} else if (i % 2 === 0) {
					return "end";
				} else {
					return "start";
				}
			})
			.attr(
				"dy",
				-this.attributes.circleRadius - this.attributes.circleRadius / 2,
			)
			.text((d) => this.event(d));
	}
}
