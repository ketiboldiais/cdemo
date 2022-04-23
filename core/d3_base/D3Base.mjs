import CSMD from "../csmd/csmd.mjs";
import setValue from "../utils/setValue.mjs";

export default class D3Base extends CSMD {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(10, 10, 10, 10);
		this.svg = () => this.setSVGDimensions(200, 200);

		this.D3_CONTAINER = this.BODY.selectAll(`#${this.OBJ.id}`);
		this.D3_CONTAINER.style("display", "flex").style(
			"justify-content",
			"center",
		);

		this.DIMENSIONS = this.setSVGDimensions();

		this.SVG_CONTAINER = this.generateSVGContainer(50, 25);

		this.styles = {
			font: this.OBJ.styles ? this.OBJ.styles?.font : "system-ui",
			fontSize: this.OBJ.styles ? this.OBJ.styles?.fontSize : "0.7rem",
		};

		this.userMargin = this.OBJ.margin ? this.OBJ.margin : false;

		this.colorSchemes = {
			plainScheme: {
				fill: "currentColor",
				stroke: "currentColor",
				text: "currentColor",
			},
			blueScheme: {
				fill: "#ebffff",
				stroke: "#1572A1",
				text: "#1572A1",
			},
			blackScheme: {
				fill: "#000",
				stroke: "#fff",
				text: "#fff",
			},
			greyScheme: {
				fill: "lightgrey",
				stroke: "slategrey",
				text: "slategrey",
			},
			greenScheme: {
				fill: "#f6ffe4",
				stroke: "#4E9F3D",
				text: "#4E9F3D",
			},
			yellowScheme: {
				fill: "#FFFDDE",
				stroke: "#EEBB4D",
				text: "#5E454B",
			},
			darkRedScheme: {
				fill: "orangered",
				stroke: "firebrick",
				text: "white",
			},
		};
		this.palette = (color) => {
			let palette;
			switch (color) {
				case "blueScheme":
					palette = this.colorSchemes.blueScheme;
					break;
				case "greenScheme":
					palette = this.colorSchemes.greenScheme;
					break;
				case "darkRedScheme":
					palette = this.colorSchemes.darkRedScheme;
					break;
				case "yellowScheme":
					palette = this.colorSchemes.yellowScheme;
					break;
				case "plainScheme":
					palette = this.colorSchemes.plainScheme;
					break;
				case "greyScheme":
					palette = this.colorSchemes.greyScheme;
					break;
				default:
					palette = {
						fill: color.fill,
						stroke: color.stroke,
						text: color.text,
					};
			}
			return palette;
		};
	}

	setMargin(top, left, bottom, right) {
		const margins = {
			top: top,
			left: left,
			bottom: bottom,
			right: right,
		};
		return margins;
	}

	setSVGDimensions(svg_width, svg_height) {
		let width = setValue(this.OBJ.svg_width, svg_width);
		let height = setValue(this.OBJ.svg_height, svg_width);
		const dimensions = {
			width: width - this.margins().left - this.margins().right,
			height: height - this.margins().top - this.margins().bottom,
		};
		return dimensions;
	}

	setContainerWidthDefault(defaultValue) {
		return setValue(this.OBJ.width, `${defaultValue}%`);
	}

	setContainerHeightDefault(defaultValue) {
		return setValue(this.OBJ.height, `${defaultValue}%`);
	}

	generateSVGContainer(a, b) {
		const containerWidth = this.setContainerWidthDefault(a);
		const containerHeight = this.setContainerHeightDefault(b);
		const svgContainer = this.D3_CONTAINER.style("display", "inline-block")
			.style("position", "relative")
			.style("width", containerWidth)
			.style("padding-bottom", containerHeight)
			.style("overflow", "hidden");
		return svgContainer;
	}

	generateSVG() {
		const SVG = this.SVG_CONTAINER.append("svg")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr(
				"viewBox",
				`0 0 ${
					this.svg().width + this.margins().left + this.margins().right
				} ${
					this.svg().height + this.margins().top + this.margins().bottom
				}`,
			)
			.style("display", "inline-block")
			.style("position", "absolute")
			.style("top", "0")
			.style("left", "0")
			.append("g")
			.attr(
				"transform",
				`translate(${this.margins().left}, ${this.margins().top})`,
			);
		return SVG;
	}
}
