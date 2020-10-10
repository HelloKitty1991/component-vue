import Vue from 'vue';
import Dialog from '../components/Dialog';

const dialogQueue = [];
export default {
    methods: {
        showComponent(cpt, opt = {}) {
            let component = cpt;
            if (typeof component === 'object') {
                component = Vue.extend(component);
            }
            component.prototype.$store = this.$store;
            const id = `klc_dialog_${Math.random().toString(32)}`;
            const dialog = new Dialog({
                data: {
                    title: '',
                    isComponent: true,
                    currentComponent: component,
                    content: '',
                    ...opt,
                },
            });
            dialog.id = id;
            document.body.appendChild(dialog.$mount().$el);
            dialogQueue.push(dialog);
        },
        closeDialog() {
            const dialog = dialogQueue.pop();
            dialog.$destroy();
            document.body.removeChild(dialog.$el);
        },
    },
};
