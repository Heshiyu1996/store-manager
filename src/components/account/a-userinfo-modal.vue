<template>
    <u-modal
        :visible="visible"
        :enableConfirm="$v.$anyDirty && !$v.$invalid"
        title="修改信息"
        @before-close="submit"
        @close="closeModal"
        class="a-password-modal"
    >
        <el-form ref="form" :model="form" label-width="50px">
            <el-form-item label="姓名">
                <u-input v-model="$v.form.realName.$model" placeholder="请输入姓名" />
                <u-error :visible="!$v.form.realName.required" text="请输入姓名" />
                <u-error :visible="!$v.form.realName.minLength" text="姓名不能少于2个字符" />
            </el-form-item>
            <el-form-item label="手机">
                <u-input v-model="form.phone" :regex="/^[0-9\u4e00-\u9fa5]+$/g" maxLength="11" placeholder="请输入手机号" />
                <u-error :visible="!$v.form.phone.required" text="手机必填" />
                <u-error :visible="!$v.form.phone.isPhone" text="手机格式不正确" />
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker v-model="form.birthday" type="date" placeholder="请输入你的生日" size="medium"> </el-date-picker>
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { required, minLength, helpers } from 'vuelidate/lib/validators'

export default {
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false }
    },
    data() {
        return {
            form: {
                realName: '',
                phone: '',
                birthday: ''
            }
        }
    },
    watch: {
        visible(newVal) {
            newVal && this.$v.$reset()
        }
    },
    validations: {
        form: {
            realName: {
                required,
                minLength: minLength(2)
            },
            phone: {
                required,
                isPhone(value) {
                    let regex_phone = /^1[345678][0-9]{9}$/
                    return !helpers.req(value) || regex_phone.test(value) // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
                }
            },
            birthday: { required }
        }
    },
    methods: {
        submit(e) {
            // 检查数据
            if (this._isInvalid()) return

            e.preventDefault()
            if (!e.ok) {
                this._openConfirmWhenChangedData()
                return
            }

            this._setPassword()
        },
        _openConfirmWhenChangedData() {
            this.$v.$anyDirty ? this.$confirm('确认放弃修改密码吗？').then(() => this.closeModal()) : this.closeModal()
        },
        _setPassword() {
            console.log(this.form)
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .u-modal-body {
    overflow-y: visible;

    .u-error {
        position: absolute;
        bottom: -15px;
        font-size: 12px;
    }
}
</style>
