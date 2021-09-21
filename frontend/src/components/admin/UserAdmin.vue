<template>
  <div class="user-admin">
    <b-form>
      <input  id="user-id" type="hidden" v-model="user.id" />
      <b-row>
          <b-col md="6" sm="12">
            <b-form-group label="Nome:" label-for="user-name">
              <b-form-input id="user-name" type="text" :readonly="mode === 'remove'"
                v-model="user.name" required placeholder="Informe o Nome do Usuário...">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="E-mail:" label-for="user-email">
              <b-form-input id="user-email" type="text" :readonly="mode === 'remove'"
                v-model="user.email" required placeholder="Informe o E-mail do Usuário...">
              </b-form-input>
            </b-form-group>
          </b-col>
      </b-row>
      <b-row v-show="mode === 'save'">
          <b-col md="6" sm="12">
            <b-form-group label="Senha:" label-for="user-password">
              <b-form-input id="user-password" type="password" 
                v-model="user.password" required placeholder="Informe a Senha do Usuário...">
              </b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6" sm="12">
            <b-form-group label="Confirmação de Senha:" label-for="user-confirmPassword">
              <b-form-input id="user-confirmPassword" type="password" 
                v-model="user.confirmPassword" required placeholder="Confirmar a Senha do Usuário...">
              </b-form-input>
            </b-form-group>
          </b-col>
      </b-row>
      <b-form-checkbox class="my-buttons mt-3 mb-3" id="user-admin" v-model="user.admin">
        Administrador?
      </b-form-checkbox>
      <b-row>
        <b-col cs="12">
          <b-button variant="warning" v-if="mode === 'save'" @click="save">Salvar</b-button>
          <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
          <b-button class = "ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr>
      <b-table hover striped :items="users" :fields="fields">
        <template slot="actions" slot-scope="data">
          <b-button variant="warning" @click="loadUser(data.item)" class="mr-2">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button variant="danger" @click="loadUser(data.item, 'remove')">
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
      </b-table>
  </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'UserAdmin',
    data: function() {
      return {
        mode: 'save',
        user: {},
        users: [],
        fields: [
          { key: 'id', label: 'Código', sortable: true },
          { key: 'name', label: 'Nome', sortable: true },
          { key: 'email', label: 'E-Mail', sortable: true },
          { key: 'admin', label: 'Administrador', sortable: true, 
            formatter: value =>  value ? 'Sim' : 'Não' },
          { key: 'actions', label: 'Ações' }
        ]
      }
    },
    methods: {
      loadUsers() {
        const url = `${baseApiUrl}/users`
        axios.get(url).then(res => {
          this.users = res.data
        })
      },
      reset() {
        this.mode = 'save'
        this.user = {}
        this.loadUsers()
      },
      save() {
        const method = this.user.id ? 'put' : 'post'
        const id = this.user.id ? `/${this.user.id}` : ''
        axios[method](`${baseApiUrl}/users${id}`, this.user)
          .then(() => {
            this.$toasted.global.defaultSuccess()
            this.reset()
          })
          .catch(showError)
      },
      remove() {
        const id = this.user.id
        axios.delete(`${baseApiUrl}/users/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
        })
        .catch(showError)
      },
      loadUser(user, mode = 'save') {
        this.mode = mode
        this.user = { ...user }
      }
    },
    mounted() {
      this.loadUsers()
    }
}
</script>

<style>
    .custom-control-label:before{
      background-color: rgb(173, 173, 173);
    }
    .custom-checkbox .custom-control-input:checked~.custom-control-label::before{
      background-color: #ffc107;
    }
    .custom-checkbox .custom-control-input:checked~.custom-control-label::after{
      background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='black' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E");
    }
</style>