import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Spin, Alert } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, BarChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const FinancialSummary = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Usar el nuevo endpoint de reportes financieros
        const params = {
          start_date: moment().startOf('month').format('YYYY-MM-DD'),
          end_date: moment().format('YYYY-MM-DD')
        };
        
        const response = await axios.get('http://localhost:8000/api/finances/reportes/', { params });
        setSummaryData(response.data);
      } catch (error) {
        console.error('Error al obtener resumen financiero:', error);
        setError('No se pudo cargar el resumen financiero');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <Card title="Resumen Financiero" style={{ marginBottom: 20 }}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin tip="Cargando datos..." />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Resumen Financiero" style={{ marginBottom: 20 }}>
        <Alert message={error} type="error" showIcon />
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BarChartOutlined style={{ marginRight: 8 }} />
          <span>Resumen Financiero (Mes Actual)</span>
        </div>
      } 
      style={{ marginBottom: 20 }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Ingresos"
            value={summaryData.total_income}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix="$"
            suffix=""
            prefix={<ArrowUpOutlined style={{ marginRight: 8 }} />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Gastos"
            value={summaryData.total_expenses}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            prefix="$"
            suffix=""
            prefix={<ArrowDownOutlined style={{ marginRight: 8 }} />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Balance"
            value={summaryData.balance}
            precision={2}
            valueStyle={{ color: summaryData.balance >= 0 ? '#3f8600' : '#cf1322' }}
            prefix="$"
            suffix=""
          />
        </Col>
      </Row>
    </Card>
  );
};

export default FinancialSummary;