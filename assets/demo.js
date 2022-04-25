import { cdemo } from "../cdemo/cdemo.mjs";
import { linkedList } from "../cdemo/cdemo.mjs";
import { plot } from "../cdemo/cdemo.mjs";
import { plot3d } from "../cdemo/cdemo.mjs";
import { tree } from "../cdemo/cdemo.mjs";
import { matrix } from "../cdemo/cdemo.mjs";
import { truthTable } from "../cdemo/cdemo.mjs";
import { sequence } from "../cdemo/cdemo.mjs";
import { stack } from "../cdemo/cdemo.mjs";
import { queue } from "../cdemo/cdemo.mjs";
import { circularQueue } from "../cdemo/cdemo.mjs";
import { doublyLinkedList } from "../cdemo/cdemo.mjs";
import { horizontalTree } from "../cdemo/cdemo.mjs";
import { network } from "../cdemo/cdemo.mjs";
import { graph } from "../cdemo/cdemo.mjs";



horizontalTree({
	id: "horizontalTreeDemo",
	data: [
		{ child: "preorder(F0)", parent: "" },
		{ child: "8", parent: "preorder(F0)" },
		{ child: "preorder(F1)", parent: "preorder(F0)" },
		{ child: "preorder(F2)", parent: "preorder(F0)" },
		{ child: "3", parent: "preorder(F1)" },
		{ child: "preorder(F3)", parent: "preorder(F1)" },
		{ child: "preorder(F4)", parent: "preorder(F1)" },
		{ child: "4", parent: "preorder(F3)" },
		{
			child: "preorder(0)",
			parent: "preorder(F3)",
			fill: "red",
			stroke: "firebrick",
		},
		{
			child: "preorder(0)",
			parent: "preorder(F3)",
			fill: "red",
			stroke: "firebrick",
		},
		{ child: "9", parent: "preorder(F4)" },
		{
			child: "preorder(0)",
			parent: "preorder(F4)",
			fill: "red",
			stroke: "firebrick",
		},
		{
			child: "preorder(0)",
			parent: "preorder(F4)",
			fill: "red",
			stroke: "firebrick",
		},
		{ child: "5", parent: "preorder(F2)" },
		{ child: "preorder(F5)", parent: "preorder(F2)" },
		{ child: "preorder(F6)", parent: "preorder(F2)" },
		{ child: "7", parent: "preorder(F5)" },
		{
			child: "preorder(0)",
			parent: "preorder(F5)",
			fill: "red",
			stroke: "firebrick",
		},
		{
			child: "preorder(0)",
			parent: "preorder(F5)",
			fill: "red",
			stroke: "firebrick",
		},
		{ child: "2", parent: "preorder(F6)" },
		{
			child: "preorder(0)",
			parent: "preorder(F6)",
			fill: "red",
			stroke: "firebrick",
		},
		{
			child: "preorder(0)",
			parent: "preorder(F6)",
			fill: "red",
			stroke: "firebrick",
		},
	],
});

doublyLinkedList({
	id: "doublyLinkedListDemo",
	data: [5, 8, 9, 2, 1],
});

circularQueue({
	id: "circularQueueDemo",
	data: ["A", "B", "C", "D", "E", "F", "G"],
});

queue({
	id: "queueDemo",
	data: [5, 8, 9, 7, 3],
});

stack({
	palette: "darkRedScheme",
	id: "stackDemo",
	data: ["f()", "g()", "h()", "i()", "j()", "k()"],
});

plot3d({
	id: "plot3dDemo",
	fn: (x, y) => (x ** 2 - y ** 2) * 0.2,
});

linkedList({
	id: "aLinkedList",
	data: [2, 3, 9, 11, 17, 20],
});

plot({
	id: "sinePlot",
	fn: (x) => Math.sin(x),
	domain: [-10, 10],
	range: [-4, 4],
	precision: 100,
});

truthTable({
	id: "flipFlopGate",
	focus: [
		[7, 5],
		[7, 6],
	],
	headers: ["clock", "set", "reset", "set*", "reset*", "Q", "Q*"],
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

matrix({
	id: "matrixDemo",
	margins: [50, 20, 50, 20],
	focus: [
		[1, 1],
		[1, 4],
		[1, 7],
		[1, 8],
		[1, 9],
		[2, 1],
		[2, 4],
		[2, 8],
		[3, 1],
		[3, 2],
		[3, 3],
		[3, 4],
		[3, 8],
		[4, 1],
		[4, 4],
		[4, 8],
		[5, 1],
		[5, 4],
		[5, 7],
		[5, 8],
		[5, 9],
	],
	indexed: true,
	data: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0],
		[0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
		[0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0],
		[0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
		[0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	],
});

sequence({
	id: "arrayDemo",
	data: [2, 4, 1, 3, 8, 0, 9, 7, 5],
});

network({
	id: "network",
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

graph({
	id: "graph",
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

tree({
	id: "binaryTree",
	narrow: 50,
	edgeLength: 110,
	data: [
		["a", ""],
		["b", "a"],
		["d", "b"],
		["h", "d"],
		["i", "d"],
		["j", "i"],
		["k", "i"],
		["e", "b"],
		["c", "a"],
	],
});
