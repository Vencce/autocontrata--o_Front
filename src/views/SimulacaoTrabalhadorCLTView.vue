<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Header from '../components/HeaderComponent.vue'

const etapa = ref(1)

const form = ref({
  cpf: '',
  nome: '',
  whatsapp: '',
  email: '',
  termos: false,
  autorizacao: false
})

const dadosOcultos = ref({
  data_nascimento: '',
  valor_renda: ''
})

const ofertasDisponiveis = ref(null)

const emit = defineEmits(['simular'])

const formatarCPF = (event) => {
  let v = event.target.value.replace(/\D/g, '')
  if (v.length <= 11) {
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    form.value.cpf = v
  }
}

const consultarFacta = async () => {
  etapa.value = 2 // Loading
  try {
    const factaResponse = await axios.get('http://localhost:8000/api/operacoes-disponiveis/', {
      params: {
        cpf: form.value.cpf.replace(/\D/g, ''),
        data_nascimento: dadosOcultos.value.data_nascimento,
        valor_renda: dadosOcultos.value.valor_renda
      }
    })

    if (factaResponse.data.erro || !factaResponse.data.tabelas || factaResponse.data.tabelas.length === 0) {
      console.warn("Facta não encontrou margem:", factaResponse.data)
      etapa.value = 3 // Sem campanhas
    } else {
      ofertasDisponiveis.value = factaResponse.data
      etapa.value = 4 // Sucesso - Pede o resto
    }
  } catch (e) {
    console.error("Erro ao conectar com a Facta:", e.response?.data || e.message)
    etapa.value = 3
  }
}

const buscarOfertas = async () => {
  const cpfLimpo = form.value.cpf.replace(/\D/g, '')
  if (cpfLimpo.length !== 11) return

  etapa.value = 2 // Loading

  try {
    const nvResponse = await axios.post('http://localhost:8000/api/consultar-nvcheck/', {
      documento: cpfLimpo
    })

    const dadosPessoais = nvResponse.data?.d?.CONSULTA?.CADASTRAIS
    
    // Se a Nova Vida NÃO achar a data de nascimento, vamos pedir para o usuário!
    if (!dadosPessoais || !dadosPessoais.NASC) {
      etapa.value = 5 // Tela de Fallback (Pede data e renda manual)
      return
    }

    form.value.nome = dadosPessoais.NOME || ''
    
    let dataNasc = dadosPessoais.NASC
    if (dataNasc.includes('-')) {
      const [ano, mes, dia] = dataNasc.split('-')
      dataNasc = `${dia}/${mes}/${ano}`
    }
    dadosOcultos.value.data_nascimento = dataNasc

    let rendaStr = dadosPessoais.RENDA || '1500'
    if (typeof rendaStr === 'string') {
      rendaStr = rendaStr.replace(/[^\d,]/g, '').replace(',', '.')
    }
    dadosOcultos.value.valor_renda = parseFloat(rendaStr) || 1500.00

    // Se achou tudo na Nova Vida, consulta a Facta direto
    await consultarFacta()

  } catch (e) {
    console.warn("Nova Vida fora do ar ou falhou. Pedindo dados manuais.", e)
    etapa.value = 5 // Fallback manual
  }
}

// Essa função roda se a pessoa teve que preencher a data/renda na mão (Etapa 5)
const submeterBuscaManual = async () => {
  if (!dadosOcultos.value.data_nascimento || !dadosOcultos.value.valor_renda) return
  
  // Converte data yyyy-mm-dd para dd/mm/aaaa do input date se precisar
  if (dadosOcultos.value.data_nascimento.includes('-')) {
      const [ano, mes, dia] = dadosOcultos.value.data_nascimento.split('-')
      dadosOcultos.value.data_nascimento = `${dia}/${mes}/${ano}`
  }

  await consultarFacta()
}

const voltarInicio = () => {
  form.value.cpf = ''
  etapa.value = 1
}

const confirmarDadosParaSimulacao = () => {
  emit('simular', { 
    dadosPessoais: { ...form.value, ...dadosOcultos.value }, 
    ofertas: ofertasDisponiveis.value 
  })
}
</script>

