<template>
    <u-modal :visible="visible" title="上传音频" @before-close="submit" @close="closeModal" class="theme-upload-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <div id="musicInner" />
            <el-form-item label="文件上传">
                <el-upload class="upload-demo" drag :action="uploadURL" :headers="uploadData" :data="uploadParams" multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传MP3文件，且不超过5M</div>
                </el-upload>
            </el-form-item>
            <el-button @click="test">上传好了</el-button>

            <el-form-item v-if="tempUrl" label="试听">
                <u-icon :disabled="!tempUrl" name="play" class="icon" @click="_playMusic(tempUrl, $event)" />
            </el-form-item>
            <el-form-item v-if="tempUrl" label="上传类别">
                <el-radio v-model="form.type" :label="10">10分钟音频</el-radio>
                <u-icon :disabled="!url10" name="play" class="icon" @click="_playMusic(url10)" />
                <br />
                <el-radio v-model="form.type" :label="0">结束音频</el-radio> <u-icon :disabled="!url0" name="play" class="icon" @click="_playMusic(url0)" />
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
                type: 10
            },

            url0: '',
            url10: '',

            tempUrl: '',

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
        test() {
            this.tempUrl = 'http://www.51mp3ring.com/51mp3ring_com3/at200911116232599996.mp3'
        },
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this._saveTheme()
        },
        _saveTheme() {
            let param = { ...this.form, url: this.tempUrl }
            console.log(param)
            saveVoice(param).then(() => {
                this.$message('保存成功')
                this.closeModal(true)
            })
        },
        _playMusic(url) {
            playMusic([url], 'musicInner')
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
