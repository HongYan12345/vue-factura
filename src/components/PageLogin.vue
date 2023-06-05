
<template>
    <div v-if="!formState.loading_login">
    <div class="img_login">
        <img class="logo" alt="Logo" src="../assets/factura.png" />
        <div>VueFactura</div>
    </div>
     <a-row> 
      <a-col :offset="3">
        <a-button v-if="formState.isRecupera" @click="volverLogin()">
        <template #icon><LeftOutlined /></template>
      </a-button> 
      </a-col>
      
     </a-row>
    <div v-if="error">
     <a-alert
        message="Error"
        description="Email o Password no esta bien"
        type="error"
        show-icon
        closable
      />
    </div>
    <div >
      <a-row justify="center">
      <a-col :sm="{ span:18 }" :md="{ span:15 }" :lg="{ span:12 }">
      
        <div>
          <a-form
            name="custom-validation"
            ref="formRef"
            :model="formState"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @finish="sendForm"
            @finishFailed="handleFinishFailed"
          >

            <a-form-item label="Email" name="email">
              <a-input v-model:value="formState.email" type="email" />
            </a-form-item>
            <a-form-item v-if="!formState.isRecupera" label="Password" name="password">
              <a-input v-model:value="formState.password" type="password" @clickedEnter="sendForm()"/>
            </a-form-item>

            <a-form-item v-if="formState.isRecupera" label="Password" name="password">
              <a-input v-model:value="formState.password" type="re_password" @clickedEnter="sendForm()"/>
            </a-form-item>

            <a-form-item v-if="formState.isRecupera" label="Re-Password" name="re_password">
              <a-input v-model:value="formState.re_password" type="re_password" @clickedEnter="sendForm()"/>
            </a-form-item>
    
            <a-form-item v-if="!formState.isRecupera" :wrapper-col="{ span: 25, offset: 0 }">
              <a-button type="primary" html-type="submit" > Acceder</a-button>
            </a-form-item>
          </a-form>
          <a-col :span="8">
            <a v-if="!formState.isRecupera" @click="estaRecupera()">{{$t('registro')}}</a>
          </a-col>
          <a-col :span="8">
            <a-button v-if="formState.isRecupera" :loading="formState.loading" @click="recuperar()">Recuperar</a-button>
            <a-button v-if="!formState.isRecupera" :loading="formState.loading" @click="googleSignIn()"><template #icon><GoogleOutlined /></template>Google</a-button>
            <a-button v-if="!formState.isRecupera" :loading="formState.loading" @click="loginVisitor()"><template #icon><GoogleOutlined /></template>{{$t('visitor')}}</a-button>

          </a-col>
          
        </div>
      </a-col>
      
      </a-row>
    </div>
  </div>
  <div v-else>
    <div v-if="error_usuario">
      <a-result title="Error, no hay este usuario." subTitle="Póngase en contacto con el administrador.">
          <template #icon>
            <FrownTwoTone twoToneColor="red" />
          </template>
          <template #extra>
          <a-button type="primary" @click="volverLogin()">Volve a login</a-button>
          </template>
      </a-result>
    </div>
    <div v-else>
    <a-spin />
    </div>
  </div>
  
</template>

<script lang="ts">

import { reactive, ref ,toRefs, onMounted } from 'vue';
import { loginUser, googleLogin, registraLogin} from '../util/fireBase';
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { QuestionCircleOutlined ,LeftOutlined, FrownTwoTone, GoogleOutlined} from '@ant-design/icons-vue';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import '../css/LoginStyle.css';
import { useI18n} from "vue-i18n"

export default {
  components: {
    QuestionCircleOutlined,
    LeftOutlined,
    FrownTwoTone,
    GoogleOutlined,
  },
 setup() {

   const formRef = ref();
    const formState = reactive({
      email: '',
      password: '',
      isRecupera : false,
      loading : false,
      loading_login : false,
      re_password: '',
    });

    //i18n
    const {t, locale} = useI18n()
    const setLocale = (lang: string) => {
      locale.value = lang
    };

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

    let validateRePass = async (rule: RuleObject, value: string) => {
      if (value != formState.password) {
        return Promise.reject('密码不一样');
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      password: [{ validator: validatePass, trigger: 'blur' }],
      re_password: [{ validator: validateRePass, trigger: 'blur' }],
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

    });
    const refData = toRefs(data);
    
    onMounted(() => {
      
    });

    // const formUrl = () =>{
    //   if( data.forgotPassActive ){
    //     return data.recoverUrl;
    //   }

    //   if( data.signUpActive ){
    //     return data.registerUrl;
    //   }
    //   return data.loginUrl;
    // }

    const sendForm = () => {
      loginUser(formState.email, formState.password)
      .then(
        result => {
          console.log('result login',result);
          if(result != undefined){
            formState.loading_login = true;
            formState.email = ""
            formState.password = ""
            store.commit("logIn", result)
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

    const loginVisitor = () => {
      store.commit("loginVisitor")
    }

    const googleSignIn = async () => {
      googleLogin()
    }

    const estaRecupera = () => {
      formState.isRecupera = true;
      data.error = false;
    }

    const recuperar = () => {
      registraLogin(formState.email, formState.password)
        .then(user => {
          console.log(user);
          formState.email = ""
          formState.password = ""
          formState.re_password = ""
          store.commit("logIn", user)
        }).catch(error => {
          console.error(error);
        });
    }


    return {
      ...refData,
      t,
      formState,
      formRef,
      rules,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      handleFinishFailed,
      loginVisitor,
      googleSignIn,
      sendForm,
      recuperar,
      estaRecupera,
      volverLogin,

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
