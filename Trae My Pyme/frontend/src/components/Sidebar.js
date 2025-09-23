import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaHome, 
  FaUsers, 
  FaProjectDiagram, 
  FaMoneyBillWave, 
  FaUserTie, 
  FaWhatsapp, 
  FaCalendarAlt, 
  FaChartBar, 
  FaCog 
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  border-bottom: 1px solid #34495e;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoBadge = styled.span`
  background-color: #e91e63;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  flex: 1;
`;

const NavItem = styled(NavLink)`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover, &.active {
    background-color: #34495e;
    color: #3498db;
  }
  
  &.active {
    border-left: 4px solid #3498db;
  }
`;

const IconWrapper = styled.span`
  width: 20px;
  display: flex;
  justify-content: center;
`;

const Sidebar = () => {
  const { logout } = useAuth();
  
  return (
    <SidebarContainer>
      <Logo>
        <span>EnterprisePro</span>
        <LogoBadge>+</LogoBadge>
      </Logo>
      
      <NavMenu>
        <NavItem to="/" end>
          <IconWrapper><FaHome /></IconWrapper>
          Panel Principal
        </NavItem>
        
        <NavItem to="/team">
          <IconWrapper><FaUsers /></IconWrapper>
          Equipo
        </NavItem>
        
        <NavItem to="/projects">
          <IconWrapper><FaProjectDiagram /></IconWrapper>
          Proyectos
        </NavItem>
        
        <NavItem to="/finances">
          <IconWrapper><FaMoneyBillWave /></IconWrapper>
          Finanzas
        </NavItem>
        
        <NavItem to="/clients">
          <IconWrapper><FaUserTie /></IconWrapper>
          Clientes
        </NavItem>
        
        <NavItem to="/whatsapp">
          <IconWrapper><FaWhatsapp /></IconWrapper>
          WhatsApp
        </NavItem>
        
        <NavItem to="/calendar">
          <IconWrapper><FaCalendarAlt /></IconWrapper>
          Calendario
        </NavItem>
        
        <NavItem to="/reports">
          <IconWrapper><FaChartBar /></IconWrapper>
          Reportes
        </NavItem>
        
        <NavItem to="/settings">
          <IconWrapper><FaCog /></IconWrapper>
          Configuración
        </NavItem>
      </NavMenu>
      
      <div style={{ padding: '20px', borderTop: '1px solid #34495e' }}>
        <button 
          onClick={logout}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            border: '1px solid #e74c3c',
            color: '#e74c3c',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;