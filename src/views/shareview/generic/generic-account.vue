<template>
  <div class="gb-maincontainer" style="text-align:right">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Change Password</span>
      </div>
      <div>
        <el-form ref="form-required" :rules="rules" :model="passwords">
          <el-row>
            <el-col>
              <el-form-item label="Old Password" prop="oldPassword">
                <el-input v-model="passwords.oldPassword" :type="passwordType" />
                <!-- <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="New Password" prop="newPassword">
                <el-input v-model="passwords.newPassword" :type="passwordType" @input="onNewPasswordChange" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="Confirm Password" prop="confirmPassword">
                <el-input v-model="passwords.confirmPassword" :type="passwordType" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div>
          <el-button type="primary" @click="onConfirmClicked">Confirm</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import { changePassword } from '@/api/customer'
import store from '@/store'

export default {
    data() {
        const validatePassword = (rule, value, callback) => {
          var reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!#@*&.])[a-zA-Z\d!#@*&.]*$/
          
          if (value.length < 8)
          {
            callback(new Error('Password must be longer than 8 digits'))
          }
          else if (!reg.test(value)) {
            callback(new Error('Password must contain letter A-Z, a-z, numbers and special symbol'))
          }
          else {
            callback()
          }
        }

        const validateConfirmPassword = (rule, value, callback) => {
          if (value != this.passwords.newPassword) {
            callback(new Error('This confirmed password must match the previous password'))
          } else {
            callback()
          }
        }

        return {
            email: store.getters.name,
            passwordType: 'password',
            passwords: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            rules: {
                oldPassword: [
                    { required: true, message: 'This filed is required', trigger: 'change' },
                    { validator: validatePassword, trigger: 'change' }
                ],
                newPassword: [
                    { required: true, message: 'This filed is required', trigger: 'change' },
                    { validator: validatePassword, trigger: 'change' }
                ],
                confirmPassword: [
                    { required: true, message: 'This filed is required', trigger: 'change' },
                    { validator: validateConfirmPassword, trigger: 'change' }
                ]
            },
            loading: false
        };
    },
    computed: {
    },
    watch:{
    },
    methods:{
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      onNewPasswordChange() {
        this.passwords.confirmPassword = ''
      },
      onConfirmClicked() {
        this.$refs['form-required'].validate((valid) => {
          if (valid)
          {
            changePassword(this.email, this.passwords.oldPassword, this.passwords.newPassword).then(() => {
              this.$message({
                message: 'Success',
                type: 'success'
              });
              this.passwords.oldPassword = ''
              this.passwords.newPassword = ''
              this.passwords.confirmPassword = ''
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }
    },

    mounted() {

    }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>