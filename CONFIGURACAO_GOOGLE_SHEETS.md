# 📊 Configuração Google Sheets - Sistema de Controle Escolar

## 🎯 **Objetivo:**
Integrar o sistema com Google Sheets para salvar automaticamente:
- ✅ Cadastro de Alunos
- ✅ Cadastro de Professores  
- ✅ Registros de Presença

## 🔧 **Passo a Passo para Configuração:**

### **1. Criar Projeto no Google Cloud Console:**

1. Acesse: https://console.cloud.google.com/
2. Clique em "Selecionar um projeto" → "Novo projeto"
3. Nome do projeto: `sistema-controle-escolar`
4. Clique em "Criar"

### **2. Habilitar Google Sheets API:**

1. No menu lateral, vá em "APIs e serviços" → "Biblioteca"
2. Pesquise por "Google Sheets API"
3. Clique em "Google Sheets API" → "Habilitar"

### **3. Criar Credenciais de Serviço:**

1. Vá em "APIs e serviços" → "Credenciais"
2. Clique em "Criar credenciais" → "Conta de serviço"
3. Nome: `sistema-escolar-service`
4. Clique em "Criar e continuar"
5. Role: "Editor"
6. Clique em "Concluído"

### **4. Baixar Credenciais:**

1. Na lista de contas de serviço, clique no email criado
2. Vá na aba "Chaves"
3. Clique em "Adicionar chave" → "Criar nova chave"
4. Tipo: JSON
5. Clique em "Criar"
6. Salve o arquivo JSON

### **5. Criar Planilha no Google Sheets:**

1. Acesse: https://sheets.google.com/
2. Clique em "Em branco"
3. Nome: `Sistema Controle Escolar`
4. Crie 3 abas: `Alunos`, `Professores`, `Presencas`

### **6. Compartilhar Planilha:**

1. Clique em "Compartilhar" (canto superior direito)
2. Adicione o email da conta de serviço (do arquivo JSON)
3. Permissão: "Editor"
4. Clique em "Enviar"

### **7. Obter ID da Planilha:**

1. Na URL da planilha, copie o ID (entre `/d/` e `/edit`)
2. Exemplo: `https://docs.google.com/spreadsheets/d/1ABC123.../edit`
3. ID: `1ABC123...`

## 🔧 **Configuração no Código:**

### **1. Atualizar Credenciais:**

Edite o arquivo `src/services/googleSheets.js`:

```javascript
const CREDENTIALS = {
  // Cole aqui o conteúdo do arquivo JSON baixado
  "type": "service_account",
  "project_id": "seu-projeto-id",
  "private_key_id": "sua-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nSUA_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "seu-service-account@seu-projeto.iam.gserviceaccount.com",
  "client_id": "seu-client-id",
  // ... resto das credenciais
};
```

### **2. Atualizar ID da Planilha:**

```javascript
const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID_AQUI';
```

## 📋 **Estrutura das Planilhas:**

### **Aba "Alunos":**
| A | B | C | D | E |
|---|---|---|---|---|
| Data Cadastro | Nome | Turma | Email | Tipo |
| 2024-01-15 | João Silva | Turma A | joao@email.com | Aluno |

### **Aba "Professores":**
| A | B | C | D | E |
|---|---|---|---|---|
| Data Cadastro | Nome | Matéria | Email | Tipo |
| 2024-01-15 | Prof. Carlos | Matemática | carlos@email.com | Professor |

### **Aba "Presencas":**
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Data | Turma | Professor | Matéria | Presentes | Total | Detalhes |
| 2024-01-15 | Turma A | Prof. Carlos | Matemática | 8 | 10 | João:Presente; Maria:Ausente |

## 🚀 **Como Usar:**

### **1. Inicializar Planilhas:**
```javascript
import googleSheets from './services/googleSheets';

// Inicializar cabeçalhos
await googleSheets.initializeSheets();
```

### **2. Salvar Aluno:**
```javascript
const aluno = {
  name: 'João Silva',
  class: 'Turma A',
  email: 'joao@email.com'
};

const result = await googleSheets.saveStudent(aluno);
```

### **3. Salvar Professor:**
```javascript
const professor = {
  name: 'Prof. Carlos',
  subject: 'Matemática',
  email: 'carlos@email.com'
};

const result = await googleSheets.saveTeacher(professor);
```

### **4. Salvar Presença:**
```javascript
const presenca = {
  date: '2024-01-15',
  class: 'Turma A',
  teacher: 'Prof. Carlos',
  subject: 'Matemática',
  students: [
    { name: 'João', present: true },
    { name: 'Maria', present: false }
  ]
};

const result = await googleSheets.saveAttendanceRecord(presenca);
```

## ⚠️ **Importante:**

1. **Mantenha as credenciais seguras** - Não commite o arquivo JSON
2. **Teste primeiro** - Use uma planilha de teste
3. **Backup** - Faça backup da planilha
4. **Permissões** - Verifique se a conta de serviço tem acesso

## 🎉 **Resultado:**

Após a configuração, todos os dados serão salvos automaticamente no Google Sheets:
- ✅ Cadastro de alunos
- ✅ Cadastro de professores
- ✅ Registros de presença
- ✅ Histórico completo
- ✅ Fácil exportação e análise
