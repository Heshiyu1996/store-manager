<template>
    <u-modal :visible="visible" title="上传音频" @before-close="submit" @close="closeModal" class="theme-upload-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <div id="musicInner" />
            <el-form-item label="当前主题">
                <u-label :text="form.themeName" />
            </el-form-item>
            <el-form-item label="上传类别">
                <el-radio v-model="form.type" :label="10">10分钟音频</el-radio>
                <u-icon :disabled="!url10" name="play" class="icon" @click="_playMusic(url10)" />
                <br />
                <el-radio v-model="form.type" :label="0">结束音频</el-radio> <u-icon :disabled="!url0" name="play" class="icon" @click="_playMusic(url0)" />
            </el-form-item>
            <el-form-item label="文件上传">
                <el-upload
                    class="upload-demo"
                    drag
                    :action="uploadURL"
                    :headers="uploadData"
                    :data="uploadParams"
                    :limit="1"
                    :before-upload="beforeUpload"
                    :on-success="getUrl"
                    :on-exceed="handleExceed"
                    :on-remove="handleRemove"
                    multiple
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传MP3文件，且不超过2M</div>
                </el-upload>
            </el-form-item>
            <!-- <el-button @click="test">上传好了</el-button> -->

            <el-form-item v-if="form.tempUrl" label="试听">
                <u-icon :disabled="!form.tempUrl" name="play" class="icon" @click="_playMusic(form.tempUrl, $event)" />
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
// import { uploadVoice, saveVoice } from '@/server/api'
import { saveVoice } from '@/server/api'
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
                type: 10,
                tempUrl: ''
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
        uploadParams() {
            let data = {
                themeId: this.form.themeId,
                type: this.form.type
            }
            return data
        },
        uploadURL() {
            let postfix = `api/voice/upload`
            return rootURL + postfix
        },
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-theme-upload-modal', themeDetail => {
            let { id: themeId, name: themeName, url0, url10 } = themeDetail
            this.form = { ...this.form, themeId, themeName }
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
                if (this.form.tempUrl) {
                    this.$confirm(`现在离开音频不会保存，确定离开吗？`)
                        .then(() => {
                            this.closeModal()
                            return
                        })
                        .catch(() => {
                            return
                        })
                } else {
                    this.closeModal()
                    return
                }
            }

            this._saveTheme()
        },
        _saveTheme() {
            let param = { ...this.form, url: this.form.tempUrl }
            console.log(param)
            saveVoice(param).then(() => {
                this.$message('保存成功')
                this.closeModal(true)
            })
        },

        _playMusic(url) {
            playMusic([url], 'musicInner')
        },

        getUrl(response) {
            console.log(response)
            this.form.tempUrl = response.data || ''
        },

        beforeUpload(file) {
            const isMP3 = file.type === 'audio/mp3'
            const isLt2M = file.size / 1024 / 1024 < 2

            !isMP3 && this.$message.error('上传的音频格式只能是 MP3 格式，请检查')
            !isLt2M && this.$message.error('上传的音频大小不能超过 2MB，请检查')
            return isMP3 && isLt2M
        },

        handleExceed() {
            this.$message.error('目前最多只能上传一个音频（若需替换，请清空后再上传）')
        },

        handleRemove() {
            this.form.tempUrl = ''
        }
    }
}
</script>

<style lang="scss" scoped>
.theme-upload-modal {
    /deep/ .u-modal-body {
        overflow-y: visible;

        /deep/ .el-form {
            width: 530px;

            #musicInner {
                position: absolute;
                right: -16px;
                z-index: 2;
                top: -73px;

                audio {
                    height: 35px;
                }
            }

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
