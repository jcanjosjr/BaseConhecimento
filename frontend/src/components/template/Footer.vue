<template>
  <footer class="footer">
      <span>Copyright <strong>JoséC Anjos </strong>©  2021</span>
  </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style>
    .footer {
        grid-area: footer;
        background: linear-gradient(to left, #fffc00, #ffffff); 
        color: #333;

        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
    }
</style>