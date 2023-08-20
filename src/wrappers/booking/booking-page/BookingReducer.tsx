const Reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_DOCTOR_DATA':
      return {
        ...state,
        doctorData: action.payload,
      };
    case 'SET_DATE':
      return {
        ...state,
        date: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
