import {createRouter, createWebHistory} from "vue-router"

const pdf = () => import("../components/PagePdf.vue")
const main = () => import("../components/MainPage.vue")
const client = () => import("../components/PageClient.vue")

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
    }

]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;