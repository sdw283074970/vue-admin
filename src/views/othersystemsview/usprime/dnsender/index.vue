<template>
  <div class="gb-maincontainer" style="text-align:right">
    <h1 style="text-align:left">DN SENDER</h1>
    <div>
      <el-form ref="form-required" :rules="rules" :model="currentOrder">
        <el-row type="flex" class="row-bg" >
          <el-col :span="2">
            <el-form-item label="CustomerCode" prop="customerCode">
              <el-select
                v-model="currentOrder.customerCode"
                filterable
                placeholder="Input key word"
                @change="onCustomerCodeSelected"
              >
                <el-option
                  v-for="item in customerCodeOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="Include Pre-released Order">
              <el-switch
                v-model="queryData.includePrereleasedOrder"
                style="display: block"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="Yes"
                inactive-text="No"
              />
            </el-form-item>
          </el-col> -->
        <!-- </el-row>
        <el-row type="flex" class="row-bg" :gutter="12"> -->
          <el-col :span="2">
            <el-form-item label="DN Date" prop="dnDate">
              <el-date-picker v-model="currentOrder.dnDate" type="date" placeholder="Select Date" style="width:170px;" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="End Date" prop="closeDate">
              <el-date-picker v-model="queryData.closeDate" type="date" placeholder="Select Date" style="width:170px;" value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col> -->
        <!-- </el-row>
        <el-row type="flex" class="row-bg" :gutter="12"> -->
          <el-col :span="2">
            <el-form-item label="By" prop="by">
              <el-input v-model="currentOrder.by" />
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="CC" prop="cc">
              <el-input v-model="currentOrder.cc" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="P2 Discount" prop="p2Discount">
              <el-input v-model="queryData.p2Discount" />
            </el-form-item>
          </el-col> -->
        <!-- </el-row>
        <el-row type="flex" class="row-bg" :gutter="12"> -->
          <!-- <el-col :span="6">
            <el-form-item label="Warehouse Location" style="text-align:right" prop="warehouseLocations">
              <el-select
                id="generic-filter-warehouseLocations-code"
                v-model="queryData.warehouseLocation"
                multiple
                collapse-tags
                filterable
                placeholder="Select whs Locs"
              >
                <el-option
                  v-for="item in warehouseLocations"
                  :key="item.warehouseCode"
                  :label="item.warehouseCode + ' - ' + item.warehouseName"
                  :value="item.warehouseCode"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </div>
    <div style="text-align:left">
        <el-button @click="uploadingVisible=true">Upload Xlsx File</el-button>
        <el-button>Send All To Customer</el-button>
    </div>
    <div style="margin-top:20px">
      <el-table
        ref="label-files-table"
        :data="orderTable"
        stripe
        border
        :show-summary="true"
        style="width:100%"
      >
        <el-table-column
          prop="hblNumber"
          label="HB/L NO"
          align="center"
          width="250"
        />
        <el-table-column
          prop="mblNumber"
          label="MB/L NO"
          align="center"
          width="250"
        />
        <el-table-column
          prop="totalCC"
          label="Total CC"
          width="140"
          align="center"
        />
        <el-table-column
          prop="truckingFee"
          label="Trucking Fee"
          width="140"
          align="center"
        />
        <el-table-column
          prop="profitShare"
          label="Profit Share"
          width="140"
          align="center"
        />
        <el-table-column
          prop="handlingFee"
          label="Handling Fee"
          width="140"
          align="center"
        />
        <el-table-column
          prop="balanceToOrigin"
          label="balance To Origin"
          width="140"
          align="center"
        />
        <el-table-column
          prop="originNote"
          label="Origin Note"
          align="center"
        />
        <el-table-column
          align="center"
          label="operation"
        >
          <template slot-scope="scope">
            <el-button type="primary" @click="onDownloadClicked(scope.row.hblNumber, scope.row.mblNumber, scope.row.truckingFee, scope.row.handlingFee, scope.row.profitShare, scope.row.balanceToOrigin, scope.row.originNote)">Download Pdf</el-button>
            <el-button type="primary" @click="onSendToCustomerClicked(scope.row.hblNumber, scope.row.mblNumber, scope.row.truckingFee, scope.row.handlingFee, scope.row.profitShare, scope.row.balanceToOrigin, scope.row.originNote)">Send to customer</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <el-dialog
        :visible.sync="uploadingVisible"
        width="800px"
        top="5vh"
        :lock-scroll="false"
      >
        <div style="text-align:center">
            <el-upload
            class="upload-demo"
            drag
            :on-success="onUploadSuccess"
            :action="uploadAction"
            :multiple="false"
            >
                <i class="el-icon-upload" />
                <div class="el-upload__text">Drag file here or <em>Click</em> to upload</div>
                <div slot="tip" class="el-upload__tip">Only accept xlsx format files which less than 1 MB</div>
                <div slot="tip" class="el-upload__tip">One file per time</div>
            </el-upload>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import config from '@/scripts/global'
import { downloadDNPdf, sendSingleDNPdf } from '@/api/usprime'
import { downloadFile } from '@/api/receiving'
import { getCustomerCodes } from '@/api/shipping'
import { generateStorageInvoiceByStorageTemplateThroughPayload } from '@/api/accounting'
// import { getCustomerStoragePriceTableByCustomerCode } from '@/api/customer'

const baseURL = config.baseURL

