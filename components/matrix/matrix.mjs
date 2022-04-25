import D3Base from "../../core/d3_base/D3Base.mjs";
import setValue from "../../core/utils/setValue.mjs";

export class Matrix extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(20, 20, 20, 20);
		this.svg = () => this.setSVGDimensions(300, 300);
		this.SVG_CONTAINER = this.generateSVGContainer(60, 60);
		this.SVG = this.generateSVG();
		this.focusData = obj.focus;
		this.data = this.generateData(obj.data);
		this.rows = d3.map(this.data, (d) => {
			return d.row;
		});
		this.columns = d3.map(this.data, (d) => {
			return d.col;
		});

		this.xScale = d3
			.scaleBand()
			.domain(this.columns)
			.range([0, this.svg().width])
			.padding(0.08);

		this.yScale = d3
			.scaleBand()
			.domain(this.rows)
			.range([0, this.svg().height])
			.padding(0.08);

		this.xAxis = this.SVG.append("g")
			.style("font-size", 10)
			.style("font-family", "system-ui")
			.attr("transform", `translate(0, ${-this.xScale.bandwidth() / 8})`)
			.call(d3.axisBottom(this.xScale).tickSize(0));

		this.xAxis.selectAll(".domain").remove();

		this.yAxis = this.SVG.append("g")
			.style("font-size", 10)
			.style("font-family", "system-ui")
			.attr("transform", `translate(0, ${this.yScale.bandwidth() / 2})`)
			.call(d3.axisLeft(this.yScale).tickSize(0))
			.select(".domain")
			.remove();
	}

	setTextColor(_default, d) {
		let fill = "orange";
		if (d.focus !== undefined) {
			return fill;
		} else {
			return _default;
		}
	}

	setFill(_default, d) {
		let fill = "black";
		if (d.focus !== undefined) {
			return fill;
		} else {
			return _default;
		}
	}

	generateData(userData) {
		let data = [];
		for (let row = 0; row < userData.length; row++) {
			for (let col = 0; col < userData[row].length; col++) {
				let element = { val: userData[row][col], row: row, col: col };
				if (this.focusData) {
					for (let i = 0; i < this.focusData.length; i++) {
						if (
							this.focusData[i][0] === row &&
							this.focusData[i][1] === col
						) {
							element.focus = true;
						}
					}
				}
				data.push(element);
			}
		}
		return data;
	}

	render() {
		const g = this.SVG.selectAll("squares")
			.data(this.data)
			.enter()
			.append("g")
			.attr(
				"transform",
				(d) => `translate(${this.xScale(d.col)}, ${this.yScale(d.row)})`,
			);

		const square = g
			.append("rect")
			.attr("x", 0)
			.attr("y", this.xScale.bandwidth() / 2)
			.attr("width", this.xScale.bandwidth())
			.attr("height", this.yScale.bandwidth())
			.attr("fill", (d) => this.setFill("white", d))
			.attr("stroke", "black")
			.style("stroke-width", "1px")
			.style("opacity", 0.8);

		const labels = g
			.append("text")
			.attr("x", this.xScale.bandwidth() / 2)
			.attr("y", this.yScale.bandwidth())
			.attr("dy", "0.2em")
			.attr("text-anchor", "middle")
			.attr("fill", (d) => this.setTextColor("black", d))
			.text((d) => d.val);
	}
}
