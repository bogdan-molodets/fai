import { Point } from "./marker";

export class Target {
    /**
     *
     */
    constructor(readonly apLlh: Point,
        readonly apMarkerId: string,
        readonly apState: string,
        readonly cpLlh: Point,
        readonly cpMarkerId: string,
        readonly cpState: string,
        readonly rsId: string,
        readonly rsLlh: Point,
        readonly rsState: string,
        readonly targetId: string,
        readonly timeStamp: string) {
    }
}

export class TargetList {
    /**
     *
     */
    constructor(readonly status:string,
    readonly target:Target[]) {
        
    }
}