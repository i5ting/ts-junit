import { performance } from "perf_hooks";

const measure = (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const finish = performance.now();
        console.log(`Execution time: ${finish - start} milliseconds`);
        return result;
    };

    return descriptor;
};

class Rocket {
    @measure
    launch() {
        console.log("Launching in 3... 2... 1... 🚀");
    }

    @measure
    launch2() {
        console.log("Launching2 in 3... 2... 1... 🚀");
    }
}

const rocket = new Rocket();
rocket.launch2();