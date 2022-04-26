export const isObjectLiteral = (obj) => {
	return (obj !== null) && (obj.constructor.name === "Object");
}