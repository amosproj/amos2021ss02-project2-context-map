import { RandomNumberGenerator } from "./RandomNumberGenerator";

export class RandomNumberGeneratorImpl implements RandomNumberGenerator {
    public next(minOrMax? : number, max? : number) : number {
        max = max ?? 1.0;
        const min = minOrMax ?? 0.0; 

        if(min > max)
            return NaN;

        return min + Math.random() * (max - min);
    }
}