<template>
  <div class="category-admin">
    <b-form>
      <input  id="category-id" type="hidden" v-model="category.id" />
      <b-row>
          <b-col xs="12">
            <b-form-group label="Nome:" label-for="category-name">
              <b-form-input id="category-name" type="text" :readonly="mode === 'remove'"
                v-model="category.name" required placeholder="Informe o Nome da Categoria...">
              </b-form-input>
            </b-form-group>
          </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <b-button variant="warning" v-if="mode === 'save'" @click="save">Salvar</b-button>
          <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
          <b-button class = "ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr>
      <b-table hover striped :items="categories" :fields="fields">
        <template slot="actions" slot-scope="data">
          <b-button variant="warning" @click="loadCategory(data.item)" class="mr-2">
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button variant="danger" @click="loadCategory(data.item, 'remove')">
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
    name: 'CategoryAdmin',
    data: function() {
      return {
        mode: 'save',
        category: {},
        categories: [],
        fields: [
          { key: 'id', label: 'Código', sortable: true },
          { key: 'name', label: 'Nome', sortable: true },
          { key: 'path', label: 'Caminho', sortable: true },
          { key: 'actions', label: 'Ações' }
        ]
      }
    },
    methods: {
      loadCategories() {
        const url = `${baseApiUrl}/categories`
        axios.get(url).then(res => {
          this.categories = res.data.map(category => {
            return { ...category, value: category.id, text: category.path }
          })
        })
      },
      reset() {
        this.mode = 'save'
        this.category = {}
        this.loadCategories()
      },
      save() {
        const method = this.category.id ? 'put' : 'post'
        const id = this.category.id ? `/${this.category.id}` : ''
        axios[method](`${baseApiUrl}/categories${id}`, this.category)
          .then(() => {
            this.$toasted.global.defaultSuccess()
            this.reset()
          })
          .catch(showError)
      },
      remove() {
        const id = this.category.id
        axios.delete(`${baseApiUrl}/categories/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
        })
        .catch(showError)
      },
      loadCategory(category, mode = 'save') {
        this.mode = mode
        this.category = { ...category }
      }
    },
    mounted() {
      this.loadCategories()
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