<template>
    <u-layout class="arrange-list" direction="v">
        <div class="top-wrapper">
            <u-layout class="filter">
                <el-select v-model="searchParams.storeId" filterable placeholder="请选择门店">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <el-date-picker v-model="searchParams.date" type="date" @change="_getIncomeList" placeholder="请输入查询时间" size="medium"> </el-date-picker>
            </u-layout>
            <u-layout v-if="searchParams.storeId" class="operation">
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                    <el-button type="primary" icon="el-icon-plus" circle @click="addPatch(searchParams.storeId)"></el-button>
                </el-tooltip>
            </u-layout>
        </div>
        <u-layout class="content-wrapper" direction="v">
            <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="_getVoiceList">获取音乐</el-button> -->
            <div>今日收款：{{ incomeText || '暂无' }}</div>
            <!-- {{ voiceList }} -->
            <div id="music"></div>

            <div v-loading.body="loading">
                <u-table v-if="!loading" ref="operationTable" :list="list" auto is-list>
                    <template slot-scope="{ row }">
                        <u-table-column label="时间" ellipse>
                            {{ row.hour }}
                        </u-table-column>
                        <u-table-column v-for="theme in themeList" :key="theme.id" :label="theme.name" width="18vw" ellipse>
                            <ArrangeInfoCard
                                :arrange-info="row[theme.id]"
                                :theme-id="theme.id"
                                :store-id="searchParams.storeId"
                                @add-patch="(storeId, id) => addPatch(storeId, id)"
                                @edit-row="editRow"
                                @delete-row="deleteRow"
                                @start-row="startRow"
                            ></ArrangeInfoCard>
                        </u-table-column>
                    </template>
                </u-table>
            </div>
        </u-layout>

        <ArrangeInfoModal :visible="isOpenArrangeInfoModal" :otherList="otherList" @close="closeArrangeInfoModal" />
    </u-layout>
</template>

<script>
import ArrangeInfoModal from '@/components/order/arrange-info-modal'
import ArrangeInfoCard from '@/components/order/arrange-info-card'
import { getReserveList, deleteReserve, startReserve, getOtherList, getIncomeList, getVoiceList } from '@/server/api'
import { MODIFY_MODAL_TYPE, OPERATION_TYPE } from '@/utils/config'
import { playMusic } from '@/utils/common'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')
const WORD_HOUR_LIST = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4]
const IS_STARTED_MAP = [
    {
        value: '',
        label: '全部'
    },
    {
        value: true,
        label: '已开始'
    },
    {
        value: false,
        label: '未开始'
    }
]
const IS_DELETED_MAP = [
    {
        value: '',
        label: '全部'
    },
    {
        value: true,
        label: '已删除'
    },
    {
        value: false,
        label: '未删除'
    }
]

