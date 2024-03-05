import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../../components/home/Layout";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Layout>{/* content here */}</Layout>
    </main>
  );
}
