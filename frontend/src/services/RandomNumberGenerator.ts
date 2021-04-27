export interface RandomNumberGenerator {
    next: {
        (min: number, max:number) : number;
        (max:number) : number;
        () : number;
    }
}