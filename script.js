/* =========================================================
   FLAIR — REVIEW EXPERIENCE
   ========================================================= */


/* =========================================================
   CONFIG
   ========================================================= */

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJZ0LTy84DDTkRt4Sd58nOw1s";


/* =========================================================
   STATE
   ========================================================= */

let selectedTopics = [];

let ratings = {};

let reviewText = "";


/* =========================================================
   DOM
   ========================================================= */

const screen1 =
  document.getElementById("screen1");

const screen2 =
  document.getElementById("screen2");

const screen3 =
  document.getElementById("screen3");

const loadingScreen =
  document.getElementById("loadingScreen");


const continueBtn =
  document.getElementById("continueBtn");

const createReviewBtn =
  document.getElementById("createReviewBtn");

const reviewStars =
  document.getElementById("reviewStars");

const reviewAverage =
  document.getElementById("reviewAverage");

const googleBtn =
  document.getElementById("googleBtn");

const restartBtn =
  document.getElementById("restartBtn");


const selectedCount =
  document.getElementById("selectedCount");

const summaryCount =
  document.getElementById("summaryCount");


const ratingContainer =
  document.getElementById("ratingContainer");


const generatedReview =
  document.getElementById("generatedReview");


const loadingText =
  document.getElementById("loadingText");

const loadingProgress =
  document.getElementById("loadingProgress");


/* =========================================================
   LUCIDE
   ========================================================= */

if (typeof lucide !== "undefined") {
  lucide.createIcons();
}


/* =========================================================
   SCREEN NAVIGATION
   ========================================================= */

function showScreen(screen) {

  [
    screen1,
    screen2,
    screen3,
    loadingScreen
  ].forEach(item => {

    if (item) {
      item.classList.remove("active");
    }

  });


  if (screen) {
    screen.classList.add("active");
  }

}


/* =========================================================
   STEP HEADER
   ========================================================= */

const steps = [
  document.getElementById("step1"),
  document.getElementById("step2"),
  document.getElementById("step3")
];


function updateSteps(currentStep) {

  steps.forEach((step, index) => {

    if (!step) return;


    const number =
      step.querySelector(".step-number");


    step.classList.remove(
      "active",
      "completed"
    );


    const stepNumber =
      index + 1;


    if (stepNumber < currentStep) {

      step.classList.add(
        "completed"
      );

      if (number) {
        number.textContent = "✓";
      }

    }

    else if (stepNumber === currentStep) {

      step.classList.add(
        "active"
      );

      if (number) {
        number.textContent =
          stepNumber;
      }

    }

    else {

      if (number) {
        number.textContent =
          stepNumber;
      }

    }

  });

}


/* =========================================================
   SCREEN 1 — SELECT EXPERIENCE
   ========================================================= */

const optionButtons =
  document.querySelectorAll(
    ".experience-option"
  );


optionButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const topic =
        button.dataset.topic;


      const isSelected =
        button.classList.toggle(
          "selected"
        );


      if (isSelected) {

        if (
          !selectedTopics.includes(topic)
        ) {

          selectedTopics.push(topic);

        }

      }

      else {

        selectedTopics =
          selectedTopics.filter(
            item =>
              item !== topic
          );

      }


      updateSelection();

    }
  );

});


/* =========================================================
   UPDATE SELECTION
   ========================================================= */

function updateSelection() {

  const count =
    selectedTopics.length;


  if (selectedCount) {

    selectedCount.textContent =
      `${count} SELECTED`;

  }


  if (summaryCount) {

    summaryCount.textContent =
      count;

  }


  if (continueBtn) {

    continueBtn.disabled =
      count === 0;

  }

}


/* =========================================================
   GO TO RATING SCREEN
   ========================================================= */

if (continueBtn) {

  continueBtn.addEventListener(
    "click",
    () => {

      if (
        selectedTopics.length === 0
      ) {

        return;

      }


      buildRatingScreen();


      updateSteps(2);

      showScreen(screen2);

    }
  );

}


/* =========================================================
   SCREEN 2 — BUILD RATINGS
   ========================================================= */

