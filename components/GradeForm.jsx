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

  const criteriaByDevice = {
    "PC Portable": [
      "Chassis",
      "Batterie",
      "Clavier",
      "Touchpad",
      "Composants",
      "Écran",
      "Ports",
      "Ventilateurs",
    ],
    "Tout-en-Un": [
      "Chassis",
      "Composants",
      "Écran",
      "Ports",
      "Ventilateurs",
    ],
    "PC Fixe": ["Chassis", "Composants", "Ports", "Ventilateurs"],
  };

  const gradeDescriptions = {
    Chassis: {
      "A+": "Aucune ou micro rayures",
      A: "Légères rayures",
      B: "Rayures visibles",
      C: "Rayures marquées",
    },
    Batterie: {
      "A+": ">85%",
      A: "75 à 85%",
      B: "50 à 75%",
      C: "<50%",
    },
    Clavier: {
      "A+": "Excellent",
      A: "Usure minime",
      B: "Usure visible",
      C: "Usure marquée",
    },
    Touchpad: {
      "A+": "Excellent",
      A: "Usure minime",
      B: "Usure visible",
      C: "Usure marquée",
    },
    Composants: {
      "A+": "100% Fonctionnels",
      A: "100% Fonctionnels",
      B: "100% Fonctionnels",
      C: "100% Fonctionnels",
    },
    Écran: {
      "A+": "Parfait état",
      A: "Bon état",
      B: "Bon état",
      C: "Micro rayures",
    },
    Ports: {
      "A+": "Excellent",
      A: "Bon état",
      B: "Fonctionnels avec usure minime",
      C: "Défauts",
    },
    Ventilateurs: {
      "A+": "Excellent",
      A: "Bon état",
      B: "Légère usure",
      C: "Défauts",
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

          {form.deviceType && (
            <Button className="mt-4" onClick={handleGenerate}>
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
