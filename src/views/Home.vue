<template>
  <v-card
    class="mx-auto overflow-hidden"
    width="100%"
    height="100%"
    :style="{ backgroundColor: $route.path === '/Gobang' ? '#eee' : null }"
  >
    <v-app-bar color="deep-purple accent-4" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Vuetify 小游戏
          </v-list-item-title>
          <v-list-item-subtitle>
            Vuetify Small Games
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group
          v-model="currentSelect"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item
            v-for="item in drawerItemData"
            :key="item.name"
            :to="item.path"
          >
            <v-list-item-icon>
              <v-icon v-text="item.meta.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.meta.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-container class="d-flex fill-height justify-center align-start bg">
      <router-view></router-view>
    </v-container>
  </v-card>
</template>

<script>
import List from "@/config/routerList";

export default {
  name: "Home",
  data: () => ({
    drawer: false,
  }),
  computed: {
    drawerItemData() {
      return List.filter((item) => {
        return Object.keys(item).includes("component");
      });
    },
    currentSelect: {
      get() {
        return this.drawerItemData.findIndex((item, index) => {
          return item.link === this.$route.path;
        });
      },
      set:()=>{}
    },
    pageTitle() {
      return this.$route.meta.title;
    },
  },
};
</script>
