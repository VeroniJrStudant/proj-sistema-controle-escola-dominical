# 📊 Instruções Google Sheets - juniorvjvjr@gmail.com

## 🎯 **Configuração Específica para seu Email:**

### **1. Criar Projeto no Google Cloud Console:**

1. Acesse: https://console.cloud.google.com/
2. Clique em "Selecionar um projeto" → "Novo projeto"
3. Nome do projeto: `sistema-controle-escolar-junior`
4. Clique em "Criar"

### **2. Habilitar Google Sheets API:**

1. No menu lateral, vá em "APIs e serviços" → "Biblioteca"
2. Pesquise por "Google Sheets API"
3. Clique em "Google Sheets API" → "Habilitar"

### **3. Criar Credenciais de Serviço:**

1. Vá em "APIs e serviços" → "Credenciais"
2. Clique em "Criar credenciais" → "Conta de serviço"
3. Nome: `sistema-escolar-service-junior`
4. Clique em "Criar e continuar"
5. Role: "Editor"
6. Clique em "Concluído"

### **4. Baixar Credenciais:**

1. Na lista de contas de serviço, clique no email criado
2. Vá na aba "Chaves"
3. Clique em "Adicionar chave" → "Criar nova chave"
4. Tipo: JSON
5. Clique em "Criar"
6. Salve o arquivo JSON como `credentials.json`

### **5. Criar Planilha no Google Sheets:**

1. Acesse: https://sheets.google.com/
2. Clique em "Em branco"
3. Nome: `Sistema Controle Escolar - Junior`
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

Edite o arquivo `src/services/googleSheets.js` e substitua:

```javascript
const CREDENTIALS = {
  // Cole aqui o conteúdo do arquivo credentials.json
  "type": "service_account",
  "project_id": "sistema-controle-escolar-junior",
  "private_key_id": "sua-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nSUA_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "sistema-escolar-service-junior@sistema-controle-escolar-junior.iam.gserviceaccount.com",
  "client_id": "seu-client-id",
  // ... resto das credenciais do arquivo JSON
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
1. Acesse a aba "Turmas"
2. Clique em "Inicializar Google Sheets"
3. Aguarde a confirmação

### **2. Cadastrar Aluno:**
1. Vá na aba "Alunos"
2. Clique em "Novo Aluno"
3. Preencha os dados
4. Clique em "Cadastrar"
5. Os dados serão salvos automaticamente no Google Sheets

### **3. Cadastrar Professor:**
1. Vá na aba "Professores"
2. Clique em "Novo Professor"
3. Preencha os dados
4. Clique em "Cadastrar"
5. Os dados serão salvos automaticamente no Google Sheets

### **4. Registrar Presença:**
1. Vá na aba "Presença"
2. Preencha os dados da aula
3. Marque as presenças
4. Clique em "Registrar Presença"
5. Os dados serão salvos automaticamente no Google Sheets

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

## 📞 **Suporte:**

Se tiver problemas:
1. Verifique se as credenciais estão corretas
2. Verifique se a planilha foi compartilhada
3. Verifique se o ID da planilha está correto
4. Verifique o console do navegador para erros
