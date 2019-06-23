<template>
    <div class="arrange-info-card">
        <div v-if="arrangeInfo">
            <div v-if="arrangeInfo.status === ARRANGE_STATUS_MAP.ARRANGED">
                <i class="green-light">待开始</i>
                <u-icon name="person" class="icon" />{{ arrangeInfo.arrangeNum }} | <u-icon name="phone" class="icon" />{{ arrangeInfo.phone }}<br />
                预约时间：{{ arrangeInfo.arrangeTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}<br />

                <span size="mini" :class="{ ifPaid: true, disabled: !arrangeInfo.isPaid }">付款</span> |
                <span size="mini" :class="{ ifArrived: true, disabled: !arrangeInfo.isArrived }">到达</span>
                <br />

                <u-icon name="edit" class="icon" @click="editRow" /> | <u-icon name="remove" class="icon" @click="deleteRow" /> |
                <el-button type="danger" @click="startRow" size="mini" class="start-btn">开始游戏</el-button>
            </div>

            <div v-if="isStarted || isEnding || isEnded">
                <i v-if="isStarted" class="started-light">执行中</i>
                <i v-if="isEnding" class="ending-light">即将结束</i>
                <i v-if="isEnded" class="ended-light">已结束</i>

                <u-icon name="person" class="icon" />{{ arrangeInfo.arrangeNum }} | <u-icon name="phone" class="icon" />{{ arrangeInfo.phone }}<br />
                开始时间：{{ arrangeInfo.startTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}<br />
                结束时间：{{ arrangeInfo.endTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}<br />

                <u-icon name="edit" class="icon" @click="editRow" /> | <u-icon name="remove" class="icon" @click="deleteRow" />
            </div>
        </div>
        <div v-else>
            <el-button type="primary" @click="addPatch" size="mini" class="add-btn">添加预定</el-button>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { ARRANGE_STATUS_MAP } from '@/utils/config'

const { mapGetters } = createNamespacedHelpers('login')
// const ARRANGE_STATUS_MAP = {
//     ARRANGED: 1,
//     STARTED: 2,
//     END: 3
// }

export default {
    props: {
        arrangeInfo: { type: Object, default: () => {} },
        storeId: { type: Number, default: 0 },
        themeId: { type: Number, default: 0 }
    },
    data() {
        return {
            ARRANGE_STATUS_MAP
        }
    },
    computed: {
        isStarted() {
            return this.arrangeInfo.status === ARRANGE_STATUS_MAP.STARTED
        },
        isEnded() {
            return this.arrangeInfo.status === ARRANGE_STATUS_MAP.END
        },
        isEnding() {
            return this.arrangeInfo.status === ARRANGE_STATUS_MAP.IS_ENDING
        },
        ...mapGetters(['getStoreListStore'])
    },
    created() {},
    destroyed() {},
    methods: {
        addPatch() {
            this.$emit('add-patch', this.storeId, this.themeId)
        },
        editRow() {
            this.$emit('edit-row', { ...this.arrangeInfo, storeId: this.storeId, themeId: this.themeId })
        },
        deleteRow() {
            let { id } = this.arrangeInfo
            this.$emit('delete-row', id)
        },
        startRow() {
            let { id } = this.arrangeInfo
            this.$emit('start-row', id)
        }
    }
}
</script>

<style lang="scss" scoped>
.arrange-info-card {
    display: flex;
    position: relative;
    min-width: 182px;
    min-height: 130px;
    justify-content: center;
    align-items: center;
    padding: 6px;
    margin-right: 8px;
    text-align: center;

    .green-light,
    .started-light,
    .ending-light,
    .ended-light {
        display: inline-block;
        position: absolute;
        width: 50px;
        height: 20px;
        line-height: 20px;
        top: 0px;
        right: -5px;
        border-radius: 10px 0 0 10px;
        color: white;
        // transition: all .3s ease;
    }

    .green-light {
        background: green;
    }

    .started-light {
        background: orange;
    }

    .ending-light {
        background: red;
    }

    .ended-light {
        background: #333;
    }

    .start-btn {
        padding: 3px 5px;
    }

    .ifArrived,
    .ifPaid {
        border: 0;
        margin: 0 8px;
        @include font-normal(12px, $normal-color-m);

        &:before {
            content: '已';
        }

        &.disabled {
            @include font-normal(12px, $tip-color-s);

            &:before {
                content: '未';
            }
        }
    }

    .btn {
        cursor: pointer;
    }

    .add-btn {
        padding: 6px 10px;
    }
}
</style>
