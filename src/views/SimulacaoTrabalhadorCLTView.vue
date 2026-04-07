<script setup>
import { ref } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

const form = ref({
  nome: '',
  cpf: '',
  whatsapp: '',
  email: '',
  termos: false,
  autorizacao: false
})

const emit = defineEmits(['simular'])

const enviarSimulacao = () => {
  emit('simular', form.value)
}
</script>

<template>
  <div class="simulacao-container">
    <HeaderComponent />

    <main class="content">
      <p class="instruction-text">
        Para iniciar a simulação do empréstimo do trabalhador, por favor, informe os seus dados:
      </p>

      <form @submit.prevent="enviarSimulacao" class="simulacao-form">
        <div class="input-group">
          <label>Nome Completo *</label>
          <input v-model="form.nome" type="text" required>
        </div>

        <div class="input-group">
          <label>CPF *</label>
          <input v-model="form.cpf" type="text" placeholder="000.000.000-00" required>
        </div>

        <div class="input-group">
          <label>WhatsApp *</label>
          <input v-model="form.whatsapp" type="text" placeholder="(00) 00000-0000" required>
        </div>

        <div class="input-group">
          <label>E-mail *</label>
          <input v-model="form.email" type="email" required>
        </div>

        <div class="warning-container">
          <div class="warning-header">
            <span class="warning-icon">⚠️</span>
            <span class="warning-title">ATENÇÃO: leia antes de prosseguir</span>
          </div>

          <div class="warning-content">
            <p class="brand-title">A 321BANK:</p>
            <ul>
              <li>NÃO solicita devolução de valores após pagamento nem informa que é necessário devolver qualquer quantia por erro ou para liberação de valor maior.</li>
              <li>NÃO cobra valores antecipados, taxas, simulações, validação de dados ou comissões.</li>
            </ul>
          </div>

          <div class="warning-footer">
            <p>⚠️ Desconfie e nunca devolva valores para contas de terceiros.</p>
            <p>Em caso de dúvida, fale somente pelos canais oficiais na aba FALE CONOSCO em <span>321bank.com.br</span></p>
          </div>
        </div>

        <div class="checkbox-group">
          <label class="checkbox-item">
            <input type="checkbox" v-model="form.termos" required>
            <span>Aceitar os <a href="#">Termos e Condições</a></span>
          </label>
          <label class="checkbox-item">
            <input type="checkbox" v-model="form.autorizacao" required>
            <span>Aceitar os <a href="#">Termos de Autorização</a></span>
          </label>
        </div>

        <button type="submit" class="btn-submit">
          REALIZAR SIMULAÇÃO
        </button>
      </form>
    </main>
  </div>
</template>

<style scoped>
.simulacao-container {
  min-height: 100vh;
  background-color: #f0f4f7;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  max-width: 800px;
  width: 90%;
  margin-top: 40px;
  padding-bottom: 50px;
}

.instruction-text {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 30px;
}

.simulacao-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #444;
}

.input-group input {
  padding: 12px;
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 1rem;
}

.warning-container {
  border: 1px solid #ffd700;
  border-radius: 8px;
  background: #fff;
  padding: 20px;
  margin-top: 10px;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.warning-title {
  font-weight: bold;
  font-size: 0.85rem;
  color: #856404;
  text-transform: uppercase;
}

.warning-content {
  background-color: #fff5f5;
  border-radius: 8px;
  padding: 15px;
}

.brand-title {
  color: #cc0000;
  font-weight: bold;
  margin-bottom: 10px;
}

.warning-content ul {
  padding-left: 20px;
  margin: 0;
}

.warning-content li {
  font-size: 0.85rem;
  color: #333;
  margin-bottom: 8px;
}

.warning-footer {
  margin-top: 15px;
  font-size: 0.85rem;
  color: #333;
}

.warning-footer span {
  color: #0056b3;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}

.checkbox-item a {
  color: #ff6600;
  text-decoration: none;
}

.btn-submit {
  background-color: #1a56db;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  text-transform: uppercase;
}

.btn-submit:hover {
  background-color: #1e42af;
}
</style>