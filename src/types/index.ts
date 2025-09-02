export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  originalFile?: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  uploadedAt: Date;
  personalDataFound: PersonalDataItem[];
  processingProgress: number;
  redactedFile?: Blob;
  encryptedFile?: Blob;
  processingTime?: number;
}

export interface PersonalDataItem {
  type: 'name' | 'email' | 'phone' | 'ssn' | 'address' | 'date' | 'id_number';
  value: string;
  confidence: number;
  position: { x: number; y: number; width: number; height: number };
}

export interface RedactionSettings {
  blurIntensity: number;
  redactionColor: string;
  ocrEnabled: boolean;
  nlpEnabled: boolean;
  visionEnabled: boolean;
  encryptionEnabled: boolean;
  personalDataTypes: string[];
}