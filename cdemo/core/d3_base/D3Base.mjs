import CSMD from "../csmd/csmd.mjs";
import { isNotNull } from "../utils/isNotNull.mjs";
import { isNotUndefined } from "../utils/isNotUndefined.mjs";
import setValue from "../utils/setValue.mjs";
import { colorSchemes } from "../utils/color.mjs";

export default class D3Base extends CSMD {
	constructor(obj) {
		super(obj);
		this.OBJ = obj;
		this.data = obj.data;

		this.marginTop = setValue(obj.marginTop, null);
		this.marginLeft = setValue(obj.marginLeft, null);
		this.marginBottom = setValue(obj.marginBottom, null);
		this.marginRight = setValue(obj.marginRight, null);

		this.mainFontSize = setValue(this.OBJ.mainFontSize, "0.8rem");

		this.secondaryFontSize = setValue(
			this.OBJ.secondaryFontSize,
			"0.7rem",
		);

		this.defaultPalette = "plainScheme";

		this.D3_CONTAINER = this.BODY.selectAll(`#${this.OBJ.id}`);

		this.D3_CONTAINER.style(
			"display",
			setValue(this.OBJ.display, "flex"),
		).style(
			"justify-content",
			setValue(this.OBJ.justifyContent, "center"),
		);

		this.styles = {
			font: this.OBJ.styles ? this.OBJ.styles?.font : "system-ui",
			fontSize: this.OBJ.styles ? this.OBJ.styles?.fontSize : "0.7rem",
		};
	}

	palette = (color) => {
		let palette;
		if (color === undefined || color === null) {
			return (palette = undefined);
		}
		switch (color) {
			case "blueScheme":
				palette = colorSchemes.blueScheme;
				break;
			case "mintScheme":
				palette = colorSchemes.mintScheme;
				break;
			case "greenScheme":
				palette = colorSchemes.greenScheme;
				break;
			case "darkRedScheme":
				palette = colorSchemes.darkRedScheme;
				break;
			case "yellowScheme":
				palette = colorSchemes.yellowScheme;
				break;
			case "plainScheme":
				palette = colorSchemes.plainScheme;
				break;
			case "greyScheme":
				palette = colorSchemes.greyScheme;
				break;
			case "orangeBlackScheme":
				palette = colorSchemes.orangeBlackScheme;
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

	colors() {
		const palette = setValue(
			this.palette(this.OBJ.palette),
			this.palette(this.defaultPalette),
		);
		return {
			fillColor: palette.fill,
			strokeColor: palette.stroke,
			textColor: palette.text,
		};
	}

	generateDataFromArray(arr) {
		let data = [];
		for (let i = 0; i < arr.length; i++) {
			if (typeof arr[i] === "object") {
				data.push(arr[i]);
			} else {
				let obj = { val: arr[i] };
				data.push(obj);
			}
		}
		return data;
	}

	setMargin(top, right, bottom, left) {
		let userMarginTop;
		let userMarginLeft;
		let userMarginBottom;
		let userMarginRight;

		if (this.OBJ.margins) {
			userMarginTop = this.OBJ.margins[0];
			userMarginLeft = this.OBJ.margins[1];
			userMarginBottom = this.OBJ.margins[2];
			userMarginRight = this.OBJ.margins[3];
		} else {
			userMarginTop = this.marginTop;
			userMarginLeft = this.marginLeft;
			userMarginBottom = this.marginBottom;
			userMarginRight = this.marginRight;
		}

		let margins = {
			top: setValue(userMarginTop, top),
			left: setValue(userMarginLeft, left),
			bottom: setValue(userMarginBottom, bottom),
			right: setValue(userMarginRight, right),
		};
		return margins;
	}

	setSVGDimensions(svg_width, svg_height) {
		let svgWidth = setValue(this.OBJ.svg_width, svg_width);
		let svgHeight = setValue(this.OBJ.svg_height, svg_height);
		const dimensions = {
			width: svgWidth - this.margins().left - this.margins().right,
			height: svgHeight - this.margins().top - this.margins().bottom,
		};
		return dimensions;
	}

	setContainerWidthDefault(defaultValue) {
		if (isNotNull(this.OBJ.width) && isNotUndefined(this.OBJ.width)) {
			return `${this.OBJ.width}%`;
		} else {
			return `${defaultValue}%`;
		}
	}

	setContainerHeightDefault(defaultValue) {
		if (isNotNull(this.OBJ.height) && isNotUndefined(this.OBJ.height)) {
			return `${this.OBJ.height}%`;
		} else {
			return `${defaultValue}%`;
		}
	}

	generateSVGContainer(a, b) {
		const containerWidth = this.setContainerWidthDefault(a);
		const containerHeight = this.setContainerHeightDefault(b);
		const svgContainer = this.D3_CONTAINER.append("div")
			.style("display", "inline-block")
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

	insertArrowDefinitions(obj) {
		const { id, refX, refY, markerWidth, markerHeight, orient, fill } =
			obj;
		this.SVG.append("svg:defs")
			.selectAll("marker")
			.data(["end"])
			.enter()
			.append("svg:marker")
			.attr("id", id)
			.attr("viewBox", "0 -5 10 10")
			.attr("refX", refX)
			.attr("refY", refY)
			.attr("markerWidth", markerWidth)
			.attr("markerHeight", markerHeight)
			.attr("orient", orient)
			.attr("fill", fill)
			.append("svg:path")
			.attr("d", "M0,-5L10,0L0,5");
	}
}
