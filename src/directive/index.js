const directives = {};
const req = require.context('./', true, /(?<!index)\.js$/);
const requireAll = (requireContext) => {
    requireContext.keys().forEach((v) => {
        Object.assign(directives, req(v).default || {});
    });
};
requireAll(req);

export default directives;
