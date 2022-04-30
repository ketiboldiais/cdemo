import CSMD from "../../core/csmd/csmd.mjs";

export class TruthTable extends CSMD {
	constructor(obj) {
		super(obj);

		this.vars = obj.vars;
		this.varCount = obj.vars.length;
		this.functions = obj.functions;

		this.color_array = ["#F9ECEC", "#F0D9DA", "#C8D9EB", "#ECF2F9"];

		this.TABLE_styles = {
			margin: "auto",
			fontFamily: "system-ui",
			fontSize: "1em",
			border: "none",
		};

		this.COLORS = {
			black: "#333",
			lightBlack: "#444444",
			white: "#FFF",
			beige: "#F9F3DF",
			lightBrown: "#CDB699",
			lightGreen: "#D5EEBB",
			darkGreen: "#529F00",
			forestGreen: "#238823",
			paleGreen: "#B4CFB0",
			paleYellowGreen: "#D3ECA7",
			blue: "#0077B6",
			darkBlue: "#006a97dc",
			purple: "#8946A6",
			tomato: "#FF6347",
			salmon: "#E83A14",
			pink: "#FE83C6",
			lavender: "#EA99D5",
			darkRed: "#A00000",
			orange: "#F0A500",
			teal: "#008080",
			lightGrey: "#CDCDCD",
			gold: "goldenrod",
			fireBrick: "firebrick",
			greyBlue: "#AECBD6",
		};

		this.fonts = {
			Mono: "system-ui",
			Serif: "CMU",
		};

		this.THEAD_styles = {
			border: "none",
		};

		this.TBODY_styles = {};

		this.TD_styles = {
			textAlign: "center",
			border: "thin solid white",
		};

		this.TD_focus_style = {
			padding: "0.1em 0.4em",
			backgroundColor: this.OBJ.focusColor
				? this.OBJ.focusColor
				: this.COLORS.tomato,
			color: this.COLORS.white,
		};

		this.TR_styles = {};

		this.TH_styles = {
			textAlign: "center",
			padding: "0 0.5rem",
			border: "none",
		};
	}
	generateTruthTableData() {
		let formula = (a, b) => {
			return a && b;
		};
		let formulas = [formula];
		let truthTableData = [];
		let temp, a, i, b;
		let columnCount = this.varCount * this.varCount;
		for (i = 0; i < columnCount; i++) {
			let rowData = [];
			temp = i;
			a = i % 2;
			rowData.push(a);
			temp /= 2;
			temp = temp << 0;
			b = temp % 2;
			rowData.push(b);
			for (let j = 0; j < this.functions.length; j++) {
				let val = this.functions[j](a,b);
				rowData.push(val);
			}
			truthTableData[i] = rowData;
		}
		console.log(truthTableData);
	}

	render() {
		const TABLE = this.TABLE();
		Object.assign(TABLE.style, this.TABLE_styles);

		const TBODY = this.TBODY();
		Object.assign(TBODY.style, this.TBODY_styles);
		TABLE.append(TBODY);

		const THEAD = this.THEAD();
		Object.assign(THEAD.style, this.THEAD_styles);
		TABLE.append(THEAD);

		this.CONTAINER.append(TABLE);

		for (let i = 0; i < this.OBJ.headers.length; i++) {
			const TH = this.TH();
			Object.assign(TH.style, this.TH_styles);
			TH.innerText = this.OBJ.headers[i];
			THEAD.appendChild(TH);
		}

		for (let i = 0; i < this.OBJ.rows.length; i++) {
			const TR = this.TR();
			Object.assign(TR.style, this.TR_styles);
			TBODY.append(TR);

			for (let j = 0; j < this.OBJ.rows[i].length; j++) {
				const TD = this.TD();
				Object.assign(TD.style, this.TD_styles);

				if (this.OBJ.rows[i][j] === 1) {
					TD.style.backgroundColor = "#CDF2CA";
					TD.style.color = this.COLORS.darkGreen;
				} else if (this.OBJ.rows[i][j] === 0) {
					TD.style.backgroundColor = "#FDFFBC";
					TD.style.color = this.COLORS.gold;
				} else {
					let k = i % this.color_array.length;
					TD.style.backgroundColor = this.color_array[k];
					TD.style.color = this.COLORS.black;
				}

				// If 'useLetters' attribute is true, use T for 1 and F for 0
				if (this.OBJ.useLetters) {
					TD.innerText = this.OBJ.rows[i][j] === 1 ? "T" : "F";
				} else {
					TD.innerText = this.OBJ.rows[i][j];
				}

				// If 'focus' attribute has a value, modify background color
				if (this.OBJ.focus) {
					for (let k = 0; k < this.OBJ.focus.length; k++) {
						if (i == this.OBJ.focus[k][0] && j == this.OBJ.focus[k][1]) {
							Object.assign(TD.style, this.TD_focus_style);
						}
					}
				}

				// Append the TD element to the row
				TR.append(TD);
			}
		}
	}
}
