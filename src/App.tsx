import React, { useState } from "react";
import { Layout } from "antd";
import Auth from "./components/Auth";
import NdsTable from "./components/NdsTable";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Layout style={{ padding: "20px" }}>
      <Layout.Content>
        <h1>Авторизация</h1>
        {!isAuthenticated ? (
          <Auth onSuccess={handleLoginSuccess} />
        ) : (
          <NdsTable />
        )}
      </Layout.Content>
    </Layout>
  );
};

export default App;
