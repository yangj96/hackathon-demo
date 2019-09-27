<template>
    <div>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal
        id="profilepopup"
        title="XXX's Ability Profile"
        v-model="visible"
        @ok="handleOk"
        width="570px"
    >
        <div class="basic-info" style="display: inline-block;
            position: relative;
            bottom: 30px;">
            <div style="position: relative;
                right: -10px;
                bottom: 50px;">
                <img id="profile-picture" src="../assets/profilepicture.png" style="display: inline-block;">
                <div style="display: inline-block;
                position: relative;
                right: -25px;
                bottom: -25px;">
                <a-icon type="star" theme="twoTone"/>  <strong>3</strong></div>
            </div>
            
            <p><a-icon type="trophy" />  Published <strong>3</strong> repos</p>
            <p><a-icon type="fork" />  Forked by <strong>3</strong> times</p>
            <p><a-icon type="solution" />  <strong>15</strong> Pull requests</p>
            <p><a-icon type="tool" />  Solved <strong>20%</strong> issues</p>
        </div>
        <div class="chart-plugin" style="display: inline-block; position: relative; right: -40px"><Chart/></div>
    </a-modal>
    </div>
</template>

<script>
import Chart from './Chart'

export default {
  data() {
    return {
      visible: false,
    }
  },
  components: {Chart},
  methods:{
    showModal() {
      this.visible = true
    },
    handleOk() {
      this.visible = false
    }
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