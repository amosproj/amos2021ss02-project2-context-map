export interface RandomNumberGenerator {
    next: {
        (min: number, max:number) : number;
        (max:number) : number;
        () : number;
    }
}

export class RandomNumberGeneratorImpl implements RandomNumberGenerator {
    public next(minOrMax? : number, max? : number) : number {
        max = max ?? 1.0;
        const min = minOrMax ?? 0.0; 

        if(min > max)
            return NaN;

        return min + Math.random() * (max - min);
    }
}

export class RandomNumberGeneratorFake implements RandomNumberGenerator {
    private value: number;

    public constructor(value: number) {
        this.value = value;
    }

    public next(minOrMax? : number, max? : number) : number {
        max = max ?? 1.0;
        const min = minOrMax ?? 0.0; 

        if(min > max)
            return NaN;

        return this.value;
    }
}