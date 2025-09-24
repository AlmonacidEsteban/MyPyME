import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Select, DatePicker, Button, Tabs } from 'antd';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: [moment().subtract(6, 'months'), moment()],
    type: 'all',
    client: 'all',
    project: 'all'
  });
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [clientsRes, projectsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/clients/'),
          axios.get('http://localhost:8000/api/projects/')
        ]);
        
        setClients(clientsRes.data);
        setProjects(projectsRes.data);
        
        // Cargar reporte inicial
        fetchReport();
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    
    fetchInitialData();
  }, []);

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

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    fetchReport();
  };

  // Preparar datos para gráficos
  const getMonthlyChartData = () => {
    if (!reportData || !reportData.monthly_data) return [];
    
    return Object.entries(reportData.monthly_data).map(([month, data]) => ({
      name: month,
      ingresos: data.income,
      gastos: data.expenses,
      balance: data.income - data.expenses
    }));
  };

  const getPieChartData = () => {
    if (!reportData) return [];
    
    return [
      { name: 'Ingresos', value: reportData.total_income, fill: '#52c41a' },
      { name: 'Gastos', value: reportData.total_expenses, fill: '#f5222d' }
    ];
  };

  return (
    <div className="reports-page">
      <h1>Reportes y Análisis</h1>
      
      <Card title="Filtros de Reporte" style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          <Col span={8}>
            <label>Rango de fechas:</label>
            <RangePicker 
              style={{ width: '100%', marginTop: 8 }}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
            />
          </Col>
          <Col span={4}>
            <label>Tipo:</label>
            <Select 
              style={{ width: '100%', marginTop: 8 }} 
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
            >
              <Option value="all">Todos</Option>
              <Option value="ingreso">Ingresos</Option>
              <Option value="gasto">Gastos</Option>
            </Select>
          </Col>
          <Col span={4}>
            <label>Cliente:</label>
            <Select 
              style={{ width: '100%', marginTop: 8 }} 
              value={filters.client}
              onChange={(value) => handleFilterChange('client', value)}
            >
              <Option value="all">Todos</Option>
              {clients.map(client => (
                <Option key={client.id} value={client.id}>{client.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <label>Proyecto:</label>
            <Select 
              style={{ width: '100%', marginTop: 8 }} 
              value={filters.project}
              onChange={(value) => handleFilterChange('project', value)}
            >
              <Option value="all">Todos</Option>
              {projects.map(project => (
                <Option key={project.id} value={project.id}>{project.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button 
              type="primary" 
              onClick={applyFilters} 
              loading={loading}
              style={{ marginTop: 8 }}
            >
              Generar Reporte
            </Button>
          </Col>
        </Row>
      </Card>
      
      {reportData && (
        <>
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Ingresos Totales"
                  value={reportData.total_income}
                  precision={2}
                  valueStyle={{ color: '#52c41a' }}
                  prefix="$"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Gastos Totales"
                  value={reportData.total_expenses}
                  precision={2}
                  valueStyle={{ color: '#f5222d' }}
                  prefix="$"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Balance"
                  value={reportData.balance}
                  precision={2}
                  valueStyle={{ color: reportData.balance >= 0 ? '#52c41a' : '#f5222d' }}
                  prefix="$"
                />
              </Card>
            </Col>
          </Row>
          
          <Tabs defaultActiveKey="1">
            <TabPane tab="Análisis Mensual" key="1">
              <Card title="Evolución Mensual de Ingresos y Gastos">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={getMonthlyChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="ingresos" name="Ingresos" fill="#52c41a" />
                    <Bar dataKey="gastos" name="Gastos" fill="#f5222d" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </TabPane>
            
            <TabPane tab="Distribución" key="2">
              <Card title="Distribución de Ingresos vs Gastos">
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={getPieChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Reports;