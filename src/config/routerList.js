export default [
  {
    path: "/",
    redirect: "/TicTacToe",
  },
  {
    path: "/TicTacToe",
    name: "TicTacToe",
    component: "TicTacToe",
    meta: { title: "井字棋", icon: "mdi-grid-large" },
  },
  {
    path: "/Matching",
    name: "Matching",
    component: "Matching",
    meta: { title: "翻牌配对", icon: "mdi-account" },
  },
  {
    path: "/Gobang",
    name: "Gobang",
    component: "Gobang",
    meta: { title: "五子棋", icon: "mdi-grid" },
  },
];
