import {createRouter, createWebHistory} from "vue-router"

const pdf = () => import("../components/PagePdf.vue")
const main = () => import("../components/PageMain.vue")
const client = () => import("../components/PageClient.vue")
const table = () => import("../components/PageTable.vue")
const company = () => import("../components/PageCompany.vue")
const history = () => import("../components/PageHistory.vue")

const routes = [
    
    {
        path : "/pdf",
        name : "pdf",
        component : pdf
    },

    {
        path : "/main",
        name : "main",
        component : main
    },

    {
        path : "/client",
        name : "client",
        component : client
    },

    {
        path : "/table",
        name : "table",
        component : table
    },

    {
        path : "/company",
        name : "company",
        component : company
    },

    {
        path : "/history",
        name : "history",
        component : history
    },

]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;