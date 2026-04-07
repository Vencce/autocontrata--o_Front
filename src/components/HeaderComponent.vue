<template>
  <header class="main-header">
    <div class="header-content">
      <img 
        src="https://autocontratacao.321bank.com.br/assets/images/logo.png" 
        alt="321Bank" 
        class="logo"
        @click="voltarHome"
      >
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    voltarHome() {
      this.$emit('ir-home');
    }
  }
}
</script>

<style scoped>
.main-header {
  width: 100%;
  background: white;
  padding: 25px 0;
  display: flex;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.logo {
  height: 55px;
  cursor: pointer;
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.02);
}

@media (max-width: 600px) {
  .main-header {
    padding: 15px 0;
  }
  .logo {
    height: 40px;
  }
}
</style>