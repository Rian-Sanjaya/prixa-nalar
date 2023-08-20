export interface PatientType {
  client_app_id: string;
  created_at: string;
  deleted_at: string;
  dependence_status: string;
  external_user_id: string;
  id: string;
  patient_address: string;
  patient_age: number;
  patient_bearer: string;
  patient_block_status: number;
  patient_card_number: string;
  patient_class: string;
  patient_dob: string;
  patient_email: string;
  patient_f_name: string;
  patient_gender: 'm' | 'f';
  patient_height: number;
  patient_l_name: string;
  patient_organization: string;
  patient_phone: string | number;
  patient_rating_avg: number;
  patient_rating_qty: number;
  patient_vip_status: number;
  patient_weight: number;
  precondition_id: string;
  pubsub_token: {
    id: string;
    pubsub_token: string;
  };
  updated_at: string;
  user_pubsub_token: string;
}
