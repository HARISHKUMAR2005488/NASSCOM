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
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Generate mock personal data detection
    if (stage === 'nlp') {
      const mockData: PersonalDataItem[] = [
        {
          type: 'name',
          value: 'John Smith',
          confidence: 0.95,
          position: { x: 100, y: 150, width: 80, height: 20 }
        },
        {
          type: 'email',
          value: 'john.smith@email.com',
          confidence: 0.88,
          position: { x: 200, y: 200, width: 150, height: 20 }
        },
        {
          type: 'phone',
          value: '(555) 123-4567',
          confidence: 0.92,
          position: { x: 150, y: 250, width: 100, height: 20 }
        }
      ];
      mockPersonalData.push(...mockData);
      onProgress(stage, ((i + 0.5) / stages.length) * 100, mockData);
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