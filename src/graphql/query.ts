import { gql } from '@apollo/client';

export const ORDER = gql`
  query getOrderDetail($id: Uuid!) {
    order(id: $id) {
      id
      email
      state
      prescription_number
      patient_name
      delivery {
        provider_name
        tracking
        driver_name
      }
      item_total
      delivery_total
      admin_fee
      payment_total
      patient_id
      patient_name
      prescription {
        id
        client_supply_logo
        client_logo
        medicine_prescriptions {
          amount
          amount_unit
          medicine {
            brand
          }
        }
      }
      store {
        name
        address
      }
      payments {
        id
        number
        payment_method {
          name
        }
        state
      }
      delivery {
        delivered_at
      }
      bill_address {
        label
        address_location
        address_detail
        phone
      }
      line_items {
        price
        total_price
        quantity
        variant {
          name
          medicine_reference_name
          description
        }
      }
      arrival_date_estimation
      created_at
      updated_at
    }
    paymentMethod(id: $id) {
      name
    }
  }
`;

export const ORDER_HISTORY = gql`
  query getOrderDetail($id: Uuid!) {
    order(id: $id) {
      rejection_reason
      history {
        state
        description
        updated_at
      }
    }
  }
`;
