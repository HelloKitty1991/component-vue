const events = {
    bind(el, binding, vnode) {
        const e = binding.value || {};
        Object.keys(e).forEach((i) => {
            const v = e[i];
            const k = i.toLowerCase();
            vnode.componentInstance.$off(k, v);
            vnode.componentInstance.$on(k, v);
        });
    },
};
export default { events };
