import { useEffect, useState } from "react";
import GradeForm from "../components/GradeForm";

export default function Page() {
  return <GradeForm />;
}

// Si tu veux forcer un rendu côté serveur sans prérendu statique
export async function getServerSideProps() {
  return { props: {} };  // Ignore le prérendu statique
}
