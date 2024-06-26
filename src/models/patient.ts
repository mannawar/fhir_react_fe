export interface PatientModel {
    id?: string;
    resourceType: "Patient";
    name: Array<{
        use?: string;
        family: string;
        given: string[];
    }>;
    gender?: string;
    birthDate?: string;
}

export interface BundleEntry<T>{
    fullUrl:string;
    resource: T;
}

export interface Bundle<T> {
    resourceType: "Bundle";
    type: string;
    entry: BundleEntry<T>[];
}