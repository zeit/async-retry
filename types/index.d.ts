declare module 'async-retry' {
    interface BailFunction {
        (err: any): void;
    }

    interface AttemptFunction<T> {
        (bail: BailFunction, attempt: number): T | Promise<T>;
    }

    interface Options {
        retries?: number;
        factor?: number;
        minTimeout?: number;
        maxTimeout?: number;
        randomize?: boolean;
        onRetry?: (err: any) => void;
    }

    interface Retry {
        <T>(fn: AttemptFunction<T>, opts?: Options): Promise<T>;
    }

    let retrier: Retry;
    export = retrier;
}
