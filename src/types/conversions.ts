export type ConversionResult = {
  fileId: string;
  filename: string;
  size?: number;
} | null;

export type RawConversionResponse = {
  file_id?: string;
  fileId?: string;
  id?: string;
  filename?: string;
  size?: number;
};
