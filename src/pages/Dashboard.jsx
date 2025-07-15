import React from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";

function Dashboard() {
  // const { user } = useSelector((state) => state.auth);
  const reduxUser = useSelector((state) => state.auth.user);
  const storedUser = localStorage.getItem("user");
  const user = reduxUser || (storedUser && JSON.parse(storedUser));

  return (
    <Layout>
      {user?.role === "doctor" && <DoctorDashboard />}
      {user?.role === "patient" && <PatientDashboard />}
    </Layout>
  );
}

export default Dashboard;
