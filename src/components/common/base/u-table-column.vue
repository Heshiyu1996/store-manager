<template>
    <td :style="style" :class="['u-table-column', { ellipse }]">
        <u-tooltip v-if="tooltipTxt" :content="tooltipTxt" :tooltip-txt="tooltipTxt" direction="bottom"><slot></slot></u-tooltip>
        <slot v-else></slot>
    </td>
</template>

<script>
export default {
    name: 'u-table-column',
    props: {
        label: String,
        tooltip: { type: String, default: '' } /* 提示内容 */,
        tooltipDirection: { type: String, default: 'right' } /* 提示内容的方向 */,
        tooltipTxt: { type: String, default: '' } /* 是否显示tooltip */,
        sortTypeList: { type: Array, default: () => [] } /* 排序类型（按创建/更新时间）的列表 */,
        defaultSortType: { type: String, default: '' } /* 排序类型（按创建/更新时间）的默认值 */,
        showSort: { type: Boolean, default: false } /* 是否显示排序类型（按倒序/正序） */,
        visible: { type: Boolean, default: true } /* 是否显示该列 */,
        required: { type: Boolean, default: false } /* 是否是必填项 */,
        ellipse: { type: Boolean, default: false } /* 是否是超出省略 */,
        width: String,
        maxWidth: String,
        minWidth: String
    },
    computed: {
        style() {
            return { width: this.width, maxWidth: this.maxWidth, minWidth: this.minWidth }
        }
    },
    created() {
        if (this.visible && !this.$parent.columns.find(item => item.label === this.label)) {
            this.$parent.columns.push(this)
        }
    }
}
</script>

<style lang="scss" scoped>
.u-table-column /deep/ {
    position: relative;

    .u-tooltip {
        max-width: 85%;

        .u-popper {
            width: 100%;
            padding-bottom: 15px;

            .trigger {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                max-width: 100%;
            }

            .popper[direction^='bottom'] {
                cursor: unset;
                position: fixed;
                transform: translate(-50%, 10px);
                width: auto;
                max-width: 250px;
                word-wrap: break-word;

                &::after {
                    transform: rotate(-45deg) translate(-38%, -5px);
                }
            }
        }
    }
}

.ellipse {
    @include ellipse();
    max-width: 30vw;
}
</style>
