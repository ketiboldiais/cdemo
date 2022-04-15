export class Matrix extends CSMD {
	constructor(obj) {
		super(obj);

		this.TABLE_styles = {
			margin: "0 auto",
			fontFamily: "system-ui",
			fontSize: "0.7rem",
			padding: "0.2em",
			border: "none",
			borderRadius: "5px",
			borderCollapse: "separate",
			borderSpacing: "3px",
		};

		// Style for the offsetting TH element
		this.OFFSET_TH_style = {
			border: "none",
		};

		this.TH_styles = {
			padding: "0",
			margin: "0",
			border: "none",
			fontWeight: "normal",
			color: `rgb(152, 212, 230)`,
			textAlign: "center",
		};

		this.TD_styles = {
			padding: "0.1em 0.4em",
			backgroundColor: this.COLORS.white,
			color: this.COLORS.black,
			border: `solid thin lightgrey`,
			boxShadow: "0 3px 2px 0px grey, 0 2px 1px 0 rgba(0,0,0,0.2)",
			textAlign: "center",
		};

		this.TD_focus_style = {
			backgroundColor: this.OBJ.focusBGColor
				? this.OBJ.focusBGColor
				: `rgb(48, 48, 48)`,
			color: this.OBJ.focusTextColor
				? this.OBJ.focusTextColor
				: this.COLORS.orange,
			border: `solid thin ${
				this.OBJ.focusBorderColor
					? this.OBJ.focusBorderColor
					: "rgb(51, 51, 51)"
			}`,
			boxShadow: `0 3px 2px 0px ${
				this.OBJ.focusBorderColor ? this.OBJ.focusBorderColor : "black"
			}, 0 2px 1px 0 rgba(0,0,0,0.2)`,
		};
	}
	render(obj) {
		const TABLE = this.TABLE();
		Object.assign(TABLE.style, this.TABLE_styles);
		this.CONTAINER.appendChild(TABLE);

		const THEAD = this.THEAD();
		TABLE.appendChild(THEAD);

		const TBODY = this.TBODY();
		TABLE.appendChild(TBODY);

		const ROW_COUNT = this.OBJ.data.length;

		for (let i = 0; i < ROW_COUNT; i++) {
			const TR = this.TR();
			TBODY.appendChild(TR);

			for (let j = 0; j < this.OBJ.data[i].length; j++) {
				const TD = this.TD();
				Object.assign(TD.style, this.TD_styles);
				TR.appendChild(TD);
				TD.innerText = this.OBJ.data[i][j];

				// If 'focus' attribute has a value, modify background color

				if (this.OBJ.focus) {
					for (let k = 0; k < this.OBJ.focus.length; k++) {
						if (i == this.OBJ.focus[k][0] && j == this.OBJ.focus[k][1]) {
							Object.assign(TD.style, this.TD_focus_style);
						}
					}
				}

				// If matrix attribute 'indexed' is true, add row index elements
				// If matrix attribute 'rowIndexed' is true, add row index elements
				if ((this.OBJ.indexed && j == 0) || this.OBJ.rowIndexed) {
					const INDEX_TD = this.TD();
					Object.assign(INDEX_TD.style, this.TH_styles);
					INDEX_TD.style.padding = "0 0.2em";
					INDEX_TD.innerText = i;
					TR.prepend(INDEX_TD);
				}
			}
		}

		// If matrix attribute 'indexed' is true, add column index elements
		// If matrix attribute 'rowIndexed' is true, add column index elements
		if (this.OBJ.indexed || this.OBJ.columnIndexed) {
			// Prepend an offsetting TH element to align the indices
			const OFFSET_TH = document.createElement("th");
			Object.assign(OFFSET_TH.style, this.OFFSET_TH_style);
			THEAD.append(OFFSET_TH);

			// Append the indices
			for (let i = 0; i < this.OBJ.data[0].length; i++) {
				const TH = document.createElement("th");
				Object.assign(TH.style, this.TH_styles);
				TH.innerText = i;
				THEAD.append(TH);
			}
		}
	}
}
