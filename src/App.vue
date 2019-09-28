<template>
  <a-layout id="components-layout-demo-top" class="layout">

    <a-layout-header>
        <a-col :span="8">
          <a-menu
                  theme="dark"
                  mode="horizontal"
                  :defaultSelectedKeys="['1']"
                  :style="{ lineHeight: '64px' }"
          >
            <a-menu-item key="1">Trending Network</a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="8"></a-col>
        <a-col :span="8">
          <a-input-search
                  placeholder="Github Account"
                  style="width: 200px"
                  @search="showProfile"></a-input-search>
        </a-col>
        <a-col :span="8">
          <div style="display: hidden"><Modal id="test" ref="profile"/></div>
        </a-col>
    </a-layout-header>
    <a-layout-content>
      <keep-alive>
        <Network></Network>
      </keep-alive>
    </a-layout-content>
  </a-layout>
</template>

<script type="text/javascript">
  /* eslint-disable no-console
  import * as d3 from "d3"*/
  import Network from "./components/Network";
  import Modal from './components/Modal'

  export default {
    name: 'app',
    components: { Modal, Network },
    methods: {
      showProfile() {
        console.log("here");
        this.$refs.profile.showModal();
      }
    }
    /*
    components: {TrendNetwork},
    data() {
      return {
        loadData: {}
      };
    },
    mounted() {
      console.log("App loaded");
      this.fetchData();
    },
    methods: {
      async fetchData() {
        let data = await d3.json("./graph.json");
        this.loadData = data;
      }
    }*/
  }
</script>

<style>
  #components-layout-demo-top .logo {
    width: 120px;
    height: 31px;
    background: rgba(255,255,255,.2);
    margin: 16px 24px 16px 0;
    float: left;
  }
</style>