function buildRatingScreen() {

  if (!ratingContainer) {
    return;
  }


  ratingContainer.innerHTML = "";

  ratings = {};


  selectedTopics.forEach(topic => {

    const option =
      document.querySelector(
        `[data-topic="${topic}"]`
      );


    if (!option) {
      return;
    }


    const description =
      option.dataset.description || "";


    /*
      IMPORTANT:
      Customer MUST manually select stars.
      Default = 0
    */

    ratings[topic] = 0;


    const row =
      document.createElement("div");


    row.className =
      "rating-row";


    row.innerHTML = `

      <div class="rating-info">

        <div>

          <div class="rating-topic">
            ${topic}
          </div>

          <div class="rating-description">
            ${description}
          </div>

        </div>

      </div>


      <div class="stars-row">

        ${[1, 2, 3, 4, 5]
          .map(number => `

            <button
              type="button"
              class="star"
              data-topic="${topic}"
              data-rating="${number}"
              aria-label="${number} stars"
            >

              <i data-lucide="star"></i>

            </button>

          `)
          .join("")
        }

      </div>

    `;


    ratingContainer.appendChild(row);

  });


  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }


  attachRatingListeners();

  updateCreateButton();

}


/* =========================================================
   STAR CLICK
   ========================================================= */

function attachRatingListeners() {

  const stars =
    document.querySelectorAll(
      ".star"
    );


  stars.forEach(star => {

    star.addEventListener(
      "click",
      () => {

        const topic =
          star.dataset.topic;


        const rating =
          Number(
            star.dataset.rating
          );


        ratings[topic] =
          rating;


        const topicStars =
          document.querySelectorAll(
            `.star[data-topic="${topic}"]`
          );


        topicStars.forEach(item => {

          const value =
            Number(
              item.dataset.rating
            );


          item.classList.toggle(
            "active",
            value <= rating
          );

        });


        updateCreateButton();

      }
    );

  });

}


/* =========================================================
   ENABLE CREATE REVIEW BUTTON
   ONLY WHEN EVERY SELECTED OPTION IS RATED
   ========================================================= */

function updateCreateButton() {

  if (!createReviewBtn) {
    return;
  }


  const allRated =
    selectedTopics.length > 0 &&
    selectedTopics.every(
      topic =>
        ratings[topic] >= 1
    );


  createReviewBtn.disabled =
    !allRated;

}


/* =========================================================
   CREATE REVIEW
   ========================================================= */

if (createReviewBtn) {

  createReviewBtn.addEventListener(
    "click",
    () => {

      if (
        createReviewBtn.disabled
      ) {

        return;

      }


      /*
        Generate review
      */

      reviewText =
        generateReview();


      /*
        Show review
      */

      if (generatedReview) {

        generatedReview.textContent =
          reviewText;

      }


      /*
        Calculate average rating
      */

      const totalStars =
        selectedTopics.reduce(
          (sum, topic) =>
            sum + ratings[topic],
          0
        );


      const averageRating =
        totalStars /
        selectedTopics.length;


      /*
        Show actual average
      */

      updateReviewRating(
        averageRating
      );


      /*
        Move to final screen
      */

      updateSteps(3);

      showScreen(screen3);

    }
  );

}


/* =========================================================
   REVIEW RATING DISPLAY
   ========================================================= */

function updateReviewRating(average) {

  if (
    !reviewStars ||
    !reviewAverage
  ) {

    return;

  }


  /*
    Round to nearest half
  */

  const rounded =
    Math.round(
      average * 2
    ) / 2;


  let stars = "";


  /*
    Build visual stars
  */

  for (
    let i = 1;
    i <= 5;
    i++
  ) {

    if (rounded >= i) {

      stars += "★";

    }

    else if (
      rounded >= i - 0.5
    ) {

      stars += "½";

    }

    else {

      stars += "☆";

    }

  }


  reviewStars.textContent =
    stars;


  reviewAverage.textContent =
    `${average.toFixed(1)} / 5`;

}


/* =========================================================
   REVIEW GENERATOR
   ========================================================= */

