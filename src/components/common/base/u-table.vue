<template>
    <table class="u-table" :class="{ auto, scroll, isList }">
        <template v-if="isLoading">
            <u-icon class="loading" name="loading" scale="1" />
        </template>
        <template v-else>
            <thead v-if="list.length !== 0">
                <tr>
                    <th v-for="(column, index) in columns" :style="column.style" :key="index">
                        <span type="7" :class="column.required ? 'required' : ''" :title="column.label">{{ column.label }}</span>
                        <u-tooltip v-if="column.tooltip" :content="column.tooltip" :direction="column.tooltipDirection"><u-icon name="info"/></u-tooltip>
                        <u-icon v-if="column.showSort" :name="orderDesc ? 'sort-desc' : 'sort-asc'" @click="setOrderType" class="sort" />
                        <u-th-select
                            v-if="column.sortTypeList.length"
                            :value="column.defaultSortType"
                            :list="column.sortTypeList"
                            size="s"
                            @select_value="setSortType"
                            class="select"
                        />
                    </th>
                </tr>
            </thead>
            <tbody v-if="list.length !== 0" :style="style">
                <tr v-for="(row, index) in list" :key="index" @click="rowItemClick(row, index, $event)" class="ai-table-content ai-table-row">
                    <slot :row="row" :rowIndex="index" />
                </tr>
            </tbody>
            <div v-else class="no-data">{{ emptyTip }}</div>
        </template>
    </table>
</template>

<script>
export default {
    name: 'u-table',
    props: {
        list: Array,
        auto: Boolean,
        scroll: Boolean,
        isList: Boolean,
        hasLoading: { type: Boolean, default: false },
        maxHeight: { type: String, default: '' }, // xx vh || xx px
        emptyTip: { type: String, default: '暂无数据记录' }
    },
    data() {
        return {
            columns: [],
            isLoading: this.hasLoading,

            orderDesc: true
        }
    },
    computed: {
        style() {
            return { maxHeight: this.maxHeight }
        }
    },
    watch: {
        list(val) {
            this.isLoading = false
        }
    },
    methods: {
        rowItemClick(row, index, ev) {
            this.$emit('row-click', row, index, ev)
        },
        setSortType(type) {
            this.$emit('set-sort-type', type)
        },
        setOrderType() {
            this.orderDesc = !this.orderDesc
            this.$emit('set-order-type', this.orderDesc ? 'desc' : 'asc')
        }
    }
}
</script>

<style lang="scss" scoped>
.u-table {
    position: relative;

    .loading {
        @include center();
        display: inline-block;
        margin-top: 200px;
        animation: rotate 2s ease infinite;
    }

    &.auto {
        width: 100%;
    } // 自适应

    &[size='s'] {
        th,
        td {
            padding: 8px 0; // 上下空出间隙
        }

        thead {
            border: 1px solid #e6e6eb;

            tr {
                height: 40px;
                background-color: #fafbfc;
                @include font-normal(14px, #757580);
            }
        }

        tbody {
            border: 1px solid #e6e6eb;

            tr {
                border-bottom: 1px solid transparent;

                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }

    &.scroll {
        display: inline-block;

        thead {
            display: block;
            height: 40px;

            tr {
                display: inline-block;
                width: 100%;
            }
        }

        tbody {
            display: inline-block;
            max-height: 305px;
            width: 100%;
            border-radius: 0;
            margin-top: -2px;
            overflow: scroll;
        }
    }

    &.isList {
        tr {
            display: inline-block;
            width: 100%;
        }

        th,
        td {
            display: inline-block;
            min-width: 100px;
            height: 48px;
        }

        thead {
            height: 56px;
        }

        tbody {
            max-height: 55vh;
        }
    }

    th,
    td {
        padding: 12px 0; // 空出间隙

        &:first-child {
            // 表格左空出间隙
            padding-left: 22px;
        }
        &:last-child {
            // 表格右空出间隙
            padding-right: 22px;
        }
    }

    // 表头
    thead {
        tr {
            height: 48px;
            border-bottom: 1px solid #e1e3e6;
            @include font-large(14px, $normal-color-s);

            th {
                position: relative;
                white-space: nowrap;

                .required::after {
                    content: '*';
                    color: red;
                }

                .u-tooltip /deep/ {
                    .u-popper {
                        padding: 0 20px 20px 20px;
                        background: transparent;
                        margin-left: -12px;

                        .trigger {
                            .u-icon {
                                top: -1px;
                                left: -6px;
                            }

                            .u-button {
                                display: inline-block;
                                min-width: 106px;
                                height: 32px;
                            }
                        }

                        .popper {
                            top: 3px;
                            left: 20px;

                            &[direction='bottom'] {
                                top: 30px;
                                left: 0;
                            }

                            .u-menu-item {
                                display: block;
                            }
                        }
                    }
                }

                .sort {
                    margin-top: -2px;
                    margin-left: 10px;
                }

                .u-th-select {
                    width: 20px;
                    margin-left: 10px;
                    padding-left: 0;
                }
            }
        }
    }

    tbody {
        border-radius: 4px;
        background-color: #ffffff;

        tr {
            border-bottom: 1px solid #e1e3e6;
        }
    }

    .no-data {
        @include center();
        margin-top: 200px;

        .u-icon {
            width: 16px;
            height: 16px;
            margin-right: 14px;
        }
    }
}
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(359deg);
    }
}
</style>
