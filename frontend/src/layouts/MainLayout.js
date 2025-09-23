import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const MainLayout = () => {
  return (
    <MainContainer>
      <Sidebar />
      <ContentArea>
        <Outlet />
      </ContentArea>
    </MainContainer>
  );
};

export default MainLayout;