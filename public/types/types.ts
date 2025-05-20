export type User = {
  NID: string;
  first_name: string;
  last_name: string;
  gender: string;
  id: string;
  role: "doctor" | "admin" | "patient";
  birth_date: string;
};

export type Doctor = {
  id: string;
  medical_license_number: string;
  user: User;
};

export type Patient = {
  blood_type:
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-"
    | "Unknown";
  id: string;
  user: User;
};

export type Drug = {
  id: string;
  name: string;
};

export type PrescribedDrugs = {
  id: string;
  dosage: string;
  frequency: string;
  drug: Drug;
  time: "before" | "after";
};

export type Prescription = {
  doctor: Doctor;
  id: string;
  patient: Patient;
  prescribedDrugs: PrescribedDrugs[];
  start_date: string;
  status: "taking" | "done";
  description: string | null;
};

export type analyticsApiData = {
  id: string;
  name: string;
  count: string;
};

interface classification {
  id: string;
  name: string;
}

interface category {
  id: string;
  name: string;
  description: string;
}

export interface classificationApiData {
  drugAnalytics: analyticsApiData[];
  classification: classification;
}

export interface CategoryApiData {
  drugAnalytics: analyticsApiData[];
  category: category;
}
