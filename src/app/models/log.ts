export class LogResponse {
    /**
     *
     */
    constructor(
        readonly log: Log[],
        readonly status: string
    ) {

    }
}

export class Log {
    /**
     *
     */
    constructor(
        readonly flightId: string,
        readonly message: string,
        readonly sender: string,
        readonly timestamp: string,
    ) {
    }
}