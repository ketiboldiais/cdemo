import D3Base from "../../core/d3_base/D3Base.mjs";
export class Plot3d extends D3Base {
	constructor(obj) {
		super(obj);
		this.margins = () => this.setMargin(20, 20, 20, 20);
		this.svg = () => this.setSVGDimensions(400, 400);
		this.SVG_CONTAINER = this.generateSVGContainer(70, 70);
		this.SVG = this.generateSVG();
		this.userFunction = obj.fn;
	}

	generateDataFromUserFunction(func) {
		let output = [];
		for (let x = -20; x < 20; x++) {
			let f0 = [];
			output.push(f0);
			for (let y = -20; y < 20; y++) {
				f0.push(func(x, y));
			}
		}
		return output;
	}
	

	render() {
		const dataVals = this.generateDataFromUserFunction(this.userFunction);
		const surface = this.renderSurface(dataVals);
		let group = this.SVG.selectAll("path")
			.data(surface)
			.enter()
			.append("path")
			.attr("d", (d) => d.path)
			.attr("fill", (d) => this.colorFunction(d.data));
	}

	colorFunction(d) {
		var c = d3.hsl(d + 80, 0.7, 0.5).rgb();
		return (
			"rgb(" +
			parseInt(c.r) +
			"," +
			parseInt(c.g) +
			"," +
			parseInt(c.b) +
			")"
		);
	}

	heightFunction(d) {
		return [d];
	}

	getHeights(datum) {
		var data = datum;
		var output = [];
		var xlength = data.length;
		var ylength = data[0].length;
		let t;
		for (var x = 0; x < xlength; x++) {
			output.push((t = []));
			for (var y = 0; y < ylength; y++) {
				let value = this.heightFunction(data[x][y], x, y);
				t.push(value);
			}
		}
		return output;
	}

	transformPoint(point) {
		let transformPrecalc = [];
		let yaw = 0.5;
		let pitch = 0.5;
		var cosA = Math.cos(pitch);
		var sinA = Math.sin(pitch);
		var cosB = Math.cos(yaw);
		var sinB = Math.sin(yaw);
		transformPrecalc[0] = cosB;
		transformPrecalc[1] = 0;
		transformPrecalc[2] = sinB;
		transformPrecalc[3] = sinA * sinB;
		transformPrecalc[4] = cosA;
		transformPrecalc[5] = -sinA * cosB;
		transformPrecalc[6] = -sinB * cosA;
		transformPrecalc[7] = sinA;
		transformPrecalc[8] = cosA * cosB;
		let x =
			transformPrecalc[0] * point[0] +
			transformPrecalc[1] * point[1] +
			transformPrecalc[2] * point[2];
		let y =
			transformPrecalc[3] * point[0] +
			transformPrecalc[4] * point[1] +
			transformPrecalc[5] * point[2];
		let z =
			transformPrecalc[6] * point[0] +
			transformPrecalc[7] * point[1] +
			transformPrecalc[8] * point[2];
		return [x, y, z];
	}
	getTransformedData(datum) {
		let data = datum;
		let output = [];
		let t = [];
		let heights = this.getHeights(datum);
		let xlength = data.length;
		let ylength = data[0].length;
		const displayWidth = 300;
		for (let x = 0; x < xlength; x++) {
			output.push((t = []));
			for (let y = 0; y < ylength; y++) {
				t.push(
					this.transformPoint([
						((x - xlength / 2) / (xlength * 1.41)) * displayWidth,
						heights[x][y],
						((y - ylength / 2) / (ylength * 1.41)) * displayWidth,
					]),
				);
			}
		}
		return output;
	}

	renderSurface(dataVals) {
		let originalData = dataVals;
		let data = this.getTransformedData(dataVals);
		let xlength = data.length;
		let ylength = data[0].length;
		console.log(data);
		const displayWidth = 300;
		const displayHeight = 300;
		let d0 = [];
		for (let x = 0; x < xlength - 1; x++) {
			for (let y = 0; y < ylength - 1; y++) {
				let depth =
					data[x][y][2] +
					data[x + 1][y][2] +
					data[x + 1][y + 1][2] +
					data[x][y + 1][2];
				d0.push({
					path:
						"M" +
						(data[x][y][0] + displayWidth / 2).toFixed(10) +
						"," +
						(data[x][y][1] + displayHeight / 2).toFixed(10) +
						"L" +
						(data[x + 1][y][0] + displayWidth / 2).toFixed(10) +
						"," +
						(data[x + 1][y][1] + displayHeight / 2).toFixed(10) +
						"L" +
						(data[x + 1][y + 1][0] + displayWidth / 2).toFixed(10) +
						"," +
						(data[x + 1][y + 1][1] + displayHeight / 2).toFixed(10) +
						"L" +
						(data[x][y + 1][0] + displayWidth / 2).toFixed(10) +
						"," +
						(data[x][y + 1][1] + displayHeight / 2).toFixed(10) +
						"Z",
					depth: depth,
					data: originalData[x][y],
				});
			}
		}
		d0.sort(function (a, b) {
			return b.depth - a.depth;
		});
		return d0;
		// let dr = node.selectAll("path").data(d0);
		// dr.enter().append("path");
		// dr.attr("d", function (d) {
		// 	return d.path;
		// });
		// if (colorFunction) {
		// 	dr.attr("fill", (d) => colorFunction(d.data));
		// }
	}
}
