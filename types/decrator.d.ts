export declare function emptydata(): {};
export declare function data(): {};
export declare function BeforeAll(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): void;
export declare function BeforeEach(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): void;
export declare function AfterEach(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): void;
export declare function AfterAll(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): void;
export declare function Test(
  target: Object,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<any>,
): void;
export declare function DisplayName(
  message: string,
): ClassDecorator & PropertyDecorator;
export declare function Disabled(
  message: string,
): ClassDecorator & PropertyDecorator;
