<script setup>
import { ref } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue';

const exibirAviso = ref(true)
</script>

<template>
  <div class="home-container">
    <HeaderComponent />

    <div v-if="exibirAviso" class="modal-overlay">
      <div class="modal-content">
        <button class="close-button" @click="exibirAviso = false">×</button>
        
        <div class="modal-header">
          <div class="warning-icon">!</div>
          <h2>ATENÇÃO: leia antes de prosseguir</h2>
        </div>

        <div class="warning-box">
          <p class="warning-title">A 321BANK:</p>
          <ul>
            <li>NÃO solicita devolução de valores após pagamento nem informa que é necessário devolver qualquer quantia por erro ou para liberação de valor maior.</li>
            <li>NÃO cobra valores antecipados, taxas, simulações, validação de dados ou comissões.</li>
          </ul>
        </div>

        <div class="alert-footer">
          <p>⚠️ Desconfie e nunca devolva valores para contas de terceiros.</p>
          <p>Em caso de dúvida, fale somente pelos canais oficiais na aba FALE CONOSCO em <span>321bank.com.br</span></p>
        </div>
      </div>
    </div>

    <main class="selection-screen">
      <div class="welcome-text">
        <p>Olá, seja muito bem vindo(a) a nossa plataforma de auto contratação.</p>
        <p>Por favor, escolha o produto que deseja contratar:</p>
      </div>

      <div class="button-group">
        <router-link to="/fgts" class="menu-button">
          FGTS
        </router-link>
        
        <router-link to="/simulacao-clt" class="menu-button">
          EMPRÉSTIMO DO TRABALHADOR
        </router-link>
        
        <router-link to="/refin" class="menu-button">
          REFINANCIAMENTO EMPRÉSTIMO DO TRABALHADOR
        </router-link>
        
        <router-link to="/inss" class="menu-button">
          INSS
        </router-link>
        
        <router-link to="/consulta" class="menu-button outline">
          CONSULTAR ANDAMENTO DA PROPOSTA
        </router-link>
      </div>
    </main>

    <div class="home-footer-icon">
      <div class="blue-circle">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f0f4f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.selection-screen {
  max-width: 900px;
  width: 95%;
  text-align: center;
  margin-top: 60px;
  padding-bottom: 100px;
}

.welcome-text {
  font-size: 1.5rem;
  color: #445;
  margin-bottom: 50px;
  line-height: 1.6;
  font-weight: 400;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.menu-button {
  display: block;
  text-decoration: none;
  width: 100%;
  padding: 22px;
  background: white;
  border: 1px solid #bdc3c7;
  border-radius: 12px;
  font-size: 1.2rem;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  text-align: center;
  box-sizing: border-box;
}

.menu-button:hover {
  background: #fdfdfd;
  border-color: #34495e;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.menu-button.outline {
  margin-top: 10px;
  border-width: 1.5px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  width: 95%;
  max-width: 900px;
  padding: 50px;
  border-radius: 16px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.close-button {
  position: absolute;
  right: 25px;
  top: 20px;
  font-size: 32px;
  background: #f0f2f5;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  cursor: pointer;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #cc0000;
  margin-bottom: 35px;
}

.warning-icon {
  background: #cc0000;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 30px;
}

.modal-header h2 {
  font-size: 2rem;
  margin: 0;
}

.warning-box {
  background: #fffafa;
  border: 1px solid #ffe5e5;
  border-radius: 12px;
  padding: 30px;
  text-align: left;
}

.warning-title {
  color: #8b0000;
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.warning-box ul {
  padding-left: 25px;
}

.warning-box li {
  margin-bottom: 15px;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.5;
}

.alert-footer {
  margin-top: 35px;
  font-size: 1.1rem;
  color: #444;
  line-height: 1.6;
}

.alert-footer span {
  color: #0056b3;
  font-weight: bold;
}

.home-footer-icon {
  position: fixed;
  bottom: 30px;
  right: 30px;
}

.blue-circle {
  background: #2563eb;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
  cursor: pointer;
}
</style>