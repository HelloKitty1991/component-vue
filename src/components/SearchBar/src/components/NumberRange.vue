<template>
    <div class="number-range">
        <el-row>
            <el-col :span="11">
                <input
                    ref="start"
                    :value="currentValue[0]"
                    :placeholder="item.startPlaceholder || '请输入'"
                    @input="valueInput($event, 0)"
                />
                <span
                    v-if="item.addonAfter"
                    class="addon-after"
                >{{ item.addonAfter }}</span>
            </el-col>
            <div style="text-align: center;height: 32px; line-height: 32px; width: 10px">
                ~
            </div>
            <el-col :span="11">
                <input
                    ref="end"
                    :value="currentValue[1]"
                    :placeholder="item.endPlaceholder || '请输入'"
                    @input="valueInput($event, 1)"
                />
                <span
                    v-if="item.addonAfter"
                    class="addon-after"
                >{{ item.addonAfter }}</span>
            </el-col>
        </el-row>
        <div class="close-wrapper">
            <i
                class="el-icon-circle-close"
                v-if="showClose"
                @click="handleClear"
            ></i>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Array,
                default: () => [],
            },
            item: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                showClose: false,
                currentValue: [].concat(this.value),
                paddingRight: 0,
            };
        },
        watch: {
            async value(val) {
                this.currentValue = [].concat(val);
            },
            currentValue(val) {
                this.showClose = val.filter(v => !!v).length > 0;
            },
        },
        mounted() {
            if (this.item.addonAfter) {
                this.$nextTick(() => {
                    const span = document.createElement('span');
                    span.innerHTML = this.item.addonAfter;
                    document.body.appendChild(span);
                    const paddingRight = `${span.offsetWidth + 20}px`;
                    this.$refs.start.style.paddingRight = paddingRight;
                    this.$refs.end.style.paddingRight = paddingRight;
                    document.body.removeChild(span);
                });
            }
        },
        methods: {
            async valueInput(e, index) {
                const preValue = [].concat(this.currentValue);
                if (e.target) {
                    if (e.target.value) {
                        if (!/^\.$/.test(e.target.value)) {
                            if (
                                /^-$/.test(e.target.value)
                                || (/\d+(?:\.)?$/.test(e.target.value)
                                    && (e.target.value.match(/\./g) || []).length <= 1)
                            ) {
                                this.$set(this.currentValue, index, e.target.value);
                                let res = false;
                                if (this.item.validator) {
                                    res = await this.item.validator(this.currentValue);
                                } else {
                                    res = true;
                                }
                                if (!res) {
                                    this.currentValue = preValue;
                                }
                            } else {
                                this.currentValue = preValue;
                            }
                        } else {
                            this.currentValue = preValue;
                        }
                    } else {
                        this.$set(this.currentValue, index, '');
                    }
                    this.$emit('input', this.currentValue);
                }
            },
            handleClear() {
                this.currentValue = this.currentValue.map(() => undefined);
                this.$emit('input', []);
            },
        },
    };
</script>

<style lang="scss" scope>
.number-range {
  display: flex;
  height: 32px;
  align-items: center;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  box-sizing: border-box;
  .el-row {
    width: 100%;
    display: flex;
    align-items: center;

    .el-col {
      position: relative;
      flex: 1;

      .addon-after {
        position: absolute;
        right: 16px;
        top: 1px;
        bottom: 1px;
        line-height: 30px;
        padding: 0 10px;
        background-color: white;
        color: #d0d0d0;
      }
    }
    input {
      border: none;
      width: 99%;
      outline: none;
      height: 28px;
      text-align: center;
      padding: 0 10px;
      box-sizing: border-box;
      &::-webkit-input-placeholder {
          color: #C0C4CC;
      }
    }

  }
    .close-wrapper {
        flex: 0 15px;
        display: flex;
        align-items: center;
        height: 100%;
    }

    .el-icon-circle-close {
        position: absolute;
        right: 10px;
        color: #C0C4CC;
        cursor: pointer;
        display: none;
    }
    &:hover .el-icon-circle-close{
        display: block;
    }
}
</style>
