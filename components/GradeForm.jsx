"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";
const GradeRender = dynamic(() => import("./GradeRender"), { ssr: false });

export default function GradeForm() {
  const [form, setForm] = useState({
    model: "",
    serial: "",
    deviceType: "",
    criteria: {},
  });
  const [submitted, setSubmitted] = useState(false);  
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const model = params.get('model');
    const serial = params.get('sn');
    const battery = params.get('battery');
    const ssd = params.get('ssd');
  
    // Appliquer model et serial
    setForm((prev) => ({
      ...prev,
      model: model || "",
      serial: serial || "",
    }));
  
    // Fonction pour mapper pourcentage en grade
    const getGradeFromPercentage = (value) => {
      const percent = parseFloat(value);
      if (isNaN(percent)) return null;
      if (percent > 85) return "A+";
      if (percent > 75) return "A";
      if (percent > 50) return "B";
      if (percent > 35) return "C";
      return "D";
    };
  
    // Appliquer les grades si battery ou ssd présents
    if (battery || ssd) {
      setForm((prev) => {
        const updatedCriteria = { ...prev.criteria };
  
        if (battery) {
          const batteryGrade = getGradeFromPercentage(battery);
          if (batteryGrade)
            updatedCriteria["Batterie"] = {
              grade: batteryGrade,
              description: gradeDescriptions["Batterie"][batteryGrade],
            };
        }
  
        if (ssd) {
          const ssdGrade = getGradeFromPercentage(ssd);
          if (ssdGrade)
            updatedCriteria["Disque dur"] = {
              grade: ssdGrade,
              description: gradeDescriptions["Disque dur"][ssdGrade],
            };
        }
  
        return {
          ...prev,
          criteria: updatedCriteria,
        };
      });
    }
  }, []);    

  const criteriaByDevice = {
    "PC Portable": [
      "CPU, RAM & GPU",
      "Wifi/Bluetooth",
      "Batterie",
      "Disque dur",
      "Webcam",
      "Hauts parleurs",
      "Chassis",
      "Charnières",
      "Clavier",
      "Touchpad",
      "Écran",
      "Ports",
      "Ventilateurs",
    ],
    "Tout-en-Un": [
      "CPU, RAM & GPU",
      "Wifi/Bluetooth",
      "Disque dur",
      "Webcam",
      "Hauts parleurs",
      "Chassis",
      "Écran",
      "Ports",
      "Ventilateurs",
    ],
    "PC Fixe": ["CPU, RAM & GPU", "Wifi/Bluetooth", "Disque dur", "Chassis",  "Ports", "Ventilateurs"],
  };

  const gradeDescriptions = {
    Chassis: {
      "A+": "Aucune ou micro rayures",
      A: "Légères rayures",
      B: "Rayures visibles",
      C: "Rayures marquées",
      D: "A changer",
    },
    Batterie: {
      "A+": ">85%",
      A: "75 à 85%",
      B: "50 à 75%",
      C: "35 à 50%",
      D: "A changer (<35%)",
    },
    Clavier: {
      "A+": "Excellent",
      A: "Usure minime",
      B: "Usure visible",
      C: "Usure marquée",
      D: "A changer",
    },
    Touchpad: {
      "A+": "Excellent",
      A: "Usure minime",
      B: "Usure visible",
      C: "Usure marquée",
      D: "A changer",
    },
    'CPU, RAM & GPU': {
      "A+": "100% Fonctionnels",
      D: 'A changer',
    },
    'Disque dur': {
      "A+": ">85%",
      A: "75 à 85%",
      B: "50 à 75%",
      C: "35 à 50%",
      D: "A changer (<35%)",
    },
    Webcam: {
      "A+": "Parfait état",
      A: "Très bon état",
      B: "Bon état",
      C: "Tache(s)",
      D: "A changer",
      'N/A': "Non applicable",
    },
    'Hauts parleurs': {
      "A+": "Parfait état",
      A: "Bon état",
      B: "Grésillement légers",
      C: "Grésillement marqués",
      D: "A changer",
      'N/A': "Non applicable",
    },
    'Wifi/Bluetooth': {
      "A+": "100% Fonctionnel",
      D: "A changer",
      'N/A': "Non applicable",
    },
    Charnières: {
      "A+": "Parfait état",
      A: "Très bon état",
      B: "Bon état",
      C: "Etat d'usure",
      D: "A changer",
    },
    Écran: {
      "A+": "Parfait état",
      A: "Bon état / micro rayures",
      B: "Taches légères",
      C: "Taches marquées",
      D: "A changer",
    },
    Ports: {
      "A+": "Excellent",
      A: "Bon état",
      B: "Fonctionnels avec usure légère",
      C: "Défauts",
      D: "A changer",
    },
    Ventilateurs: {
      "A+": "Excellent",
      A: "Bon état",
      B: "Légère usure",
      C: "Défauts",
      D: "A changer",
    },
  };
  
  const handleSelect = (criterion, grade) => {
    setForm((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [criterion]: { grade, description: gradeDescriptions[criterion][grade] },
      },
    }));
  };

  const handleGenerate = () => {
    setSubmitted(true);
  };

  const isFormComplete = () => {
    if (!form.deviceType) return false;
    const requiredCriteria = criteriaByDevice[form.deviceType];
    return requiredCriteria.every((crit) => form.criteria[crit]?.grade);
  };
  
  
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div id="form">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Input
            placeholder="Marque & Modèle"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />
          <Input
            placeholder="Numéro de série (S/N)"
            value={form.serial}
            onChange={(e) => setForm({ ...form, serial: e.target.value })}
          />

          <div className="space-y-2">
            <label className="font-semibold">Type d'appareil :</label>
            <div className="flex gap-4">
              {Object.keys(criteriaByDevice).map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <Checkbox
                    checked={form.deviceType === type}
                    onCheckedChange={() =>
                      setForm({ ...form, deviceType: type, criteria: {} })
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {form.deviceType && (
            <div className="space-y-4">
              {criteriaByDevice[form.deviceType].map((criterion) => (
                <div key={criterion}>
                  <label className="font-semibold">{criterion}</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(gradeDescriptions[criterion]).map(
                      ([grade, description]) => (
                        <Button
                          key={grade}
                          variant={
                            form.criteria[criterion]?.grade === grade
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleSelect(criterion, grade)}
                        >
                          {description}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {form.deviceType && isFormComplete() && (
            <Button
              className="mt-4 bg-blue-600 text-white hover:bg-blue-700 w-full"
              onClick={handleGenerate}
              style={{ width: "100%" }}
            >
              Générer
            </Button>
          )}
        </CardContent>
      </Card>
      </div>
      {submitted && (
  <GradeRender
    model={form.model}
    serial={form.serial}
    deviceType={form.deviceType}
    criteria={form.criteria}
    gradeDescriptions={gradeDescriptions}
  />
)}

    </div>
  );
}