export default {
    // props: {
    //     customerCodeOptions: Array
    // },
    data() {
        const validateDiscount = (rule, value, callback) => {
            if (!value) {
                callback(new Error('This filed is required'))
            }
            value = Number(value)
            if (typeof value === 'number' && !isNaN(value)) {
                if (value <= 0 || value > 1) {
                callback(new Error('Discount range must be between 0 and 1'))
                } else {
                callback()
                }
            } else {
                callback(new Error('Please enter valid number'))
            }
        }
        return {
            customerCodeOptions: [],
            uploadingVisible: false,
            orderTable:[],
            currentOrder: {
                customerCode: '',
                customerName: '',
                address_1: '',
                address_2: '',
                dnDate: '',
                by: '',
                cc: '',
                hblNumber: '',
                mblNumber: '',
                truckingFee: 0.0,
                handlingFee: 0.0,
                propfitShare: 0.0,
                balanceToOrigin: 0.0,
                originNote: 0.0
            },
            queryData: {
                templateId: 0,
                customerCode: '',
                dnDate: '',
                by:''
            },
            rules: {
                customerCode: [
                    { required: true, message: 'Customer code required', trigger: 'change' }
                ],
                dnDate: [
                    { required: true, message: 'Please select dn date', trigger: 'change' }
                ],
                // closeDate: [
                //     { required: true, message: 'Please select end date', trigger: 'change' }
                // ],
                by: [
                    { required: true, message: 'This filed is required', trigger: 'change' }
                ]
            },
            loading: false
        };
    },
    computed: {
        uploadAction: function() {
            return baseURL + 'api/dnsender'
        }
    },
    watch:{
    },
    methods:{
        onDownloadClicked(h, m, tf, hf, ps, b, n) {
            this.currentOrder.hblNumber = h,
            this.currentOrder.mblNumber = m,
            this.currentOrder.truckingFee = tf,
            this.currentOrder.handlingFee = hf,
            this.currentOrder.profitShare = ps,
            this.currentOrder.balanceToOrigin = b,
            this.currentOrder.originNote = n

            this.$refs['form-required'].validate((valid) => {
                if (valid) {
                    const fullscreenLoading = this.$loading({
                        lock: false,
                        text: 'Downloading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    // this.queryData.currentBillingDate = this.queryData.closeDate
                    downloadDNPdf(this.currentOrder).then(body => {
                        fullscreenLoading.close()
                        downloadFile(body.data, "Storage Expense Report");
                    }).catch(e => {
                        fullscreenLoading.close()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        onSendToCustomerClicked(h, m, tf, hf, ps, b, n) {
            this.currentOrder.hblNumber = h,
            this.currentOrder.mblNumber = m,
            this.currentOrder.truckingFee = tf,
            this.currentOrder.handlingFee = hf,
            this.currentOrder.profitShare = ps,
            this.currentOrder.balanceToOrigin = b,
            this.currentOrder.originNote = n

            this.$refs['form-required'].validate((valid) => {
                if (valid) {
                    const fullscreenLoading = this.$loading({
                        lock: false,
                        text: 'Downloading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    // this.queryData.currentBillingDate = this.queryData.closeDate
                    sendSingleDNPdf(this.currentOrder).then(body => {
                        fullscreenLoading.close()
                        alert("Send success")
                    }).catch(e => {
                        fullscreenLoading.close()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        onUploadSuccess(res, file) {
            // alert('success!')
            // alert(JSON.stringify(response))
            // this.efiles.push({
            //   id: response.id,
            //   customizedFileName: response.customizedFileName,
            //   fileName: response.fileName,
            //   uploadDate: response.uploadDate,
            //   status: 'Valid',
            //   rootPath: '',
            //   discardBy: '',
            //   uploadBy: ''
            // })
            // alert(JSON.stringify(this.efiles))
            this.uploadingVisible = false
            this.orderTable = res
        },
        onCustomerCodeSelected() {
            // getCustomerStoragePriceTableByCustomerCode(this.queryData.customerCode).then(body => {
            //     this.storagePriceTable = body.data
            // })
        },
        transTimeUnit(num, timeUnit) {
            var unit = ''
            switch(num) {
                case 1:
                    unit = 'st'
                    break;
                case 2:
                    unit = 'nd'
                    break;
                case 3:
                    unit = 'rd'
                    break;
                default:
                    unit = 'th'
            } 
            return num + unit + ' ' + timeUnit
        },
        onUseAndDownloadClicked(id) {
            this.$refs['form-required'].validate((valid) => {
                if (valid) {
                    const fullscreenLoading = this.$loading({
                        lock: false,
                        text: 'Downloading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    this.queryData.templateId = id
                    this.queryData.lastBillingDate = this.queryData.startDate
                    // this.queryData.currentBillingDate = this.queryData.closeDate
                    generateStorageInvoiceByStorageTemplateThroughPayload(this.queryData).then(body => {
                        fullscreenLoading.close()
                        downloadFile(body.data, "Storage Expense Report");
                    }).catch(e => {
                        fullscreenLoading.close()
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
        // onDownloadInvoiceClicked() {
        //     this.$refs['form-required'].validate((valid) => {

        //         const fullscreenLoading = this.$loading({
        //             lock: false,
        //             text: 'Processing',
        //             spinner: 'el-icon-loading',
        //             background: 'rgba(0, 0, 0, 0.7)'
        //         });

        //         if (valid) {
        //           generateInvoiceByCustomerCode(this.queryData.customerCode, this.queryData.startDate, this.queryData.closeDate, this.queryData.ifShowUnclosed).then(body => {
        //             fullscreenLoading.close()
        //             downloadFile(body.data, "Expense Report");
        //           }).catch(e => {
        //             fullscreenLoading.close()
        //           })
        //         } else {
        //             fullscreenLoading.close()
        //             console.log('error submit!!');
        //             return false;
        //         }
        //     });
        // }
    },
    mounted() {
      getCustomerCodes().then(body => {
        this.customerCodeOptions = body.data
      })
    }
}
</script>

<style lang="scss" scoped>
    .input-bar{
      text-align: right
    }
</style>