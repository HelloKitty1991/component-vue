import request from '@hello/utils/lib/request';
import gethelloAgent from '@hello/utils/lib/gethelloAgent';

const req = request();

function exportRequest(url, opt = {}) {
    opt.headers = { 'hello-Agent': gethelloAgent('GAIA_SASS', '1.0.0'), ...opt.headers || {} };
    return req(url.replace(/^http(s?):/, ''), opt);
}

window.request = exportRequest;

export default exportRequest;