export default {
    name: 'arrange-list',
    components: { ArrangeInfoModal, ArrangeInfoCard },
    data() {
        return {
            searchParams: {
                storeId: '',
                date: new Date(new Date().toLocaleDateString())
            },
            list: [],

            otherList: {},
            themeList: [],
            incomeList: [],
            voiceList: [],

            isOpenArrangeInfoModal: false,
            loading: true,
            pollingId: '',

            IS_STARTED_MAP,
            IS_DELETED_MAP,
            OPERATION_TYPE,
            WORD_HOUR_LIST
        }
    },
    computed: {
        incomeText() {
            let text = Object.keys(this.incomeList).reduce((total, item) => total + `${item}：${this.incomeList[item]} 、`, '')
            return text ? `${text}合计：${this.incomeTotal}元` : '暂无'
        },
        ...mapGetters(['getStoreListStore'])
    },
    watch: {
        'searchParams.storeId'() {
            this._getList()
            this._getOtherList()
            this._getIncomeList()
        },
        'searchParams.date'() {
            this._getList()
        },
        // voiceList: {
        //     handler(val) {
        //         !!val.length && playMusic(val)
        //     },
        //     deep: true
        // },
        getStoreListStore: {
            handler(storeList) {
                this.searchParams.storeId = (storeList[0] && storeList[0].id) || ''
            },
            immediate: true
        }
    },
    mounted() {
        this._getVoiceList()
        playMusic(this.voiceList)
    },
    beforeDestroy() {
        clearInterval(this.pollingId)
    },
    methods: {
        addPatch(storeId, themeId) {
            console.log(storeId, themeId)
            this.isOpenArrangeInfoModal = true
            this.$bus.$emit('open-arrange-info-modal', { storeId, themeId }, MODIFY_MODAL_TYPE.ADD)
        },
        editRow(row) {
            this.$bus.$emit('open-arrange-info-modal', row, MODIFY_MODAL_TYPE.EDIT)
            this.isOpenArrangeInfoModal = true
        },
        deleteRow(id) {
            this.$confirm(`是否删除所选预定 ？`).then(() =>
                deleteReserve(id).then(() => {
                    this.$message('删除成功')
                    this._getList()
                })
            )
        },
        startRow(id) {
            this.$confirm(`是否开始执行所选预定 ？`).then(() =>
                startReserve(id).then(() => {
                    this.$message('执行成功，开始计时')
                    this._getList()
                })
            )
        },
        _getVoiceList() {
            this.pollingId = setInterval(() => {
                getVoiceList({ storeId: this.searchParams.storeId }).then(urls => {
                    console.log(urls)

                    if (!urls.length) return

                    this.voiceList = this.voiceList.concat(urls)
                    playMusic(this.voiceList)
                })
            }, 3000)
        },
        _getList() {
            if (typeof this.searchParams.date !== 'number') {
                this.searchParams.date = this.searchParams.date.getTime()
                return
            }
            this.loading = true
            // setTimeout(() => {
            setTimeout(() => {
                getReserveList(this.searchParams)
                    .then(data => {
                        console.log(data)
                        this.list = data.list || []
                        this._updateList()

                        this.loading = false
                        // this.totalCount = data.totalCount || 0
                    })
                    .catch(e => console.log(e))
            }, 200)
            // }, 122000)
        },
        _getOtherList() {
            getOtherList(this.searchParams)
                .then(data => {
                    this.themeList = []
                    const { themeList } = data
                    this.otherList = data || {}
                    this.themeList = themeList
                })
                .catch(e => console.log(e))
        },
        _getIncomeList() {
            getIncomeList(this.searchParams)
                .then(data => {
                    this.incomeList = data.list || []
                    this.incomeTotal = data.total || 0
                })
                .catch(e => console.log(e))
        },
        closeArrangeInfoModal(isSuccess) {
            this.isOpenArrangeInfoModal = false
            isSuccess && this._getList(false)
        },
        _updateList() {
            let list = []
            WORD_HOUR_LIST.forEach(hour => {
                let existHour = this.list.filter(item => item.hour === hour),
                    targetObj = existHour.length ? existHour[0] : { hour }

                list.push(targetObj)
            })
            this.list = [...list]
        }

        // playMusic(musicList) {
        //     let myAudio = new Audio()
        //     let src = musicList.shift()

        //     myAudio.src = src
        //     //将最后一个音乐添加到数组的开头，这样实现循环
        //     // musicList.unshift(src)

        //     //绑定音乐结束事件，当音乐播放完成后，将会触发playEndedHandler方法
        //     myAudio.addEventListener('ended', playEndedHandler, false)
        //     //播放当前音乐
        //     document.getElementById('music').appendChild(myAudio)
        //     //将循环播放关闭，如果开启，将不能触发playEndedHandler方法，只能进行单曲循环
        //     myAudio.loop = false
        //     myAudio.play()

        //     function playEndedHandler() {
        //         src = musicList.shift()
        //         myAudio.src = src
        //         myAudio.play()
        //     }
        // }
    }
}
</script>

<style lang="scss" scoped>
.arrange-list {
    height: 100%;
    padding: 0 30px 40px;

    .top-wrapper {
        display: flex;
        height: 40px;
        justify-content: space-between;
        align-items: center;

        .el-button {
            margin-right: 0;
        }
    }

    .content-wrapper {
        font-size: 12px;

        .u-table-column {
            line-height: 26px;
            height: auto;
            // max-height: 120px;
        }

        .icon {
            font-size: 20px;
            cursor: pointer;
        }

        .el-pagination {
            text-align: right;
        }

        .order-type {
            display: inline-block;
            height: 100%;
            width: 50px;
            margin-right: 5px;
            text-align: center;
            line-height: 24px;
            border-radius: 4px;
            vertical-align: middle;
            background: $black;
            @include font-normal(12px, $white);
            box-sizing: content-box;

            &[type='started'] {
                background: $primary-color;
                @include font-normal(12px, $white);
            }

            &[type='not-started'] {
                background: $white;
                @include font-normal(12px, $primary-color);
                border: 1px solid $primary-color;
            }

            &[type='deleted'] {
                background: $error-color;
                @include font-normal(12px, $white);
                border: 1px solid $white;
            }

            &[type='not-deleted'] {
                background: $white;
                @include font-normal(12px, $error-color);
                border: 1px solid $error-color;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
