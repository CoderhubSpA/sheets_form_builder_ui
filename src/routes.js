import FormBuilder from "./components/FormBuilder.vue"
import Setup from "./components/Setup.vue"

const routes = [
  { path: '/', component: Setup, name: "setup" },
  { path: '/entity/:id/create', component: FormBuilder, name: "create", props: { mode: "create" } },
  { path: '/form/:id/edit', component: FormBuilder, name: "edit", props: { mode: "edit" } }
];

export default routes;
