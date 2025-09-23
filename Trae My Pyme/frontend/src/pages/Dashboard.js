import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import FinancialSummary from '../components/FinancialSummary';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <FinancialSummary />
        </Col>
        
        <Col span={12}>
          <Card title="Proyectos Activos" style={{ height: '100%' }}>
            <p>Aquí se mostrarán los proyectos activos</p>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="Clientes Recientes" style={{ height: '100%' }}>
            <p>Aquí se mostrarán los clientes recientes</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;