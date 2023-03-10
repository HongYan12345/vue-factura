import { createI18n} from "vue-i18n";

const messages={
  es: {
    lenguage: "Lenguage",
    cliente: "Gestión de clientes",
    modifica_comp: "Modificar información de la empresa",
    modifica_person: "Modificar información del usuario",
    add_producto: "Añadir producto",
    clear: "Limpiar",
    name_empresa: "Nombre de la empresa",
    name_producto: "Nombre del producto",
    select: "Seleccionar un producto",
    save: "Guardar",
    modifica: "Modificar",
    delect: "Eliminar",
    check_delect: "¿Está seguro de que desea eliminar?",
    total: "Precio total",
    total_euro: "Precio final",
    export: "Exportar",
  },
  en: {
    lenguage: "Lenguage",
    cliente: "Customer management",
    modifica_comp: "Modify company information",
    modifica_person: "Modify user information",
    add_producto: "Add producto",
    clear: "Clear",
    name_empresa: "Company name",
    name_producto: "Product name",
    select: "Select a product",
    save: "Save",
    modifica: "Modify",
    delect: "Delete",
    check_delect: "Are you sure you want to delete?",
    total: "Total price",
    total_euro: "Final price",
    export: "Export",
  },
  zh: {
    lenguage: "语言",
    cliente: "客户管理",
    modifica_comp: "修改公司信息",
    modifica_person: "修改用户信息",
    add_producto: "添加商品",
    clear: "清除",
    name_empresa: "公司名称",
    name_producto: "产品名称",
    select: "选择一个产品",
    save: "保存",
    modifica: "修改",
    delect: "删除",
    check_delect: "确定要删除吗？",
    total: "总价格",
    total_euro: "最终价格",
    export: "导出表格",

  },
};

console.log(JSON.stringify(messages));

const i18n = createI18n({
  locale: "es",
  allowComposition:true,
  messages: messages,
});

export default i18n;