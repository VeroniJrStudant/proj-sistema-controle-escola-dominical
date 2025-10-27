import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Fab,
  Tooltip,
  Divider,
  Avatar,
  CardHeader,
  CardActions,
  LinearProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import googleSheets from "./services/googleSheets";
import {
  School,
  People,
  PersonAdd,
  Search,
  Download,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Add,
  Save,
  Close,
  Person,
  Group,
  CalendarToday,
  Subject,
  Class,
} from "@mui/icons-material";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AttendanceSystem = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states - Cadastro de Turma
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [classDialogOpen, setClassDialogOpen] = useState(false);

  // Form states - Registro de Presença
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [classDate, setClassDate] = useState(() => 
    new Date().toISOString().split("T")[0]
  );
  const [classSubject, setClassSubject] = useState("");
  const [studentAttendance, setStudentAttendance] = useState({});

  // Ref for class subject input
  const classSubjectRef = useRef(null);

  // Callback para mudança de data
  const handleDateChange = useCallback((e) => {
    setClassDate(e.target.value);
  }, []);


  // Form states - Cadastro de Aluno
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);

  // Form states - Cadastro de Professor
  const [teacherName, setTeacherName] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);

  // Search states
  const [searchDate, setSearchDate] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [searchStudentName, setSearchStudentName] = useState("");
  const [searchTeacherName, setSearchTeacherName] = useState("");
  const [searchClassName, setSearchClassName] = useState("");

  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Google Sheets initialization
  const [sheetsInitialized, setSheetsInitialized] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const mockStudents = [
      { id: 1, name: "João Silva", class: "Turma A", email: "joao@email.com" },
      {
        id: 2,
        name: "Maria Santos",
        class: "Turma A",
        email: "maria@email.com",
      },
      {
        id: 3,
        name: "Pedro Oliveira",
        class: "Turma B",
        email: "pedro@email.com",
      },
      { id: 4, name: "Ana Costa", class: "Turma B", email: "ana@email.com" },
      {
        id: 5,
        name: "Lucas Ferreira",
        class: "Turma A",
        email: "lucas@email.com",
      },
    ];

    const mockTeachers = [
      {
        id: 1,
        name: "Prof. Carlos Mendes",
        subject: "Matemática",
        email: "carlos@email.com",
      },
      {
        id: 2,
        name: "Profa. Juliana Rocha",
        subject: "Português",
        email: "juliana@email.com",
      },
      {
        id: 3,
        name: "Prof. Roberto Lima",
        subject: "História",
        email: "roberto@email.com",
      },
    ];

    const mockClasses = [
      { id: 1, name: "Turma A", description: "Crianças de 6-8 anos" },
      { id: 2, name: "Turma B", description: "Crianças de 9-11 anos" },
      { id: 3, name: "Turma C", description: "Adolescentes de 12-15 anos" },
    ];

    setStudents(mockStudents);
    setTeachers(mockTeachers);
    setClasses(mockClasses);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const initializeGoogleSheets = async () => {
    try {
      const result = await googleSheets.initializeSheets();
      if (result.success) {
        setSheetsInitialized(true);
        showSnackbar("Google Sheets inicializado com sucesso!");
      } else {
        showSnackbar(
          "Erro ao inicializar Google Sheets. Verifique as configurações.",
          "error",
        );
      }
    } catch (error) {
      console.error("Erro ao inicializar Google Sheets:", error);
      showSnackbar(
        "Erro ao inicializar Google Sheets. Verifique as configurações.",
        "error",
      );
    }
  };

  const handleAddStudent = async () => {
    if (!studentName || !studentClass) {
      showSnackbar("Por favor, preencha nome e turma!", "error");
      return;
    }

    if (editingStudent) {
      setStudents(
        students.map((s) =>
          s.id === editingStudent.id
            ? {
                ...s,
                name: studentName,
                class: studentClass,
                email: studentEmail,
              }
            : s,
        ),
      );
      setEditingStudent(null);
      showSnackbar("Aluno atualizado com sucesso!");
    } else {
      const newStudent = {
        id: Date.now(),
        name: studentName,
        class: studentClass,
        email: studentEmail,
      };
      setStudents([...students, newStudent]);

      // Salvar no Google Sheets
      try {
        const result = await googleSheets.saveStudent(newStudent);
        if (result.success) {
          showSnackbar("Aluno cadastrado e salvo no Google Sheets!");
        } else {
          showSnackbar(
            "Aluno cadastrado localmente. Erro ao salvar no Google Sheets.",
            "warning",
          );
        }
      } catch (error) {
        console.error("Erro ao salvar no Google Sheets:", error);
        showSnackbar(
          "Aluno cadastrado localmente. Erro ao salvar no Google Sheets.",
          "warning",
        );
      }
    }

    setStudentName("");
    setStudentClass("");
    setStudentEmail("");
    setStudentDialogOpen(false);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentName(student.name);
    setStudentClass(student.class);
    setStudentEmail(student.email);
    setStudentDialogOpen(true);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      setStudents(students.filter((s) => s.id !== id));
      showSnackbar("Aluno excluído com sucesso!");
    }
  };

  const handleAddTeacher = async () => {
    if (!teacherName) {
      showSnackbar("Por favor, preencha o nome do professor!", "error");
      return;
    }

    if (editingTeacher) {
      setTeachers(
        teachers.map((t) =>
          t.id === editingTeacher.id
            ? {
                ...t,
                name: teacherName,
                subject: teacherSubject,
                email: teacherEmail,
              }
            : t,
        ),
      );
      setEditingTeacher(null);
      showSnackbar("Professor atualizado com sucesso!");
    } else {
      const newTeacher = {
        id: Date.now(),
        name: teacherName,
        subject: teacherSubject,
        email: teacherEmail,
      };
      setTeachers([...teachers, newTeacher]);

      // Salvar no Google Sheets
      try {
        const result = await googleSheets.saveTeacher(newTeacher);
        if (result.success) {
          showSnackbar("Professor cadastrado e salvo no Google Sheets!");
        } else {
          showSnackbar(
            "Professor cadastrado localmente. Erro ao salvar no Google Sheets.",
            "warning",
          );
        }
      } catch (error) {
        console.error("Erro ao salvar no Google Sheets:", error);
        showSnackbar(
          "Professor cadastrado localmente. Erro ao salvar no Google Sheets.",
          "warning",
        );
      }
    }

    setTeacherName("");
    setTeacherSubject("");
    setTeacherEmail("");
    setTeacherDialogOpen(false);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherName(teacher.name);
    setTeacherSubject(teacher.subject);
    setTeacherEmail(teacher.email);
    setTeacherDialogOpen(true);
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este professor?")) {
      setTeachers(teachers.filter((t) => t.id !== id));
      showSnackbar("Professor excluído com sucesso!");
    }
  };

  const handleAddClass = () => {
    if (!className) {
      showSnackbar("Por favor, preencha o nome da turma!", "error");
      return;
    }

    if (editingClass) {
      setClasses(
        classes.map((c) =>
          c.id === editingClass.id
            ? { ...c, name: className, description: classDescription }
            : c,
        ),
      );
      setEditingClass(null);
      showSnackbar("Turma atualizada com sucesso!");
    } else {
      const newClass = {
        id: Date.now(),
        name: className,
        description: classDescription,
      };
      setClasses([...classes, newClass]);
      showSnackbar("Turma cadastrada com sucesso!");
    }

    setClassName("");
    setClassDescription("");
    setClassDialogOpen(false);
  };

  const handleEditClass = (classItem) => {
    setEditingClass(classItem);
    setClassName(classItem.name);
    setClassDescription(classItem.description);
    setClassDialogOpen(true);
  };

  const handleDeleteClass = (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta turma? Todos os alunos desta turma serão removidos.",
      )
    ) {
      setClasses(classes.filter((c) => c.id !== id));
      setStudents(
        students.filter(
          (s) => s.class !== classes.find((c) => c.id === id)?.name,
        ),
      );
      showSnackbar("Turma excluída com sucesso!");
    }
  };

  const handleStudentAttendanceToggle = (studentId) => {
    setStudentAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedClass || !selectedTeacher || !classSubject) {
      showSnackbar(
        "Por favor, preencha todos os campos obrigatórios!",
        "error",
      );
      return;
    }

    setLoading(true);

    const classStudents = students.filter((s) => s.class === selectedClass);

    const newRecord = {
      id: Date.now(),
      date: classDate,
      class: selectedClass,
      teacher: teachers.find((t) => t.id === parseInt(selectedTeacher))?.name,
      subject: classSubject,
      students: classStudents.map((student) => ({
        id: student.id,
        name: student.name,
        present: studentAttendance[student.id] || false,
      })),
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);

    // Salvar no Google Sheets
    try {
      const result = await googleSheets.saveAttendanceRecord(newRecord);
      if (result.success) {
        showSnackbar("Presença registrada e salva no Google Sheets!");
      } else {
        showSnackbar(
          "Presença registrada localmente. Erro ao salvar no Google Sheets.",
          "warning",
        );
      }
    } catch (error) {
      console.error("Erro ao salvar no Google Sheets:", error);
      showSnackbar(
        "Presença registrada localmente. Erro ao salvar no Google Sheets.",
        "warning",
      );
    }

    setSelectedClass("");
    setSelectedTeacher("");
    setClassSubject("");
    setStudentAttendance({});

    setLoading(false);
  };

  const filteredRecords = attendanceRecords.filter((record) => {
    const matchesDate = !searchDate || record.date === searchDate;
    const matchesClass = !searchClass || record.class === searchClass;
    const matchesTeacher =
      !searchTeacherName ||
      (record.teacher &&
        record.teacher.toLowerCase().includes(searchTeacherName.toLowerCase()));
    return matchesDate && matchesClass && matchesTeacher;
  });

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchStudentName.toLowerCase()) ||
      student.class.toLowerCase().includes(searchStudentName.toLowerCase()),
  );

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTeacherName.toLowerCase()) ||
      (teacher.subject &&
        teacher.subject
          .toLowerCase()
          .includes(searchTeacherName.toLowerCase())),
  );

  const filteredClasses = classes.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchClassName.toLowerCase()) ||
      (classItem.description &&
        classItem.description
          .toLowerCase()
          .includes(searchClassName.toLowerCase())),
  );

  const exportToCSV = () => {
    const csvContent = filteredRecords
      .map(
        (record) =>
          `${record.date},${record.class},${record.teacher},${record.subject},${
            record.students.filter((s) => s.present).length
          }/${record.students.length}`,
      )
      .join("\n");

    const blob = new Blob(
      [`Data,Turma,Professor,Matéria,Presentes\n${csvContent}`],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio_presenca.csv";
    a.click();
    showSnackbar("Relatório exportado com sucesso!");
  };

  // Dados para gráficos
  const chartData = useMemo(() => {
    // Gráfico de barras: quantidade de presentes por turma
    const classAttendanceData = classes.map((cls) => {
      const classRecords = filteredRecords.filter(
        (record) => record.class === cls.name,
      );
      const totalStudents = students.filter((s) => s.class === cls.name).length;
      const totalPresent = classRecords.reduce((sum, record) => {
        return sum + record.students.filter((s) => s.present).length;
      }, 0);
      const totalPossible = classRecords.length * totalStudents;
      const attendanceRate =
        totalPossible > 0 ? (totalPresent / totalPossible) * 100 : 0;

      return {
        turma: cls.name,
        presentes: totalPresent,
        totalAulas: classRecords.length,
        porcentagem: Math.round(attendanceRate),
      };
    });

    // Gráfico de pizza: distribuição de presença geral
    const totalPresent = filteredRecords.reduce((sum, record) => {
      return sum + record.students.filter((s) => s.present).length;
    }, 0);
    const totalStudents = filteredRecords.reduce((sum, record) => {
      return sum + record.students.length;
    }, 0);
    const totalAbsent = totalStudents - totalPresent;

    const pieData = [
      { name: "Presentes", value: totalPresent, color: "#4caf50" },
      { name: "Faltas", value: totalAbsent, color: "#f44336" },
    ];

    // Gráfico de linha: evolução da presença ao longo do tempo
    const timelineData = filteredRecords
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((record) => ({
        data: new Date(record.date).toLocaleDateString("pt-BR"),
        presentes: record.students.filter((s) => s.present).length,
        total: record.students.length,
        porcentagem: Math.round(
          (record.students.filter((s) => s.present).length /
            record.students.length) *
            100,
        ),
      }));

    return {
      classAttendance: classAttendanceData,
      pieData,
      timelineData,
    };
  }, [filteredRecords, classes, students]);

  const COLORS = ["#4caf50", "#f44336", "#2196f3", "#ff9800", "#9c27b0"];

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
    >
      <AppBar position="static" color="primary">
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            <School />
            Sistema de Registro de Presença
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
            Gerencie presenças, alunos e professores
          </Typography>
        </Box>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          aria-label="abas do sistema"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              minWidth: "auto",
              padding: { xs: "8px 4px", sm: "12px 16px" },
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
              "& .MuiTab-iconWrapper": {
                marginBottom: { xs: "2px", sm: "0px" },
              },
            },
            "& .MuiTabs-list": {
              justifyContent: "center",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: { xs: "4px", sm: "8px" },
            },
          }}
        >
          <Tab
            icon={<Add />}
            label="Presença"
            iconPosition="top"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: { xs: "4px", sm: "8px" },
            }}
          />
          <Tab
            icon={<Search />}
            label="Consultar"
            iconPosition="top"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: { xs: "4px", sm: "8px" },
            }}
          />
          <Tab
            icon={<PersonAdd />}
            label="Alunos"
            iconPosition="top"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: { xs: "4px", sm: "8px" },
            }}
          />
          <Tab
            icon={<People />}
            label="Professores"
            iconPosition="top"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: { xs: "4px", sm: "8px" },
            }}
          />
          <Tab
            icon={<Class />}
            label="Turmas"
            iconPosition="top"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: { xs: "4px", sm: "8px" },
            }}
          />
        </Tabs>
      </Box>

      {loading && <LinearProgress />}

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={10} lg={8} xl={6}>
            <Card>
              <CardHeader title="Registro de Presença" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4} md={2}>
                    <TextField
                      key="class-date-input"
                      fullWidth
                      label="Data da Aula"
                      type="date"
                      value={classDate}
                      onChange={handleDateChange}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& .MuiInputBase-input": {
                          minWidth: "200px",
                          width: "100%",
                          maxWidth: "none",
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={5}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        minWidth: "200px",
                        "& .MuiInputLabel-root": {
                          whiteSpace: "nowrap",
                          overflow: "visible",
                        },
                      }}
                    >
                      <InputLabel id="turma-label">Turma</InputLabel>
                      <Select
                        labelId="turma-label"
                        value={selectedClass}
                        onChange={(e) => {
                          setSelectedClass(e.target.value);
                          setStudentAttendance({});
                        }}
                        label="Turma"
                        sx={{
                          minWidth: "200px",
                          "& .MuiSelect-select": {
                            paddingRight: "40px",
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Selecione uma turma</em>
                        </MenuItem>
                        {classes.map((cls) => (
                          <MenuItem key={cls.id} value={cls.name}>
                            {cls.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        minWidth: "180px",
                        "& .MuiInputLabel-root": {
                          whiteSpace: "nowrap",
                          overflow: "visible",
                        },
                      }}
                    >
                      <InputLabel id="professor-label">Professor</InputLabel>
                      <Select
                        labelId="professor-label"
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        label="Professor"
                        sx={{
                          minWidth: "180px",
                          "& .MuiSelect-select": {
                            paddingRight: "40px",
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Selecione um professor</em>
                        </MenuItem>
                        {teachers.map((teacher) => (
                          <MenuItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2}>
                    <TextField
                      ref={classSubjectRef}
                      fullWidth
                      label="Matéria"
                      value={classSubject}
                      onChange={(e) => {
                        console.log("Direct onChange:", e.target.value);
                        setClassSubject(e.target.value);
                      }}
                      placeholder="Ex: Matemática, Português..."
                      variant="outlined"
                      slotProps={{
                        input: {
                          "data-testid": "class-subject-input",
                          style: {
                            minWidth: "200px",
                            width: "100%",
                            maxWidth: "none",
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {selectedClass && (
            <Grid item xs={12} md={10} lg={8} xl={6}>
              <Card>
                <CardHeader
                  title={`Lista de Alunos - ${selectedClass}`}
                  avatar={<Group />}
                />
                <CardContent>
                  <List>
                    {students
                      .filter((s) => s.class === selectedClass)
                      .map((student) => (
                        <ListItem
                          key={student.id}
                          button
                          onClick={() =>
                            handleStudentAttendanceToggle(student.id)
                          }
                          sx={{
                            bgcolor: studentAttendance[student.id]
                              ? "success.light"
                              : "background.paper",
                            mb: 1,
                            borderRadius: 1,
                            border: 1,
                            borderColor: studentAttendance[student.id]
                              ? "success.main"
                              : "divider",
                          }}
                        >
                          <ListItemIcon>
                            {studentAttendance[student.id] ? (
                              <CheckCircle color="success" />
                            ) : (
                              <Cancel color="action" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={student.name}
                            secondary={student.email}
                          />
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={handleSubmitAttendance}
                    disabled={loading}
                    startIcon={<Save />}
                    fullWidth
                    size="large"
                  >
                    {loading ? "Salvando..." : "Registrar Presença"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Filtros de Consulta" />
              <CardContent>
                {/* Indicador de resultados */}
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Resultados da Busca
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filteredRecords.length} registro(s) encontrado(s)
                    {searchDate &&
                      ` • Data: ${new Date(searchDate).toLocaleDateString(
                        "pt-BR",
                      )}`}
                    {searchClass && ` • Turma: ${searchClass}`}
                    {searchTeacherName && ` • Professor: ${searchTeacherName}`}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="Filtrar por Data"
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      variant="outlined"
                      slotProps={{
                        inputLabel: { shrink: true },
                        input: {
                          style: {
                            minWidth: "200px",
                            width: "100%",
                            maxWidth: "none",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      sx={{
                        minWidth: "200px",
                        "& .MuiInputLabel-root": {
                          whiteSpace: "nowrap",
                          overflow: "visible",
                        },
                      }}
                    >
                      <InputLabel id="filtro-turma-label">
                        Filtrar por Turma
                      </InputLabel>
                      <Select
                        labelId="filtro-turma-label"
                        value={searchClass}
                        onChange={(e) => setSearchClass(e.target.value)}
                        label="Filtrar por Turma"
                        sx={{
                          minWidth: "200px",
                          "& .MuiSelect-select": {
                            paddingRight: "40px",
                          },
                        }}
                      >
                        <MenuItem value="">Todas as turmas</MenuItem>
                        {classes.map((cls) => (
                          <MenuItem key={cls.id} value={cls.name}>
                            {cls.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="Filtrar por Professor"
                      value={searchTeacherName}
                      onChange={(e) => setSearchTeacherName(e.target.value)}
                      placeholder="Digite o nome do professor..."
                      variant="outlined"
                      slotProps={{
                        input: {
                          style: {
                            minWidth: "200px",
                            width: "100%",
                            maxWidth: "none",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Button
                      variant="contained"
                      onClick={exportToCSV}
                      startIcon={<Download />}
                      fullWidth
                      size="large"
                    >
                      Exportar CSV
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchDate("");
                        setSearchClass("");
                        setSearchTeacherName("");
                      }}
                      startIcon={<Close />}
                      fullWidth
                      size="large"
                    >
                      Limpar Filtros
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráficos de Estatísticas */}
          {filteredRecords.length > 0 && (
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {/* Gráfico de Barras - Presença por Turma */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Presença por Turma" />
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.classAttendance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="turma" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="presentes" fill="#4caf50" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Gráfico de Pizza - Distribuição Geral */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader title="Distribuição de Presença" />
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData.pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) =>
                              `${name}: ${value} (${(percent * 100).toFixed(
                                0,
                              )}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData.pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Gráfico de Linha - Evolução Temporal */}
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Evolução da Presença ao Longo do Tempo" />
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData.timelineData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="data" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="presentes"
                            stroke="#4caf50"
                            name="Presentes"
                          />
                          <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#2196f3"
                            name="Total de Alunos"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Tabela de Estatísticas por Turma */}
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Estatísticas Detalhadas por Turma" />
                    <CardContent>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Turma</TableCell>
                              <TableCell align="center">
                                Total de Aulas
                              </TableCell>
                              <TableCell align="center">Presentes</TableCell>
                              <TableCell align="center">Porcentagem</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {chartData.classAttendance.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  <Chip
                                    label={item.turma}
                                    color="primary"
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  {item.totalAulas}
                                </TableCell>
                                <TableCell align="center">
                                  <Typography
                                    color="success.main"
                                    fontWeight="bold"
                                  >
                                    {item.presentes}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography
                                    color={
                                      item.porcentagem >= 80
                                        ? "success.main"
                                        : item.porcentagem >= 60
                                        ? "warning.main"
                                        : "error.main"
                                    }
                                    fontWeight="bold"
                                  >
                                    {item.porcentagem}%
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12}>
            {filteredRecords.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 8 }}>
                  <CalendarToday
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Nenhum registro encontrado
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {filteredRecords.map((record) => (
                  <Grid item xs={12} md={6} key={record.id}>
                    <Card>
                      <CardHeader
                        title={record.subject}
                        subheader={`${record.class} • ${record.teacher}`}
                        action={
                          <Chip
                            label={`${
                              record.students.filter((s) => s.present).length
                            }/${record.students.length} presentes`}
                            color="success"
                            size="small"
                          />
                        }
                      />
                      <CardContent>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {new Date(record.date).toLocaleDateString("pt-BR")}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom>
                          Detalhes dos Alunos:
                        </Typography>
                        {record.students.map((student) => (
                          <Box
                            key={student.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            {student.present ? (
                              <CheckCircle
                                color="success"
                                sx={{ mr: 1, fontSize: 20 }}
                              />
                            ) : (
                              <Cancel
                                color="error"
                                sx={{ mr: 1, fontSize: 20 }}
                              />
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                color: student.present
                                  ? "text.primary"
                                  : "text.secondary",
                              }}
                            >
                              {student.name}
                            </Typography>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Gestão de Alunos"
                action={
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setStudentDialogOpen(true)}
                  >
                    Novo Aluno
                  </Button>
                }
              />
              <CardContent>
                <TextField
                  fullWidth
                  label="Buscar por nome ou turma"
                  value={searchStudentName}
                  onChange={(e) => setSearchStudentName(e.target.value)}
                  sx={{ mb: 3 }}
                  slotProps={{
                    input: {
                      style: {
                        minWidth: "200px",
                        width: "100%",
                        maxWidth: "none",
                      },
                    },
                  }}
                />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Turma</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                                <Person />
                              </Avatar>
                              {student.name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={student.class}
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleEditStudent(student)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteStudent(student.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Gestão de Professores"
                action={
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setTeacherDialogOpen(true)}
                    color="secondary"
                  >
                    Novo Professor
                  </Button>
                }
              />
              <CardContent>
                <TextField
                  fullWidth
                  label="Buscar por nome ou matéria"
                  value={searchTeacherName}
                  onChange={(e) => setSearchTeacherName(e.target.value)}
                  sx={{ mb: 3 }}
                  slotProps={{
                    input: {
                      style: {
                        minWidth: "200px",
                        width: "100%",
                        maxWidth: "none",
                      },
                    },
                  }}
                />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell>Matéria</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar sx={{ mr: 2, bgcolor: "secondary.main" }}>
                                <People />
                              </Avatar>
                              {teacher.name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={teacher.subject}
                              color="secondary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{teacher.email}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleEditTeacher(teacher)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Gestão de Turmas"
                action={
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={initializeGoogleSheets}
                      color={sheetsInitialized ? "success" : "primary"}
                    >
                      {sheetsInitialized
                        ? "Google Sheets OK"
                        : "Inicializar Google Sheets"}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setClassDialogOpen(true)}
                      color="success"
                    >
                      Nova Turma
                    </Button>
                  </Box>
                }
              />
              <CardContent>
                <TextField
                  fullWidth
                  label="Buscar por nome ou descrição"
                  value={searchClassName}
                  onChange={(e) => setSearchClassName(e.target.value)}
                  variant="outlined"
                  slotProps={{
                    input: {
                      style: {
                        minWidth: "200px",
                        width: "100%",
                        maxWidth: "none",
                      },
                    },
                  }}
                  sx={{ mb: 3 }}
                />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nome da Turma</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Alunos</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredClasses.map((classItem) => (
                        <TableRow key={classItem.id}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar sx={{ mr: 2, bgcolor: "success.main" }}>
                                <Class />
                              </Avatar>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {classItem.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {classItem.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={`${
                                students.filter(
                                  (s) => s.class === classItem.name,
                                ).length
                              } alunos`}
                              color="info"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleEditClass(classItem)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteClass(classItem.id)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Dialog para Cadastro/Edição de Aluno */}
      <Dialog
        open={studentDialogOpen}
        onClose={() => setStudentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingStudent ? "Editar Aluno" : "Cadastrar Novo Aluno"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                variant="outlined"
                slotProps={{
                  input: {
                    style: {
                      minWidth: "200px",
                      width: "100%",
                      maxWidth: "none",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                required
                variant="outlined"
                sx={{
                  minWidth: "200px",
                  "& .MuiInputLabel-root": {
                    whiteSpace: "nowrap !important",
                    overflow: "visible !important",
                    maxWidth: "none !important",
                  },
                  "& .MuiSelect-select": {
                    paddingRight: "40px !important",
                    minWidth: "120px !important",
                  },
                }}
              >
                <InputLabel
                  id="aluno-turma-label"
                  sx={{
                    whiteSpace: "nowrap !important",
                    overflow: "visible !important",
                    maxWidth: "none !important",
                  }}
                >
                  Turma
                </InputLabel>
                <Select
                  labelId="aluno-turma-label"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  label="Turma"
                  sx={{
                    minWidth: "200px",
                    "& .MuiSelect-select": {
                      paddingRight: "40px !important",
                      minWidth: "120px !important",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Selecione a turma</em>
                  </MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                variant="outlined"
                slotProps={{
                  input: {
                    style: {
                      minWidth: "200px",
                      width: "100%",
                      maxWidth: "none",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudentDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddStudent} variant="contained">
            {editingStudent ? "Atualizar" : "Cadastrar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Cadastro/Edição de Professor */}
      <Dialog
        open={teacherDialogOpen}
        onClose={() => setTeacherDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingTeacher ? "Editar Professor" : "Cadastrar Novo Professor"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                required
                variant="outlined"
                slotProps={{
                  input: {
                    style: {
                      minWidth: "200px",
                      width: "100%",
                      maxWidth: "none",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Matéria/Disciplina"
                value={teacherSubject}
                onChange={(e) => setTeacherSubject(e.target.value)}
                placeholder="Ex: Matemática, Física..."
                variant="outlined"
                slotProps={{
                  input: {
                    style: {
                      minWidth: "200px",
                      width: "100%",
                      maxWidth: "none",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                variant="outlined"
                slotProps={{
                  input: {
                    style: {
                      minWidth: "200px",
                      width: "100%",
                      maxWidth: "none",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTeacherDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleAddTeacher}
            variant="contained"
            color="secondary"
          >
            {editingTeacher ? "Atualizar" : "Cadastrar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Cadastro/Edição de Turma */}
      <Dialog
        open={classDialogOpen}
        onClose={() => setClassDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingClass ? "Editar Turma" : "Cadastrar Nova Turma"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Turma"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ex: Turma A, Infantil, Jovens..."
                required
                variant="outlined"
                slotProps={{
                  input: {
                    style: {
                      minWidth: "200px",
                      width: "100%",
                      maxWidth: "none",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição da Turma"
                value={classDescription}
                onChange={(e) => setClassDescription(e.target.value)}
                placeholder="Ex: Crianças de 6-8 anos, Adolescentes de 12-15 anos..."
                multiline
                rows={3}
                variant="outlined"
                slotProps={{
                  input: {
                    style: {
                      minWidth: "200px",
                      width: "100%",
                      maxWidth: "none",
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClassDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleAddClass} variant="contained" color="success">
            {editingClass ? "Atualizar" : "Cadastrar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttendanceSystem;
