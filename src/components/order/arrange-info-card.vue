<template>
    <div>
        <div v-if="arrangeInfo">
            <div v-if="arrangeInfo.status === ARRANGE_STATUS_MAP.ARRANGED">
                人数：{{ arrangeInfo.arrangeNum }}<br />
                电话：{{ arrangeInfo.phone }}<br />
                预约时间：{{ arrangeInfo.arrangeTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}<br />
                是否到店：{{ arrangeInfo.isArrived }}<br />
                是否付款：{{ arrangeInfo.isPaid }}<br />
                <div @click="editRow">编辑预定</div>
                <div @click="deleteRow">删除预定</div>
                <div @click="startRow">开始游戏</div>
            </div>
            <div v-if="arrangeInfo.status === ARRANGE_STATUS_MAP.STARTED">
                人数：{{ arrangeInfo.arrangeNum }}<br />
                电话：{{ arrangeInfo.phone }}<br />
                开始时间：{{ arrangeInfo.startTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}<br />
                结束时间：{{ arrangeInfo.endTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}<br />
                <div @click="deleteRow">删除预定</div>
                <div @click="editRow">备注</div>
            </div>
            <div v-if="arrangeInfo.status === ARRANGE_STATUS_MAP.END">
                <div @click="deleteRow">删除预定</div>
            </div>
        </div>
        <div v-else>
            <div @click="addPatch">添加</div>
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
        ...mapGetters(['getStoreListStore'])
    },
    created() {},
    destroyed() {},
    methods: {
        addPatch() {
            this.$emit('add-patch', this.storeId, this.themeId)
        },
        editRow() {
            this.$emit('edit-row', this.arrangeInfo)
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
}
</style>
