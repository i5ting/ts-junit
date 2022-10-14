export const createTypeError = (
  operation: string,
  paramName: symbol | string,
  actualValue: unknown,
  expectedType: string,
): TypeError => {
  return new TypeError(
    `${operation} - Expected '${String(
      paramName,
    )}' to be of type ${expectedType}, but got: ${Object.prototype.toString.call(
      actualValue,
    )} (${String(actualValue)})`,
  );
};