<template>
  <div class="simulacao-container">
    <Header />

    <main class="content">
      <div v-if="etapa === 1" class="step-card">
        <p class="instruction-text">
          Para iniciar a simulação do empréstimo do trabalhador, por favor, informe os seus dados:
        </p>

        <form @submit.prevent="buscarOfertas" class="simulacao-form">
          <div class="input-group">
            <label>CPF *</label>
            <input 
              v-model="form.cpf" 
              type="text" 
              placeholder="000.000.000-00" 
              @input="formatarCPF"
              maxlength="14"
              required
            >
          </div>

          <button type="submit" class="btn-primary mt-20">
            AVANÇAR
          </button>
        </form>
      </div>

      <div v-if="etapa === 2" class="step-card text-center flex-column">
        <div class="spinner"></div>
        <h3 class="loading-title">Aguarde...</h3>
        <p class="loading-text">
          Estamos verificando as opções disponíveis para o seu CPF
        </p>
      </div>

      <div v-if="etapa === 5" class="step-card">
        <p class="instruction-text">
          Falta pouco! Precisamos confirmar alguns dados para buscar suas ofertas:
        </p>

        <form @submit.prevent="submeterBuscaManual" class="simulacao-form">
          <div class="input-group">
            <label>Data de Nascimento *</label>
            <input v-model="dadosOcultos.data_nascimento" type="date" required>
          </div>

          <div class="input-group">
            <label>Renda Mensal (R$) *</label>
            <input v-model="dadosOcultos.valor_renda" type="number" step="0.01" placeholder="Ex: 2500.00" required>
          </div>

          <button type="submit" class="btn-primary mt-20">
            BUSCAR OFERTAS
          </button>
          <button type="button" @click="voltarInicio" class="btn-outline mt-10">
            VOLTAR
          </button>
        </form>
      </div>

      <div v-if="etapa === 3" class="step-card text-center flex-column">
        <div class="icon-error">
          <svg viewBox="0 0 24 24" width="60" height="60" fill="#9ca3af">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h3 class="error-title">Poxa, infelizmente no momento não existem campanhas ativas para o seu perfil...</h3>
        <p class="error-text">
          Que tal tentar novamente nos próximos meses?
        </p>
        <button @click="voltarInicio" class="btn-outline mt-20">
          VOLTAR
        </button>
      </div>

      <div v-if="etapa === 4" class="step-card">
        <p class="instruction-text">
          Campanhas encontradas! Preencha os dados abaixo para visualizar as ofertas:
        </p>

        <form @submit.prevent="confirmarDadosParaSimulacao" class="simulacao-form">
          <div class="input-group">
            <label>Nome Completo *</label>
            <input v-model="form.nome" type="text" required>
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

          <button type="submit" class="btn-primary mt-20">
            VER OFERTAS DISPONÍVEIS
          </button>
        </form>
      </div>
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
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.content {
  max-width: 800px;
  width: 95%;
  margin-top: 40px;
  padding-bottom: 50px;
}

.step-card {
  background: transparent;
  width: 100%;
  margin: 0 auto;
}

.instruction-text {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 30px;
  text-align: left;
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
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
}

.input-group input:focus {
  outline: none;
  border-color: #1a56db;
}

.mt-20 {
  margin-top: 20px;
}

.mt-10 {
  margin-top: 10px;
}

.btn-primary {
  background-color: #1a56db;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  text-transform: uppercase;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1e42af;
}

.btn-outline {
  background-color: transparent;
  color: #4b5563;
  border: 1px solid #9ca3af;
  padding: 16px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.text-center {
  text-align: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.spinner {
  border: 4px solid #e5e7eb;
  border-top: 4px solid #1a56db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 25px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-title {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 10px;
}

.loading-text {
  font-size: 1rem;
  color: #6b7280;
}

.icon-error {
  margin-bottom: 20px;
}

.error-title {
  font-size: 1.3rem;
  color: #1f2937;
  margin-bottom: 15px;
  max-width: 600px;
  line-height: 1.4;
}

.error-text {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 10px;
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
  gap: 12px;
  margin-top: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
}

.checkbox-item a {
  color: #ff6600;
  text-decoration: none;
}
</style>