function generateReview() {

  /*
    Calculate average
  */

  const average =
    selectedTopics.reduce(
      (sum, topic) =>
        sum + ratings[topic],
      0
    ) / selectedTopics.length;


  /* =====================================================
     OPENING
  ===================================================== */

  let opening = "";


  if (average >= 4.5) {

    opening =
      random([
        "Had a really great experience at Flair.",
        "Had a lovely evening at Flair in Punjabi Bagh.",
        "Really enjoyed my visit to Flair.",
        "Had a great time at Flair, Punjabi Bagh."
      ]);

  }

  else if (average >= 3.5) {

    opening =
      random([
        "Had a good experience at Flair, Punjabi Bagh.",
        "Overall, had a pleasant evening at Flair.",
        "Visited Flair around Club Road and had a good experience.",
        "Had a nice time at Flair and enjoyed the overall atmosphere."
      ]);

  }

  else if (average >= 2.5) {

    opening =
      random([
        "Had a mixed experience at Flair, Punjabi Bagh.",
        "Visited Flair recently and felt the experience was okay overall.",
        "My experience at Flair was decent, although there are a few areas that could improve.",
        "Had an average experience at Flair around Club Road."
      ]);

  }

  else {

    opening =
      random([
        "Visited Flair in Punjabi Bagh and unfortunately the experience was below expectations.",
        "My recent experience at Flair was not the best.",
        "Visited Flair around Club Road and felt there was room for improvement.",
        "The overall experience at Flair could have been better."
      ]);

  }


  /* =====================================================
     TOPIC FEEDBACK
  ===================================================== */

  const positive = [];

  const neutral = [];

  const negative = [];


  selectedTopics.forEach(topic => {

    const rating =
      ratings[topic];


    if (rating >= 4) {

      positive.push(
        getPositiveSentence(
          topic,
          rating
        )
      );

    }

    else if (rating === 3) {

      neutral.push(
        getNeutralSentence(topic)
      );

    }

    else {

      negative.push(
        getNegativeSentence(topic)
      );

    }

  });


  /* =====================================================
     KEEP REVIEW SHORT
  ===================================================== */

  const bodyParts = [];


  /*
    Prefer maximum 2 topic sentences.
    This prevents very long reviews.
  */

  if (positive.length) {

    bodyParts.push(
      ...positive.slice(0, 2)
    );

  }


  if (
    bodyParts.length < 2 &&
    neutral.length
  ) {

    bodyParts.push(
      neutral[0]
    );

  }


  if (
    bodyParts.length < 2 &&
    negative.length
  ) {

    bodyParts.push(
      negative[0]
    );

  }


  let body =
    bodyParts.join(" ");


  /* =====================================================
     NATURAL LOCATION CONTEXT
  ===================================================== */

  if (
    Math.random() > 0.45
  ) {

    body +=
      " " +
      random([
        "The Punjabi Bagh location is convenient.",
        "The Club Road area is a nice setting.",
        "Flair is a decent option around Punjabi Bagh."
      ]);

  }


  /* =====================================================
     PRICE COMMENT
  ===================================================== */

  const priceTopicSelected =
    selectedTopics.includes("Food") ||
    selectedTopics.includes("Drinks");


  if (
    priceTopicSelected &&
    average >= 3 &&
    Math.random() > 0.5
  ) {

    body +=
      " " +
      random([
        "The prices also felt reasonable.",
        "Pricing was quite good for the overall experience.",
        "The prices are decent considering the location.",
        "I found the pricing to be fair overall."
      ]);

  }


  /* =====================================================
     ENDING
  ===================================================== */

  let ending = "";


  if (average >= 4.5) {

    ending =
      random([
        "Would definitely visit again.",
        "Overall, a place I'd happily come back to.",
        "Would recommend it for an evening with friends.",
        "Definitely worth checking out if you're around Punjabi Bagh."
      ]);

  }

  else if (average >= 3.5) {

    ending =
      random([
        "Overall, a good place for an evening with friends.",
        "Would consider visiting again.",
        "Overall, a pleasant experience and worth trying.",
        "A decent option for a night out in Punjabi Bagh."
      ]);

  }

  else if (average >= 2.5) {

    ending =
      random([
        "With a little improvement, the overall experience could be much better.",
        "There is definitely potential to make the experience stronger.",
        "A few improvements could make this a much better experience.",
        "Overall, it was okay but there is room for improvement."
      ]);

  }

  else {

    ending =
      random([
        "Hopefully the areas mentioned improve on the next visit.",
        "I hope the experience becomes more consistent in the future.",
        "With some improvements, the overall experience could be better.",
        "Would be interested in visiting again if these areas improve."
      ]);

  }


  /*
    Final review
  */

  return (
    opening +
    " " +
    body +
    " " +
    ending
  );

}


/* =========================================================
   POSITIVE TOPIC SENTENCES
   ========================================================= */

