type user = {
    id: string;
    first_name: string;
    last_name: string;
    gender: 'male' | 'female';
    NID: string;
    birth_date: string;
    role: 'doctor' | 'patient'
}


export type Doctor = {
    id: string
    medical_license_number: string
    user: user
}


export type patient = {
    blood_type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
    id: string;
    user: user;
}

export type Drug = {
    id: string
    name: string
}

export type prescribedDrugs = {
    id: string
    dosage: string
    frequency: string
    drug: Drug
}

export type prescription = {
    doctor: Doctor
    id: string
    patient: patient
    prescribedDrugs: prescribedDrugs[]
    start_date: string
    status: "taking" | 'done'
}

export type analyticsApiData = {
    id: string;
    name: string;
    count: string;
};

interface classification {
    id: string
    name: string
}

interface category {
    id: string
    name: string
    description: string
}

export interface classificationApiData {
    drugAnalytics: analyticsApiData[];
    classification: classification
}

export interface CategoryApiData {
    drugAnalytics: analyticsApiData[];
    category: category
}