"use client";
import { useRef } from "react";
import Image from "next/image";
import html2pdf from "html2pdf.js";

export default function GradeRender({ model, serial, criteria, deviceType, gradeDescriptions }) {
  const resultRef = useRef(null);

  const handlePrint = () => {
    const oldTitle = document.title;
    document.title = `${model.replace(/\s+/g, "_")}_${serial.replace(/\s+/g, "_")}`;
    window.print();
    document.title = oldTitle;
  };

  const handleDownloadPDF = () => {
    const element = resultRef.current;
    const opt = {
      margin: 0,
      filename: `${model.replace(/\s+/g, "_")}_${serial.replace(/\s+/g, "_")}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const gradeLabels = ["A+", "A", "B", "C", "D"];
  const gradeColors = {
    "A+": "#15803d",
    "A": "#4ade80",
    "B": "#fde047",
    "C": "#ef4444",
    "D": "#b30004",
  };
  const borderColor1 = "#af0162";
  const borderColor2 = "#d0844a";

  const criteriaList = {
    "PC Portable": [
      "Chassis",
      "Batterie",
      "Clavier",
      "Touchpad",
      "CPU & RAM",
      "Disque dur",
      "Webcam",
      "Hauts parleurs",
      "Wifi/Bluetooth",
      "Charnières",
      "\u00c9cran",
      "Ports",
      "Ventilateurs",
    ],
    "Tout-en-Un": [
      "Chassis",
      "CPU & RAM",
      "Disque dur",
      "Webcam",
      "Hauts parleurs",
      "Wifi/Bluetooth",
      "\u00c9cran",
      "Ports",
      "Ventilateurs",
    ],
    "PC Fixe": ["Chassis", "CPU & RAM", "Disque dur", "Wifi/Bluetooth", "Ports", "Ventilateurs"],
  };

  const gradePoints = {
    "A+": 5,
    "A": 4,
    "B": 3,
    "C": 2,
    "D": 0, // D = éliminatoire
  };

  const weights = {
    "Chassis": 1,
    "Batterie": 4.5,
    "Clavier": 2,
    "Touchpad": 1,
    "CPU & RAM": 1,
    "Disque dur": 4,
    "Webcam": 1,
    "Hauts parleurs": 1,
    "Wifi/Bluetooth": 1,
    "Charnières": 2,
    "Écran": 4,
    "Ports": 2,
    "Ventilateurs": 2,
  };

  const computeFinalGrade = () => {
    let totalPoints = 0;
    let totalWeight = 0;
  
    for (const crit of criteriaList[deviceType]) {
      const grade = criteria[crit]?.grade;
      if (!grade) continue;
  
      if (grade === "D") return "D"; // D = éliminatoire
  
      const points = gradePoints[grade] ?? 0;
      const weight = weights[crit] ?? 1;
  
      totalPoints += points * weight;
      totalWeight += weight;
    }
  
    const average = totalPoints / totalWeight;
  
    if (average >= 4.7) return "A+";
    if (average >= 4.0) return "A";
    if (average >= 3.0) return "B";
    if (average >= 2.0) return "C";
    return "D";
  };

  return (
    <div id="parent-print-section" className="space-y-4">
      <div id="print-section" ref={resultRef} style={{
        fontFamily: "Marianne, Codec, Arial, sans-serif",
        background: "white",
        padding: 20,
        border: `2px solid ${borderColor1}`,
        borderRadius: 12,
        boxShadow: `0 0 0 4px ${borderColor2}`,
        maxWidth: 1000,
        margin: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image src="/logo-atelier.png" alt="Logo" width={260} height={120} />
        </div>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: "bold", margin: "20px 0" }}>
          LE GRADE DE CE PRODUIT
        </h2>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
            marginBottom: 8
          }}>
            <div>
              <p style={{ marginBottom: 4 }}><strong>Modèle :</strong> {model}</p>
              <p><strong>S/N :</strong> {serial}</p>
            </div>

            <div>
              <p><strong>Grade final :</strong> <span style={{
                backgroundColor: gradeColors[computeFinalGrade()],
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: computeFinalGrade() === "B" ? "black" : "white",
                fontWeight: "bold",
                fontSize: 14
              }}>
                {computeFinalGrade()}
              </span></p>
            </div>
          </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20, fontSize: 14 }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f1f1" }}>
              <th style={{ border: "0.5px solid #333", padding: 8 }}>Critère</th>
              {gradeLabels.map(label => (
                <th key={label} style={{ border: "0.5px solid #333", padding: 8 }}>
                  <div style={{
                    backgroundColor: gradeColors[label],
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: label === "B" ? "black" : "white",
                    fontWeight: "bold",
                    fontSize: 14
                  }}>
                    {label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteriaList[deviceType].map((crit) => (
              <tr key={crit}>
                <td style={{ border: "0.5px solid #333", padding: 8, fontWeight: "bold", verticalAlign: "middle", height: 40 }}>
                  {crit}
                </td>
                {gradeLabels.map((grade) => {
                  const isSelected = criteria[crit]?.grade === grade;
                  const description = gradeDescriptions[crit]?.[grade] || "";
                  const bgColor = description === ""
                    ? "black"
                    : isSelected
                      ? gradeColors[grade]
                      : "transparent";
                  return (
                    <td
                      key={grade}
                      style={{
                        border: "0.5px solid #333",
                        padding: 8,
                        backgroundColor: bgColor,
                        color: isSelected ? (grade === "B" ? "black" : "white") : "black",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontWeight: isSelected ? "bold" : "normal",
                        lineHeight: "1.4",
                        height: 40,
                      }}
                    >
                      {gradeDescriptions[crit][grade]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{textAlign: "center", marginTop: 10}}><strong>✅ Tous les composants ont été testés manuellement</strong></p>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button
          onClick={handlePrint}
          style={{ padding: "8px 16px", backgroundColor: "#4f46e5", color: "white", borderRadius: 4 }}
        >
          🖨️ Imprimer
        </button>
      </div>

      <style jsx global>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 0 !important;
            overflow: visible !important;
            transform: scale(1);
              height: 100%;
            display: grid;
            place-items: center;
          }

          #form {
          display:none !important;
          top:0px !important;
          }

          body {
          visibility: hidden !important;
          }

          #parent-print-section {
            display: grid;
            place-items: center; /* centre horizontalement ET verticalement */
            height: 100%;
            }

          #print-section, #print-section * {
            visibility: visible !important;
          }

          #print-section {
            position: relative !important;
            margin: auto !important;
            transform: none !important;
            page-break-before: avoid;
            page-break-after: avoid;
            page-break-inside: avoid;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

        @page {
          size: portrait;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
