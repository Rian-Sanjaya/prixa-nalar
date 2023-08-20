export const diseaseAccuracyMap = {
  high: 'tinggi',
  medium: 'sedang',
  low: 'rendah',
};

export const diseaseAccuracyDescMap = {
  [diseaseAccuracyMap.high]: 'Kemungkinan Tinggi',
  [diseaseAccuracyMap.medium]: 'Kemungkinan Sedang',
  [diseaseAccuracyMap.low]: 'Kemungkinan Rendah',
};

export const priority = {
  homecare: 1,
  opd: 2,
};

export const triageMessage = {
  homecare: {
    boxColor: 'secondary',
    titleSummary: 'Pasien dengan keluhan serupa biasanya tidak memerlukan pemeriksaan langsung oleh dokter.',
    detailSummary:
      'Namun, segera konsultasikan dengan dokter dalam 2-3 hari ke depan jika kondisi kesehatan memburuk atau ada keluhan lain yang dirasakan.',
  },
  opd: {
    boxColor: 'danger',
    titleSummary: 'Pasien dengan keluhan serupa biasanya memerlukan pemeriksaan langsung oleh dokter.',
    detailSummary:
      'Hubungi rumah sakit, klinik, atau fasilitas layanan kesehatan terdekat untuk mendapatkan penanganan lebih lanjut.',
  },
};

export const triageType = {
  homecare: 'Homecare',
  opd: 'OPD',
  poly: 'Poli Klinik',
  ugd: 'UGD',
};

export const classifyIconColor = {
  [diseaseAccuracyMap.high]: 'primary',
  [diseaseAccuracyMap.medium]: 'secondary',
};

export const classifyTextColor: any = {
  [diseaseAccuracyMap.high]: 'pagesubtitle',
  [diseaseAccuracyMap.medium]: 'feedbackLink2',
};
