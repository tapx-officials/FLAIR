"use strict";


/*
    FLAIR — PAYMENT NOTICE

    Payment is now QR-only.

    QR image:
    qr.png

    QR contains the ₹1,500 payment details.
*/


/* =================================
   PAYMENT INFORMATION
================================= */

const UPI_ID = "9910106056@ibl";
const PAYMENT_AMOUNT = "1500";


/* =================================
   QR VALIDATION
================================= */

const qrImage =
  document.querySelector(".qr-image");


if (qrImage) {
  
  qrImage.addEventListener(
    "error",
    function() {
      
      console.error(
        "FLAIR QR image could not be loaded."
      );
      
    }
  );
  
}


/* =================================
   PREVENT CONTEXT MENU
================================= */

document.addEventListener(
  "contextmenu",
  function(event) {
    
    event.preventDefault();
    
  }
);


/* =================================
   KEEP PAYMENT NOTICE ON BACK
================================= */

history.pushState(
  null,
  "",
  location.href
);


window.addEventListener(
  "popstate",
  function() {
    
    history.pushState(
      null,
      "",
      location.href
    );
    
  }
);
