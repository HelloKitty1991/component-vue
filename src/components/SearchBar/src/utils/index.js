export const getNewFormat = (span, val = 'YYYY-MM-DD HH:mm:ss') => {
    if (span === 6) {
        return val ? val.replace(/YYYY/, 'yyyy').replace(/DD/, 'dd') : '';
    }
    return val ? val.replace(/YYYY/, 'yy').replace(/DD/, 'dd') : '';
};
