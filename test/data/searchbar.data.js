export default [
    {
        type: 'date_range',
        label: '日期区间',
        field: 'range',
        spanTimes: 1,
        startFieldName: 'start',
        endFieldName: 'end',
        attrs: {
            placeholder: '请输入',
        },
    },
    {
        type: 'input',
        label: '姓名',
        field: 'name',
        validator() {
            return true;
        },
        attrs: {
        },
        events: {
            input: e => {
                console.log('event', e);
            },
        },
    },
    {
        type: 'select',
        label: '状态 ',
        field: 'status',
        attrs: {
            multiple: true,
        },
        events: {
            change: e => {
                console.log(e);
            },
        },
        default: ['1'],
        options: [
            {
                value: '1',
                label: '进行中',
            },
            {
                value: '2',
                label: '完成',
            },
            {
                value: '3',
                label: '完成3',
            },
            {
                value: '4',
                label: '完成4',
            },
            {
                value: '5',
                label: '完成5',
            },
            {
                value: '6',
                label: '完成6',
            },
        ],
    },
    {
        type: 'select',
        label: '性别 ',
        field: 'sex',
        options: [
            {
                value: 1,
                label: '男',
            },
            {
                value: 2,
                label: '女',
            },
        ],
    },
    {
        type: 'numberrange',
        label: '金额',
        field: 'amount',
        spanTimes: 2,
        default: [5, 6],
    },
    {
        type: 'date_range',
        label: 'daterange',
        field: 'daterange',
        attrs: {
            disabled: false,
        },
        events: {
            change: e => {
                console.log('events', e);
            },
        },
        startEvents: {
            change: e => {
                console.log('startEvents', e);
            },
        },
    },
    {
        type: 'daterange',
        label: '默认时间段',
        field: 'daterange1',
        events: {
            change: e => {
                console.log(e);
            },
        },
    },
    {
        type: 'input',
        label: '文本字段',
        field: 'text1',
    },
    {
        type: 'input',
        label: '文本字段',
        field: 'text2',
    },
    {
        type: 'input',
        label: '文本字段',
        field: 'text3',
    },
    {
        type: 'input',
        label: '文本字段',
        field: 'text4',
    },
];
