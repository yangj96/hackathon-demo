<template>
  <a-layout id="components-layout-demo-top" class="layout">

    <a-layout-header>
      <a-row>
        <a-col :span="8">
          <a-menu
                  theme="dark"
                  mode="horizontal"
                  :defaultSelectedKeys="['2']"
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
                  @search="onSearch"
          />
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
      </div>
      <div style="width: 400px"><Modal/></div>

    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<script>
import Modal from './components/Modal'

export default {
  name: 'app',
  components: { Modal },
  methods:{
    onSearch (search, loading) {
      loading(true);
      if (search.length > 100 ){
        loading(false)
      }    
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