
<template>
  
</template>

<script lang="ts">

import { reactive, ref ,toRefs, onMounted } from 'vue';
//import { logIn} from '../util/fireBase';
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { QuestionCircleOutlined ,LeftOutlined, FrownTwoTone} from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';



export default {
  components: {
    QuestionCircleOutlined,
    LeftOutlined,
    FrownTwoTone,
  },
 setup() {

   const formRef = ref();
    const formState = reactive({
      email: '',
      password: '',
      isRecupera : false,
      loading : false,
      loading_login : false,
    });

    let validateEmail = async (rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('El campo Email es obligatorio');
      } else {
        return Promise.resolve();
      }
    };

    let validatePass = async (rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('El campo Password es obligatorio');
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      password: [{ validator: validatePass, trigger: 'blur' }],
      email: [
        { validator: validateEmail , trigger: 'blur' },
        { type: 'email',trigger: 'blur', message: 'correo electrónico erróneo'}
      ],

    };
    
    const handleFinishFailed = (errors: ValidateErrorEntity) => {
      console.log(errors);
    };

    const store = useStore()

    const data = reactive({
      forgotPassActive: false,
      passwordReset: false,
      signUpActive: false,
      error: false,
      error_usuario : false,
      
      //loginUrl:  "/vue-p/public/api/v2/login/index.php",
      //loginUrl: "zendesk-api-manager/public/api/v2/login/index.php",
      loginUrl : import.meta.env.VITE_APP_BASE_API ? import.meta.env.VITE_APP_BASE_API + 'login/index.php' : '/login/index.php',
      recoverUrl: import.meta.env.VITE_APP_BASE_API ? import.meta.env.VITE_APP_BASE_API  + "/public/api/v2/login/recuperar/index.php" : "/public/api/v2/login/recuperar/index.php",
      registerUrl: import.meta.env.VITE_APP_BASE_API ? import.meta.env.VITE_APP_BASE_API + "/public/api/v2/login/registro/index.php" : "/public/api/v2/login/registro/index.php",

    });
    const refData = toRefs(data);
    
    onMounted(() => {
      
    });

    const formUrl = () =>{
      if( data.forgotPassActive ){
        return data.recoverUrl;
      }

      if( data.signUpActive ){
        return data.registerUrl;
      }
      return data.loginUrl;
    }
/*
    const sendForm = () => {
      var url = formUrl();
      var dataObj = {
        email: formState.email,
        password: formState.password,
      };
      logIn(url, dataObj)
      .then(
        result => {
          console.log('result login',result);
          if(result != undefined){
            formState.loading_login = true;
          }
          else{
            data.error = true;
          }
        }
      )
      .catch(err => {console.log('Request Failed', err)});
    }

    const volverLogin = () =>{
      formState.isRecupera = false;
      data.error_usuario = false;
      formState.loading_login = false;
    }
*/
    

    return {
      ...refData,
      formState,
      formRef,
      rules,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      handleFinishFailed,
      //sendForm,

      //volverLogin,

    };
  },
}
</script>

<style scoped>


.logo {
  margin: 0 0 20px 0;
  max-height: 100px;
  max-width: min(300px, 100%);
}

</style>
