export class CBA extends CSMD {
	constructor(obj) {
		super(obj);
		this.SECTIONS = this.CONTAINER.querySelectorAll("section");
		this.COST_TD = this.CONTAINER.querySelector("td:first-child");
		this.BENEFIT_TD = this.CONTAINER.querySelector("td:last-child");
		this.TABLE_STYLES = {
			backgroundColor: "none",
			margin: "0 auto",
			border: "none",
		};
		this.COST_TD_STYLES = {
			border: "none",
			"vertical-align": "top",
			width: "50%",
		};
		this.BENEFIT_TD_STYLES = {
			border: "none",
			// borderLeft: 'solid thin #E3CAA5',
			"vertical-align": "top",
			width: "50%",
		};
		this.TH_BENEFIT_STYLES = {
			"border-bottom": "solid 3px #95CD41",
			color: "#4E9F3D",
		};
		this.TH_COST_STYLES = {
			"border-bottom": "solid 3px #FC4F4F",
			color: "#FF0000",
		};
		this.TH_STYLES = {
			"text-align": "center",
			border: "none",
			width: "50%",
		};
		this.SECTION_STYLES = {
			padding: "5px",
			fontSize: "0.75rem",
			margin: "1px 0",
		};
	}
	render() {
		Object.assign(this.CONTAINER.style, this.TABLE_STYLES);
		Object.assign(this.COST_TD.style, this.COST_TD_STYLES);
		Object.assign(this.BENEFIT_TD.style, this.BENEFIT_TD_STYLES);
		const costs = this.TH();
		costs.innerText = "Cost(s)";
		Object.assign(costs.style, this.TH_STYLES);
		Object.assign(costs.style, this.TH_COST_STYLES);
		const benefits = this.TH();
		benefits.innerText = "Benefit(s)";
		Object.assign(benefits.style, this.TH_STYLES);
		Object.assign(benefits.style, this.TH_BENEFIT_STYLES);
		const headings = this.THEAD();
		headings.append(benefits);
		headings.append(costs);
		this.CONTAINER.append(headings);
		for (let i = 0; i < this.SECTIONS.length; i++) {
			Object.assign(this.SECTIONS[i].style, this.SECTION_STYLES);
		}
	}
}
