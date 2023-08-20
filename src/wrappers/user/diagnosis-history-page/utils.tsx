const finishedConsultation = ['finish', 'resolved', 'resolved_by_system', 'resolved_by_doctor'];
const unfinishedConsultation = ['doctor_not_found', 'abandoned_by_doctor', 'abandoned_by_patient'];

const consultationStatus: any = {
  finished: {
    variant: 'success',
    text: 'Konsultasi Selesai',
  },
  unfinished: {
    variant: 'danger',
    text: 'Konsultasi Tidak Selesai',
  },
};

const checkConsultationStatus = (state: string) => {
  if (finishedConsultation.includes(state)) {
    return 'finished';
  } else if (unfinishedConsultation.includes(state)) {
    return 'unfinished';
  }
};

export const consultationStatusColor = (state: string) =>
  checkConsultationStatus(state) === 'finished'
    ? consultationStatus.finished.variant
    : consultationStatus.unfinished.variant;
export const consultationStatusText = (state: string) =>
  checkConsultationStatus(state) === 'finished' ? consultationStatus.finished.text : consultationStatus.unfinished.text;
