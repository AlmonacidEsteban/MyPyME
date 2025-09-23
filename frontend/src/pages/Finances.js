import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Form, DatePicker, Select, Statistic, Tabs } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, BarChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const Finances = () => {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: [moment().startOf('month'), moment()],
    type: 'all',
    client: 'all',
    project: 'all'
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [transactionsRes, clientsRes, projectsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/finances/'),
          axios.get('http://localhost:8000/api/clients/'),
          axios.get('http://localhost:8000/api/projects/')
        ]);
        
        setTransactions(transactionsRes.data);
        setClients(clientsRes.data);
        setProjects(projectsRes.data);
        
        // Cargar reporte inicial
        fetchReport();
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Función para obtener reportes financieros
  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        start_date: filters.dateRange[0].format('YYYY-MM-DD'),
        end_date: filters.dateRange[1].format('YYYY-MM-DD')
      };
      
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.client !== 'all') params.client = filters.client;
      if (filters.project !== 'all') params.project = filters.project;
      
      const response = await axios.get('http://localhost:8000/api/finances/reportes/', { params });
      setReportData(response.data);
    } catch (error) {
      console.error('Error al obtener reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en filtros
  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Aplicar filtros
  const applyFilters = () => {
    fetchReport();
  };

  // Preparar datos para gráficos
  const getChartData = () => {
    if (!reportData || !reportData.monthly_data) return null;
    
    const months = Object.keys(reportData.monthly_data);
    const incomeData = months.map(month => reportData.monthly_data[month].income);
    const expenseData = months.map(month => reportData.monthly_data[month].expenses);
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Ingresos',
          data: incomeData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Gastos',
          data: expenseData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }
      ],
    };
  };

  return (
    <div className="finances-page">
      <h1>Gestión Financiera</h1>
      
      <Card title="Filtros de Reporte" style={{ marginBottom: 20 }}>
        <Form layout="inline">
          <Form.Item label="Rango de fechas">
            <RangePicker 
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
            />
          </Form.Item>
          <Form.Item label="Tipo">
            <Select 
              style={{ width: 120 }} 
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
            >
              <Option value="all">Todos</Option>
              <Option value="ingreso">Ingresos</Option>
              <Option value="gasto">Gastos</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Cliente">
            <Select 
              style={{ width: 150 }} 
              value={filters.client}
              onChange={(value) => handleFilterChange('client', value)}
            >
              <Option value="all">Todos</Option>
              {clients.map(client => (
                <Option key={client.id} value={client.id}>{client.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Proyecto">
            <Select 
              style={{ width: 150 }} 
              value={filters.project}
              onChange={(value) => handleFilterChange('project', value)}
            >
              <Option value="all">Todos</Option>
              {projects.map(project => (
                <Option key={project.id} value={project.id}>{project.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={applyFilters}>Aplicar Filtros</Button>
          </Form.Item>
        </Form>
      </Card>
      
      {reportData && (
        <Tabs defaultActiveKey="1">
          <TabPane tab={<span><BarChartOutlined />Resumen</span>} key="1">
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Ingresos Totales"
                    value={reportData.total_income}
                    precision={2}
                    valueStyle={{ color: '#3f8600' }}
                    prefix="$"
                    suffix=""
                    prefix={<ArrowUpOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Gastos Totales"
                    value={reportData.total_expenses}
                    precision={2}
                    valueStyle={{ color: '#cf1322' }}
                    prefix="$"
                    suffix=""
                    prefix={<ArrowDownOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Balance"
                    value={reportData.balance}
                    precision={2}
                    valueStyle={{ color: reportData.balance >= 0 ? '#3f8600' : '#cf1322' }}
                    prefix="$"
                    suffix=""
                  />
                </Card>
              </Col>
            </Row>
            
            <Card title="Análisis Mensual">
              {getChartData() && <Bar data={getChartData()} />}
            </Card>
          </TabPane>
          
          <TabPane tab="Transacciones" key="2">
            <Card>
              <Table
                dataSource={transactions}
                rowKey="id"
                loading={loading}
                columns={[
                  {
                    title: 'Fecha',
                    dataIndex: 'date',
                    key: 'date',
                    render: text => moment(text).format('DD/MM/YYYY')
                  },
                  {
                    title: 'Tipo',
                    dataIndex: 'type',
                    key: 'type',
                    render: text => text === 'ingreso' ? 'Ingreso' : 'Gasto'
                  },
                  {
                    title: 'Descripción',
                    dataIndex: 'description',
                    key: 'description'
                  },
                  {
                    title: 'Monto',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (text, record) => (
                      <span style={{ color: record.type === 'ingreso' ? '#3f8600' : '#cf1322' }}>
                        ${text.toFixed(2)}
                      </span>
                    )
                  },
                  {
                    title: 'Cliente',
                    dataIndex: 'client',
                    key: 'client',
                    render: clientId => {
                      const client = clients.find(c => c.id === clientId);
                      return client ? client.name : 'N/A';
                    }
                  },
                  {
                    title: 'Proyecto',
                    dataIndex: 'project',
                    key: 'project',
                    render: projectId => {
                      const project = projects.find(p => p.id === projectId);
                      return project ? project.name : 'N/A';
                    }
                  }
                ]}
              />
            </Card>
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default Finances;