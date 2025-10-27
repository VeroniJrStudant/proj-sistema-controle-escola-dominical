# Sistema de Controle de Presença - Escola Dominical

Um sistema completo para gerenciar presenças, alunos e professores da escola dominical, desenvolvido com React e Tailwind CSS.

## 🚀 Funcionalidades

### 📝 Registro de Presença
- Seleção de turma, professor e matéria
- Lista interativa de alunos com controle de presença
- Registro de data da aula
- Interface intuitiva com indicadores visuais

### 👥 Gestão de Alunos
- Cadastro completo de alunos (nome, turma, email)
- Edição e exclusão de alunos
- Busca por nome ou turma
- Validação de campos obrigatórios

### 👨‍🏫 Gestão de Professores
- Cadastro de professores (nome, matéria, email)
- Edição e exclusão de professores
- Busca por nome ou matéria
- Interface dedicada para professores

### 📊 Consulta e Relatórios
- Visualização de todos os registros de presença
- Filtros por data e turma
- Exportação para CSV
- Estatísticas de presença por aula
- Detalhamento de alunos presentes/ausentes

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **Vite** - Build tool e servidor de desenvolvimento
- **Material UI (MUI)** - Framework de componentes React
- **Material Icons** - Ícones do Material Design
- **JavaScript ES6+** - Linguagem de programação

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd proj-sistema-controle-escola-dominical
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

4. Acesse no navegador: `http://localhost:5173`

## 🎯 Como Usar

### 1. Cadastrar Alunos
- Acesse a aba "Alunos"
- Preencha nome, turma e email
- Clique em "Cadastrar"

### 2. Cadastrar Professores
- Acesse a aba "Professores"
- Preencha nome, matéria e email
- Clique em "Cadastrar"

### 3. Registrar Presença
- Acesse a aba "Registrar Presença"
- Selecione a data, turma, professor e matéria
- Marque os alunos presentes clicando em seus nomes
- Clique em "Registrar Presença"

### 4. Consultar Registros
- Acesse a aba "Consultar Registros"
- Use os filtros para encontrar registros específicos
- Exporte os dados em CSV se necessário

## 🎨 Interface

O sistema possui uma interface moderna e responsiva com Material UI:
- Design seguindo Material Design do Google
- Componentes pré-estilizados e consistentes
- Navegação por abas intuitiva
- Feedback visual com Snackbars e Alertas
- Responsividade nativa para diferentes tamanhos de tela
- Tema personalizado com cores profissionais

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- Desktop
- Tablet
- Smartphone

## 🔧 Estrutura do Projeto

```
src/
├── AttendanceSystem.jsx  # Componente principal
├── App.jsx              # Componente raiz com ThemeProvider
├── theme.js             # Configuração do tema Material UI
├── index.css            # Estilos globais
└── main.jsx             # Ponto de entrada
```

## 🚀 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção

## 📄 Licença

Este projeto é de uso livre para fins educacionais e religiosos.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Adicionar novas funcionalidades
- Melhorar a documentação

---

**Desenvolvido com ❤️ para a Escola Dominical**