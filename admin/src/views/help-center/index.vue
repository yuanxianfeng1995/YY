<template>
    <div class="help-center">
        <router-link class="help-center-item" to="/help-1">
            <div class="icn help-center-item-l"><span>关注</span></div>
            <div class="help-center-item-r">
                <dl>
                    <dt>1.如何关注医生和公众号</dt>
                    <dd>关注医生和公众号</dd>
                </dl>
            </div>
        </router-link>
        <router-link class="help-center-item" to="/help-2">
            <div class="icn help-center-item-l"><span>问诊</span></div>
            <div class="help-center-item-r">
                <dl>
                    <dt>2.如何向医生问诊</dt>
                    <dd>患者通过微信的公众号进行问诊</dd>
                </dl>
            </div>
        </router-link>
        <router-link class="help-center-item" to="/help-3">
            <div class="icn help-center-item-l"><span>处方</span></div>
            <div class="help-center-item-r">
                <dl>
                    <dt>3.如何查看医生开的处方</dt>
                    <dd>查看医生开的处方</dd>
                </dl>
            </div>
        </router-link>
        <router-link class="help-center-item" to="/help-4">
            <div class="icn help-center-item-l"><span>药物</span></div>
            <div class="help-center-item-r">
                <dl>
                    <dt>4.如何查看药物什么时候发货</dt>
                    <dd>查看药物什么时候发货</dd>
                </dl>
            </div>
        </router-link>
        <router-link class="help-center-item" to="/help-5">
            <div class="icn help-center-item-l"><span>地址</span></div>
            <div class="help-center-item-r">
                <dl>
                    <dt>5.如何维护收货地址</dt>
                    <dd>维护收货地址</dd>
                </dl>
            </div>
        </router-link>
        <router-link class="help-center-item" to="/help-6">
            <div class="icn help-center-item-l"><span>档案</span></div>
            <div class="help-center-item-r">
                <dl>
                    <dt>6.如何维护健康档案</dt>
                    <dd>维护健康档案</dd>
                </dl>
            </div>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "help-center"
    }
</script>

<style scoped lang="scss">
.help-center{
    .help-center-item{
        display: flex;
        margin: 0 10px;
        padding: 10px 0;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e0e0e0;
        .help-center-item-l{
            display: block;
            width: 50px;
            margin-right: 10px;
            span{
                width: 50px;
                height: 50px;
                border-radius: 50%;
                line-height: 50px;
                font-size: 16px;
                display: block;
                text-align: center;
                background-color: #ff6034;
                color: #ffffff;
            }
        }
        .help-center-item-r{
            flex: 1;
            dt{
                color: #333333;
                font-size: 16px;
                margin-bottom: 5px;
            }
            dd{
                color: #666666;
                font-size: 14px;
            }
        }
    }
}
</style>