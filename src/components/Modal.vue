<template>
    <div>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal
        id="profilepopup"
        :title="displayTitle"
        v-model="visible"
        @ok="handleOk"
        width="45%"
    >
        <div class="basic-info" style="display: inline-block;
            position: relative;
            bottom: 30px;">
            <div style="position: relative;
                right: -10px;
                bottom: 50px;">
                <img id="profile-picture" :src="backendData.avatar_url" style="display: inline-block;">
                <div style="display: inline-block;
                position: relative;
                right: -25px;
                bottom: -25px;">
                <a-icon type="star" theme="twoTone"/>  <strong>{{backendData.stars}}</strong></div>
            </div>
            
            <p><a-icon type="trophy" />  Published <strong>{{backendData.repos}}</strong> repos <strong>(Top {{backendData.repos_perc}}%)</strong></p>
            <p><a-icon type="fork" />  Forked by <strong>{{backendData.forks}}</strong> times <strong>(Top {{backendData.forks_perc}}%)</strong></p>
            <p><a-icon type="solution" />  <strong>{{backendData.pr}}</strong> Pull requests <strong>(Top {{backendData.pr_perc}}%)</strong></p>
            <p><a-icon type="tool" />  Solved <strong>{{backendData.solved_iss_prec}}%</strong> issues </p>
        </div>
        <div class="chart-plugin" style="display: inline-block; position: relative; right: -25px"><Chart :radarData="chartData" /></div>
    </a-modal>
    </div>
</template>

<script>
import Chart from './Chart'

export default {
  data() {
    return {
      visible: false,
      backendData:{},
      displayTitle: null,
      chartData: {
        BigData:{
          R: 90,
          U: 70,
          P: 40
        },
        Backend:{
          R: 20,
          U: 30,
          P: 50
        },
        Android:{
          R: 30,
          U: 60,
          P: 40
        }
      }
    }
  },
  components: {Chart},
  methods:{
    showModal(id) {
      this.fetchProfileData(id);
      this.visible = true
      console.log(this.chartData)
    },
    handleOk() {
      this.visible = false;
    },
    fetchProfileData(id) {
      console.log(this.$getProfielUrl + id);
      this.backendData = {}
      this.$http
        .get(this.$getProfielUrl + id, {
          headers: { Accept: "application/json" }
        })
        .then(
          function(response) {
            this.backendData = response.data;
            this.displayTitle = this.backendData.name+"'s Ability Profile";
            if (this.backendData.backend_reputation+this.backendData.backend_usability+this.backendData.backend_proactivity >0){
              this.chartData.Backend={
                R:this.backendData.backend_reputation,
                U:this.backendData.backend_usability,
                P:this.backendData.backend_proactivity
              };
              console.log(this.chartData);
            }
            if (this.backendData.android_reputation+this.backendData.android_usability+this.backendData.android_proactivity >0){
              this.chartData.Android={
                R:this.backendData.android_reputation,
                U:this.backendData.android_usability,
                P:this.backendData.android_proactivity
              };
              console.log(this.chartData.Android);
            }
            if (this.backendData.bigdata_reputation+this.backendData.bigdata_usability+this.backendData.bigdata_proactivity >0){
              this.chartData.BigData={
                R:this.backendData.bigdata_reputation,
                U:this.backendData.bigdata_usability,
                P:this.backendData.bigdata_proactivity
              };
              console.log(this.chartData.BigData);
            }
          },
          function(error) {
            console.log(error);
          }
        );
    },
  }
}
</script>

<style>
.ant-modal-body {
    height: auto;
}

.chart-plugin .basic-info{
    display: inline-block;
}

svg {
    margin: 0 3px;
}

img {
    width: 80px;
    height: 80px;
}
</style>