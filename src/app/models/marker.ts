export class Marker {
    /**
     *
     */
    constructor(readonly azimuth: number,
        readonly distance: number,
        readonly llh: Point,
        readonly markerId: string,
        readonly markerState: string,
        readonly timeStamp: string) {

    }
}

export class MarkerList {
    /**
     *
     */
    constructor(readonly status: string,
        readonly target: Marker[]) {

    }
}

export class Point {
    /**
     *
     */
    constructor(readonly hgt: number,
        readonly lat: number,
        readonly lon: number) {
    }
}

export class MarkerState {
    /**
     *
     */
    constructor(readonly llh: Point,
        readonly state: string,
        readonly status: string) {
    }
}

