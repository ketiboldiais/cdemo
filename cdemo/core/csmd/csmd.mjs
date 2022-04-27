export default class CSMD {
	constructor(obj) {
		this.OBJ = obj;

		this.BODY = d3.select("body");

		this.CONTAINER = document.querySelector(`#${this.OBJ.id}`);

		this.TH = () => {
			const TH = document.createElement("th");
			return TH;
		};

		this.TD = () => {
			const TD = document.createElement("td");
			return TD;
		};

		this.TR = () => {
			const TR = document.createElement("tr");
			return TR;
		};

		this.THEAD = () => {
			const THEAD = document.createElement("thead");
			return THEAD;
		};

		this.TBODY = () => {
			const TBODY = document.createElement("tbody");
			return TBODY;
		};

		this.TABLE = () => {
			const TABLE = document.createElement("table");
			return TABLE;
		};
	}
}
