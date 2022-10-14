export type ESConstructor<T = any> = new (...args: any[]) => T;

export type ESFunction<T = any> = {
  name: string;
  (...args: any[]): T;
};

export type ESCallable<T = any> = ESFunction<T> | ESConstructor<T>;
