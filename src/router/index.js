import Vue from "vue";
import VueRouter from "vue-router";
import List from "@/config/routerList";

Vue.use(VueRouter);

const getRoutesArr = (Arr) => {
  const arr = [];
  for (let item of Arr) {
    const { component, children, suffix, ...obj } = item;
    obj.component = () =>
      import(
        /* webpackChunkName: "[request]" */ `../components/${component}${
          suffix ? suffix : ""
        }`
      );
    if (children) {
      obj.children = getRoutesArr(children);
    }
    arr.push(obj);
  }
  return arr;
};

const routes = getRoutesArr(List);

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
