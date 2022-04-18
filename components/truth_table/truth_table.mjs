import CSMD from "../../core/csmd/csmd.mjs";

export class TruthTable extends CSMD {
	constructor(obj) {
		super(obj);

		this.color_array = ["#F9ECEC", "#F0D9DA", "#C8D9EB", "#ECF2F9"];

		this.TABLE_styles = {
			margin: "auto",
			fontFamily: "system-ui",
			fontSize: "0.7rem",
			border: "none",
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
