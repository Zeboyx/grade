"use client";
import { useRef } from "react";
import Image from "next/image";
import html2pdf from "html2pdf.js";

export default function GradeRender({ model, serial, criteria, deviceType, gradeDescriptions }) {
  const resultRef = useRef(null);

  const handlePrint = () => {
    const oldTitle = document.title;
    document.title = `${model.replace(/\s+/g, "_")}_${serial.replace(/\s+/g, "_")}_grade`;
    window.print();
    document.title = oldTitle;
  };

  const handleDownloadPDF = () => {
    const element = resultRef.current;
    const opt = {
      margin: 0,
      filename: `${model.replace(/\s+/g, "_")}_${serial.replace(/\s+/g, "_")}_grade.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const gradeLabels = ["A+", "A", "B", "C"];
  const gradeColors = {
    "A+": "#15803d",
    "A": "#4ade80",
    "B": "#fde047",
    "C": "#ef4444",
  };
  const borderColor1 = "#af0162";
  const borderColor2 = "#d0844a";

  const criteriaList = {
    "PC Portable": ["Chassis", "Batterie", "Clavier", "Touchpad", "Composants", "\u00c9cran", "Ports", "Ventilateurs"],
    "Tout-en-Un": ["Chassis", "Composants", "\u00c9cran", "Ports", "Ventilateurs"],
    "PC Fixe": ["Chassis", "Composants", "Ports", "Ventilateurs"]
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
        <p style={{ marginBottom: 4 }}><strong>Modèle :</strong> {model}</p>
        <p><strong>S/N :</strong> {serial}</p>

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
                  return (
                    <td
                      key={grade}
                      style={{
                        border: "0.5px solid #333",
                        padding: 8,
                        backgroundColor: isSelected ? gradeColors[grade] : "transparent",
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
          size: landscape;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
