import Example from './Example.vue';

export default {
    range: {
        type: 'component',
        label: '日期区间',
        field: 'range',
        spanTimes: 1,
        attrs: { placeholder: '请输入' },
        visible: true,
        component: Example,
        props: {
            item: {
                type: 'date_range', label: '日期区间', field: 'range', spanTimes: 1, attrs: { placeholder: '请输入' }, visible: true,
            },
        },
        placeholder: '请输入',
    },
    name: {
        type: 'input', label: '姓名', field: 'name', attrs: {}, events: {}, visible: true, placeholder: '请输入姓名',
    },
    status: {
        type: 'select', label: '状态 ', field: 'status', attrs: { multiple: true }, events: {}, default: ['1'], options: [{ value: '1', label: '进行中' }, { value: '2', label: '完成' }], visible: true, placeholder: '请选择状态 ',
    },
    sex: {
        type: 'select', label: '性别 ', field: 'sex', options: [{ value: 1, label: '男' }, { value: 2, label: '女' }], visible: true, attrs: { multiple: false }, placeholder: '请选择性别 ',
    },
    amount: {
        type: 'component',
        label: '金额',
        field: 'amount',
        spanTimes: 2,
        default: [5, 6],
        visible: true,
        component: Example,
        props: {
            item: {
                type: 'numberrange', label: '金额', field: 'amount', spanTimes: 2, default: [5, 6], visible: true,
            },
        },
        placeholder: '请选择金额',
    },
    daterange: {
        type: 'component',
        label: 'daterange',
        field: 'daterange',
        attrs: { disabled: false },
        events: {},
        startEvents: {},
        visible: true,
        component: Example,
        props: {
            item: {
                type: 'date_range', label: 'daterange', field: 'daterange', attrs: { disabled: false }, events: {}, startEvents: {}, visible: true,
            },
        },
        placeholder: '请选择daterange',
    },
    daterange1: {
        type: 'daterange', label: '默认时间段', field: 'daterange1', events: {}, visible: true, attrs: {}, placeholder: '请选择默认时间段',
    },
    search2: {
        type: 'search', label: '搜索字段', field: 'search2', visible: true, options: [], placeholder: '输入关键字搜索',
    },
    search3: {
        type: 'search', label: '搜索字段', field: 'search3', visible: true, options: [], placeholder: '输入关键字搜索',
    },
    search4: {
        type: 'search', label: '搜索字段', field: 'search4', visible: true, options: [], placeholder: '输入关键字搜索',
    },
    search5: {
        type: 'search', label: '搜索字段', field: 'search5', visible: true, options: [], placeholder: '输入关键字搜索',
    },
    button: {
        type: 'component',
        component: Example,
        field: 'button',
        props: { buttons: ['reset', 'search'], buttonSize: 'small' },
        colStyle: { textAlign: 'right' },
        placeholder: '请选择undefined',
    },
};
