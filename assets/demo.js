import { cdemo } from "../cdemo/cdemo.mjs";

cdemo.linkedList({
	id: "linked_list",
	data: [
		{ val: 2 },
		{ val: 3 },
		{ val: 9 },
		{ val: 11 },
		{ val: 17 },
		{ val: 20 },
	],
});

cdemo.plot({
	id: "sinePlot",
	fn: (x) => Math.sin(x),
	domain: [-10, 10],
	range: [-4, 4],
	precision: 100,
})

cdemo.truthTable({
	id: "flipFlopGate",
	focus: [
		[7, 5],
		[7, 6],
	],
	headers: [
		"clock", "set", "reset", "set*", "reset*", "Q", "Q",
	],
	rows: [
		[0, 0, 0, 1, 1, "NC", "NC"],
		[0, 0, 1, 1, 1, "NC", "NC"],
		[0, 1, 0, 1, 1, "NC", "NC"],
		[0, 1, 1, 1, 1, "NC", "NC"],
		[1, 0, 0, 1, 1, "NC", "NC"],
		[1, 0, 1, 1, 0, 0, 1],
		[1, 1, 0, 0, 1, 1, 0],
		[1, 1, 1, 0, 0, "⊥", "⊥"],
	],
});

cdemo.matrix({
	id: "matrix",
	focus: [
		[0, 0], [0, 3], [0, 6], [0, 7], [0, 8],
		[1, 0], [1, 3], [1, 7],
		[2, 0], [2, 1], [2, 2], [2, 3], [2, 7],
		[3, 0], [3, 3], [3, 7],
		[4, 0], [4, 3], [4, 6], [4, 7], [4, 8],
	],
	indexed: true,
	data: [
		[1, 0, 0, 1, 0, 0, 1, 1, 1],
		[1, 0, 0, 1, 0, 0, 0, 1, 0],
		[1, 1, 1, 1, 0, 0, 0, 1, 0],
		[1, 0, 0, 1, 0, 0, 0, 1, 0],
		[1, 0, 0, 1, 0, 0, 1, 1, 1],
	],
});

cdemo.array({
	id: "array",
	data: [
		{ val: 2 }, { val: 4 }, { val: 1 },
		{ val: 3 }, { val: 8 }, { val: 0 },
		{ val: 9 }, { val: 7 }, { val: 5 },
	],
});

cdemo.network({
	id: "network",
	height: 48,
	width: 95,
	collide: 22,
	distance: 9,
	strength: -30,
	svg_width: 530,
	svg_height: 255,
	data: [
		{
			source: "Conekt",
			target: "AT&T",
			tattr: { radial: 30 },
			sattr: { fill: "pink", stroke: "firebrick" },
		},
		{ source: "house1", target: "n1" },
		{ source: "house2", target: "n1" },
		{ source: "house3", target: "n1" },
		{ source: "house4", target: "n1" },
		{ source: "n1", target: "town1" },
		{ source: "n2", target: "town1" },
		{ source: "n3", target: "town1" },
		{ source: "town1", target: "Conekt" },
		{ source: "town2", target: "Conekt" },
		{ source: "n4", target: "town2" },
		{ source: "n5", target: "town2" },
		{ source: "n6", target: "town2" },
		{ source: "town3", target: "Conekt" },
		{ source: "town4", target: "Conekt" },
		{ source: "town5", target: "Conekt" },
		{ source: "AT&T", target: "Comcast", tattr: { radial: 30 } },
		{
			source: "WireUp",
			target: "Comcast",
			sattr: { fill: "pink", stroke: "firebrick" },
		},
		{ source: "town105", target: "WireUp" },
		{ source: "town106", target: "WireUp" },
		{ source: "town107", target: "WireUp" },
		{ source: "town108", target: "WireUp" },
		{ source: "town109", target: "WireUp" },
	],
});

cdemo.graph({
	id: "graph",
	height: 50,
	strength: -40,
	svg_height: 315,
	color: "yellowScheme",
	data: [
		{ source: "house1", target: "house2" },
		{ source: "house2", target: "house1" },
		{ source: "house3", target: "house2" },
		{ source: "house2", target: "house3" },
		{ source: "house4", target: "house1" },
		{ source: "house1", target: "house4" },
		{ source: "house2", target: "house6" },
		{ source: "house3", target: "house4" },
		{ source: "house4", target: "house5" },
		{ source: "house5", target: "house4" },
		{ source: "house1", target: "house5" },
		{ source: "house5", target: "house1" },
		{ source: "house4", target: "house7" },
		{ source: "house6", target: "house2" },
		{ source: "house2", target: "house6" },
		{ source: "house7", target: "house3" },
		{ source: "house3", target: "house7" },
	],
});