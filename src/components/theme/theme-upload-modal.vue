<template>
    <u-modal :visible="visible" title="上传音频" @before-close="submit" @close="closeModal" class="key-upload-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item label="上传类别">
                <el-radio v-model="form.type" :label="10">10分钟音频</el-radio> <u-icon :disabled="!url10" name="play" class="icon" @click="_playMusic(10)" />
                <br />

                <el-radio v-model="form.type" :label="0">结束音频</el-radio> <u-icon :disabled="!url0" name="play" class="icon" @click="_playMusic(0)" />
            </el-form-item>
            <el-form-item label="文件上传">
                <el-upload class="upload-demo" drag :action="uploadURL" :headers="uploadData" multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传MP3文件，且不超过5M</div>
                </el-upload>
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { addTheme, editTheme } from '@/server/api'
import { createNamespacedHelpers } from 'vuex'
import { playMusic } from '@/utils/common'
import { fetchCookieValue } from '@/utils/common'
import { rootURL } from '@/utils/config'

const { mapGetters } = createNamespacedHelpers('login')

export default {
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false }
    },
    data() {
        return {
            form: {
                themeId: 0,
                type: 10
            },

            url0: '',
            url10: '',

            uploadData: {
                sessionId: fetchCookieValue('ZZH_ELP_SESS')
            },

            rootURL
        }
    },
    computed: {
        uploadURL() {
            let postfix = `api/voice/upload?themeId=${this.form.themeId}&type=${this.form.type}`
            return rootURL + postfix
        },
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-theme-upload-modal', themeDetail => {
            let { id: themeId, url0, url10 } = themeDetail
            this.form = { ...this.form, themeId }
            this.url0 = url0
            this.url10 = url10
        })
    },
    destroyed() {
        this.$bus.$off('open-theme-upload-modal')
    },
    methods: {
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this.type ? this._addTheme() : this._editTheme()
        },
        _addTheme() {
            let param = { ...this.form }
            addTheme(param).then(() => {
                this.$message('新增成功')
                this.closeModal(true)
            })
        },
        _editTheme() {
            let param = { ...this.form }
            editTheme(param).then(() => {
                this.$message('修改成功')
                this.closeModal(true)
            })
        },
        _playMusic(type) {
            playMusic([this[`url${type}`]])
        }
    }
}
</script>

<style lang="scss" scoped>
.key-upload-modal {
    /deep/ .u-modal-body {
        overflow-y: visible;

        .el-form {
            width: 530px;

            &[disable='disabled'] {
                cursor: not-allowed;
            }

            .record-type-wrapper {
                .el-select {
                    width: 80px;
                    margin-right: 10px;
                }
                .u-input {
                    width: 230px;
                }
            }

            .textarea {
                height: 130px;
            }
        }

        .u-error {
            position: absolute;
            bottom: -15px;
            font-size: 12px;
        }
    }
}
</style>
