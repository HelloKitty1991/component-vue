import Vue from 'vue';
import merge from 'element-ui/src/utils/merge';
import { isVNode } from 'element-ui/src/utils/vdom';
import msgboxVue from './main.vue';

const defaults = {
    title: null,
    message: '',
    type: '',
    iconClass: '',
    showInput: false,
    showClose: true,
    modalFade: true,
    lockScroll: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    closeOnHashChange: true,
    inputValue: null,
    inputPlaceholder: '',
    inputType: 'text',
    inputPattern: null,
    inputValidator: null,
    inputErrorMessage: '',
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonPosition: 'right',
    confirmButtonHighlight: false,
    cancelButtonHighlight: false,
    confirmButtonText: '',
    cancelButtonText: '',
    confirmButtonClass: '',
    cancelButtonClass: '',
    customClass: '',
    beforeClose: null,
    dangerouslyUseHTMLString: false,
    center: false,
    roundButton: false,
    distinguishCancelAndClose: false,
};

const MessageBoxConstructor = Vue.extend(msgboxVue);

let currentMsg; let
    instance;
let msgQueue = [];

const defaultCallback = (action) => {
    if (currentMsg) {
        const { callback } = currentMsg;
        if (typeof callback === 'function') {
            if (instance.showInput) {
                callback(instance.inputValue, action);
            } else {
                callback(action);
            }
        }
        if (currentMsg.resolve) {
            if (action === 'confirm') {
                if (instance.showInput) {
                    currentMsg.resolve({ value: instance.inputValue, action });
                } else {
                    currentMsg.resolve(action);
                }
            } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
                currentMsg.reject(action);
            }
        }
    }
};

const initInstance = () => {
    instance = new MessageBoxConstructor({
        el: document.createElement('div'),
    });

    instance.callback = defaultCallback;
};

const showNextMsg = () => {
    if (!instance) {
        initInstance();
    }
    instance.action = '';

    if (!instance.visible || instance.closeTimer) {
        if (msgQueue.length > 0) {
            currentMsg = msgQueue.shift();

            const { options } = currentMsg;
            Object.keys(options).forEach((prop) => {
                instance[prop] = options[prop];
            });
            if (options.beforeOpen) {
                options.beforeOpen(instance);
            }
            if (options.callback === undefined) {
                instance.callback = defaultCallback;
            }

            const oldCb = instance.callback;
            instance.callback = (action, ins) => {
                oldCb(action, ins);
                showNextMsg();
            };
            if (isVNode(instance.message)) {
                instance.$slots.default = [instance.message];
                instance.message = null;
            } else {
                delete instance.$slots.default;
            }
            ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape', 'closeOnHashChange'].forEach((prop) => {
                if (instance[prop] === undefined) {
                    instance[prop] = true;
                }
            });
            document.body.appendChild(instance.$el);

            Vue.nextTick(() => {
                instance.visible = true;
            });
        }
    }
};

const MessageBox = function (opts, cb) {
    if (Vue.prototype.$isServer) return;
    let options = opts;
    let callback = cb;
    if (typeof options === 'string' || isVNode(options)) {
        options = {
            message: options,
        };
    const [, arg] = arguments; // eslint-disable-line
        if (typeof arg === 'string') {
            options.title = arg;
        }
    } else if (options.callback && !callback) {
        ({ callback } = options);
    }

    if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => { // eslint-disable-line
            msgQueue.push({
                options: merge({}, defaults, MessageBox.defaults, options),
                callback,
                resolve,
                reject,
            });

            showNextMsg();
        });
    }
    msgQueue.push({
        options: merge({}, defaults, MessageBox.defaults, options),
        callback,
    });

    showNextMsg();
};

MessageBox.setDefaults = (args) => {
    MessageBox.defaults = args;
};

MessageBox.alert = (message, title, options) => {
    if (typeof title === 'object') {
        options = title; // eslint-disable-line
        title = ''; // eslint-disable-line
    } else if (title === undefined) {
        title = ''; // eslint-disable-line
    }
    return MessageBox(merge({
        title,
        message,
        $type: 'alert',
        closeOnPressEscape: false,
        closeOnClickModal: false,
    }, options));
};

MessageBox.confirm = (message, title, options) => {
    if (typeof title === 'object') {
        options = title; // eslint-disable-line
        title = ''; // eslint-disable-line
    } else if (title === undefined) {
        title = ''; // eslint-disable-line
    }
    return MessageBox(merge({
        title,
        message,
        $type: 'confirm',
        showCancelButton: true,
    }, options));
};

MessageBox.prompt = (message, title, options) => {
    if (typeof title === 'object') {
        options = title; // eslint-disable-line
        title = ''; // eslint-disable-line
    } else if (title === undefined) {
        title = ''; // eslint-disable-line
    }
    return MessageBox(merge({
        title,
        message,
        showCancelButton: true,
        showInput: true,
        $type: 'prompt',
    }, options));
};

MessageBox.close = () => {
    instance.doClose();
    instance.visible = false;
    msgQueue = [];
    currentMsg = null;
};

export default MessageBox;
export { MessageBox };
