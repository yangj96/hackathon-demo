<!--suppress ALL -->
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
          <div style="display: hidden"><Modal ref="profile"/></div>
        </a-col>
    </a-layout-header>
    <a-layout-content>
      <keep-alive>
        <Network ref="network"></Network>
      </keep-alive>
    </a-layout-content>
  </a-layout>
</template>

<script type="text/javascript">
  import Network from "./components/Network";
  import Modal from './components/Modal'

  export default {
    name: 'app',
    components: { Modal, Network },
    methods: {
      showProfile(value, event) {
        console.log(value);
        this.$refs.profile.showModal(value);
      }
    }
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