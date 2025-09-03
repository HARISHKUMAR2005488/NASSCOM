import { FileItem, PersonalDataItem } from '../types';

export const simulateProcessing = async (
  file: FileItem,
  onProgress: (stage: string, progress: number, personalData?: PersonalDataItem[]) => void
): Promise<any> => {
  const stages = ['ocr', 'nlp', 'vision', 'redaction', 'encryption'];
  const mockPersonalData: PersonalDataItem[] = [];

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    onProgress(stage, (i / stages.length) * 100);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Generate mock personal data detection based on file type and stage
    if (stage === 'ocr') {
      const ocrData: PersonalDataItem[] = [
        {
          type: 'name',
          value: 'Dr. Sarah Johnson',
          confidence: 0.97,
          position: { x: 120, y: 80, width: 140, height: 24 }
        },
        {
          type: 'address',
          value: '1234 Medical Center Drive, Suite 200',
          confidence: 0.89,
          position: { x: 120, y: 120, width: 280, height: 20 }
        }
      ];
      mockPersonalData.push(...ocrData);
      onProgress(stage, ((i + 0.5) / stages.length) * 100, ocrData);
    }

    if (stage === 'nlp') {
      const nlpData: PersonalDataItem[] = [
        {
          type: 'email',
          value: 'sarah.johnson@medicenter.com',
          confidence: 0.95,
          position: { x: 120, y: 160, width: 220, height: 18 }
        },
        {
          type: 'phone',
          value: '(555) 987-6543',
          confidence: 0.92,
          position: { x: 120, y: 200, width: 120, height: 18 }
        },
        {
          type: 'ssn',
          value: '***-**-4567',
          confidence: 0.88,
          position: { x: 300, y: 240, width: 100, height: 18 }
        },
        {
          type: 'date',
          value: 'DOB: 03/15/1985',
          confidence: 0.91,
          position: { x: 120, y: 280, width: 130, height: 18 }
        }
      ];
      mockPersonalData.push(...nlpData);
      onProgress(stage, ((i + 0.5) / stages.length) * 100, nlpData);
    }

    if (stage === 'vision') {
      const visionData: PersonalDataItem[] = [
        {
          type: 'id_number',
          value: 'License: D123456789',
          confidence: 0.84,
          position: { x: 400, y: 100, width: 150, height: 20 }
        }
      ];
      mockPersonalData.push(...visionData);
      onProgress(stage, ((i + 0.5) / stages.length) * 100, visionData);
    }

    onProgress(stage, ((i + 1) / stages.length) * 100);
  }

  // Generate processed files (in real app, these would be actual processed files)
  const redactedFile = new Blob(['Redacted file content'], { type: file.type });
  const encryptedFile = new Blob(['Encrypted file content'], { type: 'application/octet-stream' });

  return {
    status: 'completed',
    processingProgress: 100,
    personalDataFound: mockPersonalData,
    redactedFile,
    encryptedFile,
    processingTime: Date.now() - file.uploadedAt.getTime()
  };
};