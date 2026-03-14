const RealProfiler = (function () {
    const stats = {};
    const active = {};

    function now() {
        return Date.now();
    }

    return {
        start(id) {
            active[id] = now();
        },

        end(id) {
            const t0 = active[id];
            if (t0 === undefined) return;

            const dt = now() - t0;
            delete active[id];

            let s = stats[id];
            if (!s) {
                s = stats[id] = {
                    count: 0,
                    total: 0,
                    max: 0
                };
            }

            s.count++;
            s.total += dt;
            if (dt > s.max) s.max = dt;
        },

        report(id) {
            const s = stats[id];
            if (!s) return;

            printDebugInfo(
                `[Profiler] ${id} | ` +
                `count=${s.count} ` +
                `avg=${(s.total / s.count).toFixed(2)}ms ` +
                `max=${s.max}ms`
            );
        },

        reportAll() {
            for (let id in stats) {
                this.report(id);
            }
        },

        reset(id) {
            if (id) delete stats[id];
            else {
                for (let k in stats) delete stats[k];
            }
        }
    };
})();

const NoOpProfiler = {
    start(id) {},
    end(id) {},
    report(id) {},
    reportAll() {},
    reset(id) {}
};



function updateProfilerEnabled(enabled) {
    profiler = enabled ? RealProfiler : NoOpProfiler;
    RealProfiler.reset();
}
