export class ScatterPlot extends D3Base {
	constructor(obj) {
		super(obj);
		this.containerWidthDefault = "60%";
		this.containerHeightDefault = "50%";
		this.D3_CONTAINER_WIDTH = this.OBJ.width
			? `${this.OBJ.width}%`
			: this.containerWidthDefault;
		this.D3_CONTAINER_HEIGHT = this.OBJ.height
			? `${this.OBJ.height}%`
			: this.containerHeightDefault;
		this.SVG_WIDTH = this.OBJ.svg_width ? this.OBJ.svg_width : 350;
		this.SVG_HEIGHT = this.OBJ.svg_height ? this.OBJ.svg_height : 250;
		this.MARGIN = {
			top: this.OBJ.margin ? this.OBJ.margin[0] : 20,
			right: this.OBJ.margin ? this.OBJ.margin[1] : 20,
			bottom: this.OBJ.margin ? this.OBJ.margin[2] : 20,
			left: this.OBJ.margin ? this.OBJ.margin[3] : 20,
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
		this.max_X = d3.max(this.data, (d) => {
			return +d.x;
		});
		this.min_X = d3.min(this.data, (d) => {
			return +d.x;
		});
		this.max_Y = d3.max(this.data, (d) => {
			return +d.y;
		});
		this.min_Y = d3.min(this.data, (d) => {
			return +d.y;
		});

		this.xMin = this.OBJ.xMin ? this.OBJ.xMin : this.min_X;
		this.xMax = this.OBJ.xMax ? this.OBJ.xMax : this.max_X;
		this.yMin = this.OBJ.yMin ? this.OBJ.yMin : this.min_Y;
		this.yMax = this.OBJ.yMax ? this.OBJ.yMax : this.max_Y;

		this.scales = {
			x: d3
				.scaleLinear()
				.domain([this.xMin, this.xMax])
				.range([0, this.DIMENSIONS.width]),
			y: d3
				.scaleLinear()
				.domain([this.yMin, this.yMax])
				.range([this.DIMENSIONS.height, 0]),
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
		this.radialMagnitude = this.OBJ.radialMagnitude
			? this.OBJ.radialMagnitude
			: false;
	}
	render() {
		const circles = this.SVG.selectAll("circle")
			.data(this.data)
			.enter()
			.append("circle")
			.attr("fill", this.colors.circleFillColor)
			.attr("stroke", this.colors.circleStrokeColor)
			.attr("cx", (d) => this.scales.x(d.x))
			.attr("cy", (d) => this.scales.y(d.y))
			.attr("r", (d) => {
				if (this.radialMagnitude) {
					return this.scales.sqrt(d.y);
				} else {
					return this.attributes.circleRadius;
				}
			});
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
			.attr("fill", this.colors.yAxisTextColor)
			.text(this.attributes.yLabel);
	}
}
