import { defineSuiteData } from "./Suite";

export function Tag(tagName: string): ClassDecorator {
  const deco = (target: any): void => {
    defineSuiteData(target).tags.add(tagName);
  };

  return deco;
}
