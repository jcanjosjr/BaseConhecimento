<template>
  <div class="admin-pages">
      <PageTitle icon="fa fa-cogs" main="Administração do Sistema"
        sub="Cadastros & Cia" />
      <div class="admin-pages-tabs">
        <b-card no-body>
          <b-tabs card>
              <b-tab title="Artigos" active title-item-class="mytab">
                  <ArticleAdmin />
              </b-tab>
              <b-tab title="Categorias" title-item-class="mytab">
                <CategoryAdmin />
              </b-tab>
              <b-tab title="Usuários" title-item-class="mytab">
                <UserAdmin />
              </b-tab>
          </b-tabs>
        </b-card>
      </div>
  </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import ArticleAdmin from './ArticleAdmin'
import CategoryAdmin from './CategoryAdmin'
import UserAdmin from './UserAdmin'


export default {
    name: 'AdminPages',
    components: { PageTitle, ArticleAdmin, CategoryAdmin, UserAdmin }
}
</script>

<style>
    .mytab .nav-link {
      color: black !important;
    }

    .mytab .nav-link.active {
    background-color: #ffc107 !important;
  }
</style>