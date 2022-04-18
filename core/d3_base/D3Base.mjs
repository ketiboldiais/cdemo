import CSMD from "../csmd/csmd.mjs";

export default class D3Base extends CSMD {
	constructor(obj) {
		super(obj);

		this.styles = {
			font: this.OBJ.styles ? this.OBJ.styles?.font : "system-ui",
			fontSize: this.OBJ.styles ? this.OBJ.styles?.fontSize : "0.7rem",
		};

		this.D3_CONTAINER = this.BODY.selectAll(`#${this.OBJ.id}`);
		this.D3_CONTAINER.classed("demo-container", true);
		this.colorSchemes = {
			plainScheme: {
				fill: "#fff",
				stroke: "#000",
				text: "#000",
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
}
