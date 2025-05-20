export const GenerateReferralCode = () => {
  const prefix = "INEX";
  let randomDigits = "";
  for (let i = 0; i < 6; i++) {
    randomDigits += Math.floor(Math.random() * 10); // 0-9
  }
  return prefix + randomDigits;
};

export const GenerateWithdrawalCode = () => {
  const prefix = "WTDR";
  let randomDigits = "";
  for (let i = 0; i < 6; i++) {
    randomDigits += Math.floor(Math.random() * 10); // 0-9
  }
  return prefix + randomDigits;
};

// export const GenerateRechargeCode = () => {
//   const prefix = "TRCN";
//   let randomDigits = "";
//   for (let i = 0; i < 6; i++) {
//     randomDigits += Math.floor(Math.random() * 10); // 0-9
//   }
//   return prefix + randomDigits;
// };
