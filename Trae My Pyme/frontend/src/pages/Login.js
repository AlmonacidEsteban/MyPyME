import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      // Usar el nuevo endpoint JWT
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: values.username,
        password: values.password
      });
      
      // Guardar tokens
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Actualizar contexto de autenticación
      login(access);
      
      // Redirigir al dashboard
      navigate('/');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setError('Credenciales inválidas. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card title="Iniciar Sesión" className="login-card">
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Por favor ingrese su nombre de usuario' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nombre de usuario" size="large" />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Iniciar Sesión
            </Button>
          </Form.Item>
          
          <div className="login-links">
            <Link to="/register">¿No tiene una cuenta? Regístrese</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;