import { createI18n} from "vue-i18n";

const messages={
  es: {
    lenguage: "Lenguage",
    factura:"Factura",
    clien:"Cliente",
    cliente: "Gestión de clientes",
    next:"Siguente",
    back:"Volver",
    cantidad:"cantidad",
    precio:"precio",
    codigo:"codigo",
    crear:"Crear",
    crear_cliente: "Añadir nuevo cliente",
    name:"nombre",
    direccion:"direccion",
    cp:"CP",
    nif:"NIF",
    telefono:"telefono",
    poblation:"poblation",
    modifica_comp: "Modificar información de la empresa",
    modifica_person: "Modificar información del usuario",
    modifica_articulo: "Modificar articulo",
    modifica_cliente: "Modificar cliente",
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
    registro: "Registro", 
    logout:"Salir",
    visitor:"Visitor",
    upload:"Subir dato",
    repassword:"olvida la contraseña",
    uplocal:"Subir datos a local",
  },
  en: {
    lenguage: "Lenguage",
    factura:"Facture",
    clien:"Client",
    next:"Next",
    back:"Back",
    cantidad:"amount",
    precio:"price",
    codigo:"code",
    crear:"Create",
    cliente: "Customer management",
    name:"name",
    direccion:"direction",
    cp:"CP",
    nif:"NIF",
    telefono:"telephone",
    poblation:"population",
    crear_cliente: "Add new client",
    modifica_comp: "Modify company information",
    modifica_person: "Modify user information",
    modifica_articulo: "Modify articulo",
    modifica_cliente: "Modify client",
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
    registro: "Register", 
    logout:"Exit",
    visitor:"Visitor",
    upload:"Upload dato",
    repassword:"forget the password",
    uplocal:"Upload data to local",
  },
  zh: {
    lenguage: "语言",
    factura:"发票",
    clien:"客户",
    next:"下一步",
    back:"返回",
    cantidad:"数量",
    precio:"价格",
    codigo:"型号",
    crear:"创建",
    cliente: "客户管理",
    name:"名字",
    direccion:"地址",
    cp:"CP",
    nif:"NIF",
    telefono:"电话",
    poblation:"区分",
    crear_cliente: "添加新客户",
    modifica_comp: "修改公司信息",
    modifica_person: "修改用户信息",
    modifica_articulo: "修改产品信息",
    modifica_cliente: "修改客户信息",
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
    registro: "注册", 
    logout:"退出",
    visitor:"游客登录",
    upload:"上传数据",
    repassword:"忘记密码",
    uplocal:"上传数据到本地",
  },
};

//console.log(JSON.stringify(messages));

const i18n = createI18n({
  locale: "zh",
  allowComposition:true,
  messages: messages,
});

export default i18n;