function getPositiveSentence(
  topic,
  rating
) {

  const strong =
    rating >= 5;


  const data = {

    Food: strong
      ? random([
          "The food was delicious and well presented.",
          "Really enjoyed the food and overall presentation.",
          "The food was one of the highlights of the visit."
        ])
      : random([
          "The food was quite good overall.",
          "The food was enjoyable and nicely presented.",
          "The food was a good part of the experience."
        ]),


    Drinks: strong
      ? random([
          "The drinks were really well made.",
          "Really enjoyed the drinks and selection.",
          "The drinks were definitely a highlight."
        ])
      : random([
          "The drinks were good overall.",
          "The drinks were quite nice."
        ]),


    Ambience: strong
      ? random([
          "The ambience was stylish and inviting.",
          "Really liked the ambience and overall setting.",
          "The atmosphere was one of my favourite parts."
        ])
      : random([
          "The ambience was pleasant.",
          "The overall setting was quite nice."
        ]),


    Music: strong
      ? random([
          "The music created a really good energy.",
          "The music suited the overall vibe very well.",
          "Really enjoyed the music and atmosphere."
        ])
      : random([
          "The music was good and added to the atmosphere.",
          "The music was fairly enjoyable."
        ]),


    Service: strong
      ? random([
          "The service was attentive and smooth.",
          "The service was really good throughout the visit.",
          "The service team was attentive and helpful."
        ])
      : random([
          "The service was generally good.",
          "The service was quite satisfactory."
        ]),


    Staff: strong
      ? random([
          "The staff were warm and welcoming.",
          "The staff were friendly and professional.",
          "The team was very courteous."
        ])
      : random([
          "The staff were generally polite.",
          "The staff were friendly enough."
        ]),


    Vibe: strong
      ? random([
          "The overall vibe was lively and stylish.",
          "Really liked the energy of the place.",
          "The overall club vibe was great."
        ])
      : random([
          "The overall vibe was quite good.",
          "The place had a decent club atmosphere."
        ]),


    Experience: strong
      ? random([
          "The overall experience was memorable.",
          "Overall, it was a really enjoyable experience.",
          "The whole evening came together nicely."
        ])
      : random([
          "The overall experience was good.",
          "Overall, I had a pleasant experience."
        ])

  };


  return data[topic] || "";

}


/* =========================================================
   NEUTRAL TOPIC SENTENCES
   ========================================================= */

function getNeutralSentence(topic) {

  const data = {

    Food:
      random([
        "The food was decent, although a little more consistency would help.",
        "The food was okay overall, but there is room to improve.",
        "The food was satisfactory but could be a little better."
      ]),


    Drinks:
      random([
        "The drinks were okay, although the selection could be stronger.",
        "The drinks were decent but could use a little more consistency."
      ]),


    Ambience:
      random([
        "The ambience was decent, although it could feel more polished.",
        "The setting was nice but could be improved in some areas."
      ]),


    Music:
      random([
        "The music was okay, although the selection could be more consistent.",
        "The music was decent but could have suited the vibe better."
      ]),


    Service:
      random([
        "The service was okay, although it could be a little more attentive.",
        "The service was satisfactory but could be quicker at times."
      ]),


    Staff:
      random([
        "The staff were polite, although the service could be more consistent.",
        "The staff were decent but there is some room for improvement."
      ]),


    Vibe:
      random([
        "The overall vibe was decent but could be more consistent.",
        "The club atmosphere was okay, although it could feel more energetic."
      ]),


    Experience:
      random([
        "The overall experience was okay but could be improved.",
        "It was a decent experience, although a few things could be better."
      ])

  };


  return data[topic] || "";

}


/* =========================================================
   CONSTRUCTIVE NEGATIVE SENTENCES
   ========================================================= */

function getNegativeSentence(topic) {

  const data = {

    Food:
      random([
        "The food could have been better and felt a little inconsistent.",
        "The food was not quite up to expectations, although there is room to improve.",
        "The food was okay but could definitely be improved in taste and consistency."
      ]),


    Drinks:
      random([
        "The drinks could have been better and the selection felt a little limited.",
        "The drinks were not quite up to expectations, though there is potential to improve."
      ]),


    Ambience:
      random([
        "The ambience could use some improvement to make the experience feel more polished.",
        "The setting was okay but did not fully match expectations."
      ]),


    Music:
      random([
        "The music could have been better suited to the overall atmosphere.",
        "The music was not quite consistent with the vibe I expected."
      ]),


    Service:
      random([
        "The service could be more attentive and consistent.",
        "The service was a little slow at times and could be improved."
      ]),


    Staff:
      random([
        "The staff could be a little more attentive and proactive.",
        "The team was polite, although the service could feel more consistent."
      ]),


    Vibe:
      random([
        "The overall club vibe could be more energetic and consistent.",
        "The atmosphere could use a little more attention to make the experience stronger."
      ]),


    Experience:
      random([
        "The overall experience could have been better and needs more consistency.",
        "There are a few areas that could be improved to make the experience stronger."
      ])

  };


  return data[topic] || "";

}


