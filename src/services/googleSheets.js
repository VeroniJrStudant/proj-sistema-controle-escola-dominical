// Serviço para integração com Google Sheets
// Para usar este serviço, você precisa:
// 1. Criar um projeto no Google Cloud Console
// 2. Habilitar a Google Sheets API
// 3. Criar credenciais de serviço
// 4. Compartilhar a planilha com o email das credenciais

// Importação condicional para evitar erros
let google;
try {
  const googleapis = require('googleapis');
  google = googleapis.google;
} catch (error) {
  console.warn('Google APIs não disponível:', error.message);
  google = null;
}

// Configuração das credenciais (substitua pelos seus dados)
const CREDENTIALS = {
  type: "service_account",
  project_id: "seu-projeto-id",
  private_key_id: "sua-private-key-id",
  private_key: "-----BEGIN PRIVATE KEY-----\nSUA_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  client_email: "seu-service-account@seu-projeto.iam.gserviceaccount.com",
  client_id: "seu-client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/seu-service-account%40seu-projeto.iam.gserviceaccount.com"
};

// ID da planilha (substitua pelo ID da sua planilha)
const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID';

class GoogleSheetsService {
  constructor() {
    this.available = google !== null;
    if (this.available) {
      try {
        this.auth = new google.auth.GoogleAuth({
          credentials: CREDENTIALS,
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      } catch (error) {
        console.warn('Erro ao configurar Google Sheets:', error.message);
        this.available = false;
      }
    }
  }

  // Salvar aluno no Google Sheets
  async saveStudent(student) {
    if (!this.available) {
      return { success: false, message: 'Google Sheets não configurado' };
    }

    try {
      const values = [
        [
          new Date().toISOString(),
          student.name,
          student.class,
          student.email || '',
          'Aluno'
        ]
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Alunos!A:E',
        valueInputOption: 'RAW',
        resource: { values }
      });

      return { success: true, message: 'Aluno salvo no Google Sheets!' };
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      return { success: false, message: 'Erro ao salvar no Google Sheets' };
    }
  }

  // Salvar professor no Google Sheets
  async saveTeacher(teacher) {
    if (!this.available) {
      return { success: false, message: 'Google Sheets não configurado' };
    }

    try {
      const values = [
        [
          new Date().toISOString(),
          teacher.name,
          teacher.subject || '',
          teacher.email || '',
          'Professor'
        ]
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Professores!A:E',
        valueInputOption: 'RAW',
        resource: { values }
      });

      return { success: true, message: 'Professor salvo no Google Sheets!' };
    } catch (error) {
      console.error('Erro ao salvar professor:', error);
      return { success: false, message: 'Erro ao salvar no Google Sheets' };
    }
  }

  // Salvar registro de presença no Google Sheets
  async saveAttendanceRecord(record) {
    if (!this.available) {
      return { success: false, message: 'Google Sheets não configurado' };
    }

    try {
      const values = [
        [
          record.date,
          record.class,
          record.teacher,
          record.subject,
          record.students.filter(s => s.present).length,
          record.students.length,
          record.students.map(s => `${s.name}:${s.present ? 'Presente' : 'Ausente'}`).join('; ')
        ]
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Presencas!A:G',
        valueInputOption: 'RAW',
        resource: { values }
      });

      return { success: true, message: 'Registro de presença salvo no Google Sheets!' };
    } catch (error) {
      console.error('Erro ao salvar presença:', error);
      return { success: false, message: 'Erro ao salvar no Google Sheets' };
    }
  }

  // Criar cabeçalhos das planilhas
  async initializeSheets() {
    if (!this.available) {
      return { success: false, message: 'Google Sheets não configurado' };
    }

    try {
      // Cabeçalhos para Alunos
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Alunos!A1:E1',
        valueInputOption: 'RAW',
        resource: {
          values: [['Data Cadastro', 'Nome', 'Turma', 'Email', 'Tipo']]
        }
      });

      // Cabeçalhos para Professores
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Professores!A1:E1',
        valueInputOption: 'RAW',
        resource: {
          values: [['Data Cadastro', 'Nome', 'Matéria', 'Email', 'Tipo']]
        }
      });

      // Cabeçalhos para Presenças
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Presencas!A1:G1',
        valueInputOption: 'RAW',
        resource: {
          values: [['Data', 'Turma', 'Professor', 'Matéria', 'Presentes', 'Total', 'Detalhes']]
        }
      });

      return { success: true, message: 'Planilhas inicializadas!' };
    } catch (error) {
      console.error('Erro ao inicializar planilhas:', error);
      return { success: false, message: 'Erro ao inicializar planilhas' };
    }
  }
}

export default new GoogleSheetsService();
