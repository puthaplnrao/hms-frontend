import React from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout>
      {user?.role === "doctor" && <DoctorDashboard />}
      {user?.role === "patient" && <PatientDashboard />}
    </Layout>
  );
}

export default Dashboard;
