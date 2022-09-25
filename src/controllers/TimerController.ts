import { DateTime } from 'luxon';

class TimerController {
    callback (): void{};
    timeout: number;
    timeInterval: number;
    expected: number | DateTime;

    constructor (callback: () => void, timeInterval: number) {
        this.callback = callback;
        this.timeInterval = timeInterval;
        this.expected = DateTime.local() + this.timeInterval;
        this.timeout = setTimeout(this.step, this.timeInterval);
    }

    step = (): void => {
        const dt = DateTime.local() - this.expected;
        if (dt > this.timeInterval) this.expected += this.timeInterval;

        this.callback();
        this.timeout = setTimeout(this.step, Math.max(0, this.timeInterval - dt));
    }
}

export { TimerController };
