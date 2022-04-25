import D3Base from "../../core/d3_base/D3Base.mjs";
import { setConditionalValue } from "../../core/utils/setConditionalValue.mjs";
import setValue from "../../core/utils/setValue.mjs";

export class Stack extends D3Base {
	constructor(obj) {
		super(obj);

		this.margins = () => this.setMargin(10, 10, 10, 10);

		this.frameCount = this.data.length;

		this.userData = obj.data;

		this.data = this.generateDataFromArray(this.userData);

		this.svg = () => this.setSVGDimensions(350, 250);

		this.SVG_CONTAINER = this.generateSVGContainer(
			60,
			this.frameCount * 5,
		);

		this.SVG = this.generateSVG();

		this.frameDimensions = {
			width: setValue(obj.frameWidth, 70),
			height: setValue(obj.frameHeight, 20),
		};

		this.SCALE = d3
			.scaleBand()
			.domain(this.data)
			.range([0, this.frameCount * 25]);
	}

	colors() {
		const palette = setValue(
			this.palette(this.OBJ.palette),
			this.palette("plainScheme"),
		);
		return {
			frameColor: palette.fill,
			frameStrokeColor: palette.stroke,
			frameTextColor: palette.text,
		};
	}

	render() {
		const frameGroup = this.SVG.selectAll("g")
			.data(this.data)
			.enter()
			.append("g")
			.attr(
				"transform",
				(d) => `translate(${this.svg().width / 2}, ${this.SCALE(d)})`,
			);

		// stack frame rectangle
		frameGroup
			.append("rect")
			.attr("stroke", this.colors().frameStrokeColor)
			.attr("x", (d) =>
				setConditionalValue(
					d.popped,
					this.frameDimensions.width / 2,
					-this.frameDimensions.width / 2,
				),
			)
			.attr("y", 0)
			.attr("fill", (d) => setValue(d.fill, this.colors().frameColor))
			.attr("opacity", (d) => {
				setValue(d.popped, 1);
			})
			.attr("height", this.frameDimensions.height)
			.attr("width", this.frameDimensions.width);

		// stake frame text content
		frameGroup
			.append("text")
			.attr("text-anchor", "middle")
			.attr("x", (d) =>
				setConditionalValue(d.popped, this.frameDimensions.width, 0),
			)
			.attr("y", this.frameDimensions.height / 2)
			.attr("dy", 5)
			.text((d) => `${d.val}`)
			.style("font-family", "Fira")
			.style("font-size", "0.75rem")
			.attr("fill", (d) =>
				setValue(d.textColor, this.colors().frameTextColor),
			);

		// pointer lines
		frameGroup
			.append("line")
			.filter((d) => d.pointer)
			.attr("stroke", this.colors().frameStrokeColor)
			.attr("x1", -this.frameDimensions.width)
			.attr("y1", this.frameDimensions.height / 2)
			.attr("x2", -this.frameDimensions.width / 2)
			.attr("y2", this.frameDimensions.height / 2)
			.attr("marker-end", "url(#arrow)");

		// pointer text
		frameGroup
			.append("text")
			.filter((d) => d.pointer)
			.attr("fill", (d) =>
				setValue(d.textColor, this.colors().frameTextColor),
			)
			.attr("x", -this.frameDimensions.width)
			.attr("dx", "-0.35em")
			.attr("y", this.frameDimensions.height / 2)
			.attr("text-anchor", "end")
			.style("font-family", "Monospace")
			.style("font-size", "0.9em")
			.text((d) => d.pointer);
	}
}