/* =========================================================
   RANDOMIZER
   ========================================================= */

function random(array) {

  if (
    !Array.isArray(array) ||
    array.length === 0
  ) {

    return "";

  }


  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];

}


/* =========================================================
   COPY + OPEN GOOGLE
   ========================================================= */

if (googleBtn) {

  googleBtn.addEventListener(
    "click",
    async () => {

      /*
        Show loading first
      */

      showScreen(
        loadingScreen
      );


      updateSteps(3);


      /*
        Copy review
      */

      await copyReview();


      /*
        Loading animation
      */

      await runLoading();


      /*
        Open Google Review
      */

      window.location.href =
        GOOGLE_REVIEW_URL;

    }
  );

}


/* =========================================================
   COPY REVIEW
   ========================================================= */

async function copyReview() {

  try {

    if (
      navigator.clipboard &&
      window.isSecureContext
    ) {

      await navigator.clipboard.writeText(
        reviewText
      );

      return;

    }


    fallbackCopy(
      reviewText
    );

  }

  catch (error) {

    console.log(
      "Clipboard API unavailable:",
      error
    );


    fallbackCopy(
      reviewText
    );

  }

}


/* =========================================================
   FALLBACK COPY
   ========================================================= */

function fallbackCopy(text) {

  const textarea =
    document.createElement(
      "textarea"
    );


  textarea.value =
    text;


  textarea.style.position =
    "fixed";


  textarea.style.left =
    "-9999px";


  textarea.style.opacity =
    "0";


  document.body.appendChild(
    textarea
  );


  textarea.focus();

  textarea.select();


  try {

    document.execCommand(
      "copy"
    );

  }

  catch (error) {

    console.log(
      "Fallback copy failed:",
      error
    );

  }


  textarea.remove();

}


/* =========================================================
   LOADING SCREEN
   ========================================================= */

function runLoading() {

  return new Promise(
    resolve => {

      let progress = 0;

      let messageIndex = 0;


      const messages = [

        "Copying your review...",

        "Preparing Google Reviews...",

        "Almost there..."

      ];


      if (loadingText) {

        loadingText.textContent =
          messages[0];

      }


      if (loadingProgress) {

        loadingProgress.style.width =
          "0%";

      }


      const interval =
        setInterval(
          () => {

            progress += 4;


            if (loadingProgress) {

              loadingProgress.style.width =
                `${progress}%`;

            }


            if (
              progress >= 30 &&
              messageIndex === 0
            ) {

              messageIndex = 1;


              if (loadingText) {

                loadingText.textContent =
                  messages[1];

              }

            }


            if (
              progress >= 70 &&
              messageIndex === 1
            ) {

              messageIndex = 2;


              if (loadingText) {

                loadingText.textContent =
                  messages[2];

              }

            }


            if (
              progress >= 100
            ) {

              clearInterval(
                interval
              );


              setTimeout(
                resolve,
                180
              );

            }

          },
          80
        );

    }
  );

}


/* =========================================================
   RESTART
   ========================================================= */

if (restartBtn) {

  restartBtn.addEventListener(
    "click",
    restart
  );

}


function restart() {

  /*
    Reset state
  */

  selectedTopics = [];

  ratings = {};

  reviewText = "";


  /*
    Reset option buttons
  */

  optionButtons.forEach(
    button => {

      button.classList.remove(
        "selected"
      );

    }
  );


  /*
    Reset ratings
  */

  if (ratingContainer) {

    ratingContainer.innerHTML =
      "";

  }


  /*
    Reset final review
  */

  if (generatedReview) {

    generatedReview.textContent =
      "";

  }


  /*
    Reset displayed rating
  */

  if (reviewStars) {

    reviewStars.textContent =
      "☆☆☆☆☆";

  }


  if (reviewAverage) {

    reviewAverage.textContent =
      "0.0 / 5";

  }


  /*
    Reset selection
  */

  updateSelection();


  /*
    Reset button
  */

  if (createReviewBtn) {

    createReviewBtn.disabled =
      true;

  }


  /*
    Back to first screen
  */

  updateSteps(1);

  showScreen(screen1);

}


/* =========================================================
   INITIALIZE
   ========================================================= */

updateSelection();

updateSteps(1);