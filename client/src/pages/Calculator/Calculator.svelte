<script>
  import { onMount } from "svelte";
  import CalculatorBtn from "../../components/CalculatorBtn.svelte";
  import {
    calculateDailyGrams,
    calculateMealComposition,
    calculateTotalGrams,
  } from "../../utils/calculator.js";

  let dogAgeSelected = false;
  let dogWeightEntered = false;
  let dogActivitySelected = false;
  let dogBonePercentageSelected = false;
  let bonePercentageValue;
  let selectedBonePercentage;
  let ageValue;
  let weightValue = 0;
  let activityValue;
  let selectedDogActivity;
  let selectedAge;
  let dailyGrams;
  let boneContentValue;
  let selectedBoneContent;
  let dogBoneSelected;
  let mealContent;
  let weekMealContent;
  let selectedTimePeriod;



  $: if (weightValue > 0 && selectedDogActivity && ageValue) {
    activityValue = getActivityValue(selectedDogActivity);
    dailyGrams = calculateDailyGrams(weightValue, activityValue);
  }

  $: if (dogBoneSelected && dogBonePercentageSelected) {
    mealContent = calculateMealComposition(
      dailyGrams,
      bonePercentageValue,
      boneContentValue
    );
  }

  $: if (mealContent && selectedTimePeriod) {
    weekMealContent = calculateTotalGrams(mealContent, selectedTimePeriod);
  }



  function getActivityValue(activityLevel) {
    const ageActivityMap = {
      1: {
        "not-very-active": 0.02,
        "somewhat-active": 0.025,
        "very-active": 0.03,
      },
      4: {
        "not-very-active": 0.06,
        "somewhat-active": 0.07,
        "very-active": 0.08,
      },
      7: {
        "not-very-active": 0.05,
        "somewhat-active": 0.06,
        "very-active": 0.07,
      },
      9: {
        "not-very-active": 0.03,
        "somewhat-active": 0.04,
        "very-active": 0.05,
      },
    };

    return ageActivityMap[ageValue][activityLevel];
  }

  function handleActivityButtonClick(activityLevel) {
    selectedDogActivity = activityLevel;
    activityValue = getActivityValue(activityLevel);
    dogActivitySelected = true;
  }

  function handleAgeButtonClick(ageLabel, ageVal) {
    dogAgeSelected = true;
    selectedAge = ageLabel;
    ageValue = ageVal;
  }

  function handleBonePercentageButtonClick(bonePercentage, boneVal) {
    dogBonePercentageSelected = true;
    selectedBonePercentage = bonePercentage;
    bonePercentageValue = boneVal;
  }

  function handleBoneContentButtonClick(boneContent, boneVal) {
    dogBoneSelected = true;
    selectedBoneContent = boneContent;
    boneContentValue = boneVal;
  }

  function handleTimePeriodButtonClick(event) {
    selectedTimePeriod = parseInt(event.currentTarget.dataset.value, 10);
    calculateTotalGrams(mealContent, selectedTimePeriod);
  }

  function scrollTo(event) {
    event.target.scrollIntoView({ behavior: "smooth" });
  }



  onMount(() => {
    document.title = "Calculator || Pawgress";
  });
  
</script>

<div class="dashboard-container">
  <div class="flex-row">
    <div>
      <h2>BARF Calculator - Meal Prep Assistant</h2>
      <p class="intro">
        How much should I feed my dog? How do I formulate my dog's meals? Our
        Raw Dog Food Calculator is the easiest way to plan your dog's food. It's
        designed to help you estimate how much fresh food to feed your dog daily
        and create your meal plan based on your fresh ingredients.
      </p>
    </div>

    <img
      src="dog-eating.svg"
      alt="dog-eating-illustration"
    />
  </div>

  <div class="section">
    <h3>How old is your dog?</h3>
    <div class="flex-row">
      <CalculatorBtn
        label="Puppy 4-6m"
        value="4-6"
        selected={selectedAge === "4-6"}
        handleClick={() => handleAgeButtonClick("4-6", 4)}
      />

      <CalculatorBtn
        label="Puppy 7-9m"
        value="7-9"
        selected={selectedAge === "7-9"}
        handleClick={() => handleAgeButtonClick("7-9", 7)}
      />

      <CalculatorBtn
        label="Puppy 9-12m"
        value="9-12"
        selected={selectedAge === "9-12"}
        handleClick={() => handleAgeButtonClick("9-12", 9)}
      />
      <CalculatorBtn
        label="Adult"
        value="Adult"
        selected={selectedAge === "Adult"}
        handleClick={() => handleAgeButtonClick("Adult", 1)}
      />
    </div>
  </div>
  {#if ageValue}
    <div class="section">
      <h3>What is your dog's current weight?</h3>
      <div class="flex-row weight">
        <input
          type="number"
          bind:value={weightValue}
          min="1"
          on:change={() => {
            dogWeightEntered = true;
          }}
        />
        <p>kg</p>
      </div>
    </div>
  {/if}

  {#if weightValue > 0}
    <div
      class="section"
      on:click={scrollTo}
      on:keydown={scrollTo}
    >
      <h3>How active is your dog?</h3>
      <div>
        <CalculatorBtn
          label="Not very active"
          value="not-very-active"
          selected={selectedDogActivity === "not-very-active"}
          handleClick={() => handleActivityButtonClick("not-very-active")}
        />
        <CalculatorBtn
          label="Somewhat-active"
          value="somewhat-active"
          selected={selectedDogActivity === "somewhat-active"}
          handleClick={() => handleActivityButtonClick("somewhat-active")}
        />
        <CalculatorBtn
          label="Very active"
          value="very-active"
          selected={selectedDogActivity === "very-active"}
          handleClick={() => handleActivityButtonClick("very-active")}
        />
      </div>
    </div>
  {/if}

  {#if dogActivitySelected}
    <div
      class="section"
      on:click={scrollTo}
      on:keydown={scrollTo}
    >
      <h3>You should feed your dog:</h3>
      <h2>{dailyGrams}g/day</h2>
    </div>

    <div
      class="section"
      on:click={scrollTo}
      on:keydown={scrollTo}
    >
      <h3>How much bone will you feed daily?</h3>
      <div>
        <CalculatorBtn
          label="10%"
          value="10%"
          selected={selectedBonePercentage === "10%"}
          handleClick={() => handleBonePercentageButtonClick("10%", 0.1)}
        />

        <CalculatorBtn
          label="12% (recommended)"
          value="12%"
          selected={selectedBonePercentage === "12%"}
          handleClick={() => handleBonePercentageButtonClick("12%", 0.12)}
        />

        <CalculatorBtn
          label="15%"
          value="15%"
          selected={selectedBonePercentage === "15%"}
          handleClick={() => handleBonePercentageButtonClick("15%", 0.15)}
        />
      </div>
    </div>
  {/if}

  {#if dogBonePercentageSelected}
    <div
      class="section"
      on:click={scrollTo}
      on:keydown={scrollTo}
    >
      <h3>Choose a raw meety bone</h3>
      <div class="flex-row">
        <CalculatorBtn
          label="Chicken Thighs or Lamb Ribs (20% bone)"
          value="Chicken Thighs or Lamb Ribs"
          selected={selectedBoneContent === "Chicken Thighs or Lamb Ribs"}
          handleClick={() =>
            handleBoneContentButtonClick("Chicken Thighs or Lamb Ribs", 0.2)}
          btnClass="tall"
        />

        <CalculatorBtn
          label="Chicken Necks (30% bone)"
          value="Chicken Necks"
          selected={selectedBoneContent === "Chicken Necks"}
          handleClick={() => handleBoneContentButtonClick("Chicken Necks", 0.3)}
          btnClass="tall"
        />

        <CalculatorBtn
          label="Turkey Necks (40% bone)"
          value="Turkey Necks"
          selected={selectedBoneContent === "Turkey Necks"}
          handleClick={() => handleBoneContentButtonClick("Turkey Necks", 0.4)}
          btnClass="tall"
        />
      </div>

      <div class="flex-row">
        <CalculatorBtn
          label="Ducks Necks or Beef Ribs (50% bone)"
          value="Ducks Necks or Beef Ribs"
          selected={selectedBoneContent === "Ducks Necks or Beef Ribs"}
          handleClick={() =>
            handleBoneContentButtonClick("Ducks Necks or Beef Ribs", 0.5)}
          btnClass="tall"
        />

        <CalculatorBtn
          label="Chicken or Duck Feet (60% bone)"
          value="Chicken or Duck Feet"
          selected={selectedBoneContent === "Chicken or Duck Feet"}
          handleClick={() =>
            handleBoneContentButtonClick("Chicken or Duck Feet", 0.6)}
          btnClass="tall"
        />

        <CalculatorBtn
          label="Ox tails (90% bone)"
          value="Ox tails"
          selected={selectedBoneContent === "Ox tails"}
          handleClick={() => handleBoneContentButtonClick("Ox tails", 0.9)}
          btnClass="tall"
        />
      </div>
    </div>
  {/if}

  {#if dogBoneSelected}
    <div
      class="section"
      on:click={scrollTo}
      on:keydown={scrollTo}
    >
      <p>
        Your {weightValue}kg, {selectedDogActivity}
        {selectedAge} dog, should be eating approximately {dailyGrams}g a day.
        Feeding the BARF (Biologically Appropriate Raw Food) at {selectedBonePercentage}
        bone content and using {selectedBoneContent} raw meaty bone cuts, here's
        what your bowl should look like:
      </p>
      <div class="flex">
        <p>Muscle meat:</p>
        <p class="result">{mealContent.muscleMeat}g</p>
      </div>
      <div class="flex">
        <p>{selectedBoneContent}:</p>
        <p class="result">{mealContent.totalBone}g</p>
      </div>
      <div class="flex">
        <p>Low glycemic fruit and veggies:</p>
        <p class="result">{mealContent.veggiesAndFruits}g</p>
      </div>
      <div class="flex">
        <p>Liver:</p>
        <p class="result">{mealContent.liver}g</p>
      </div>
      <div class="flex">
        <p>Other secreting organ:</p>
        <p class="result">{mealContent.otherOrgan}g</p>
      </div>
      <div class="section">
        <h3>
          Create a shopping list. How many days will you be preparing meals for?
        </h3>
        <CalculatorBtn
          label="1 week"
          value="7"
          selected={selectedTimePeriod === 7}
          handleClick={handleTimePeriodButtonClick}
          useDataValue={true}
        />

        <CalculatorBtn
          label="2 weeks"
          value="14"
          selected={selectedTimePeriod === 14}
          handleClick={handleTimePeriodButtonClick}
          useDataValue={true}
        />
      </div>
    </div>
  {/if}

  {#if selectedTimePeriod}
    <p>For {selectedTimePeriod} days you'll need to buy:</p>
    <div class="flex">
      <p>Total muscle meat:</p>
      <p class="result">{weekMealContent.muscleMeat}g</p>
    </div>
    <div class="flex">
      <p>Total {selectedBoneContent}:</p>
      <p class="result">{weekMealContent.totalBone}g</p>
    </div>
    <div class="flex">
      <p>Total veggies and fruits:</p>
      <p class="result">{weekMealContent.veggiesAndFruits}g</p>
    </div>
    <div class="flex">
      <p>Total liver:</p>
      <p class="result">{weekMealContent.liver}g</p>
    </div>
    <div class="flex">
      <p>Total other organ:</p>
      <p class="result">{weekMealContent.otherOrgan}g</p>
    </div>
  {/if}
</div>

<style>
  .intro {
    color: #51697b;
  }

  .flex-row {
    padding: 15px 0;
  }

  h2 {
    font-weight: 500;
    margin: 0;
  }

  h3 {
    font-size: 18px;
    font-weight: 500;
    margin: 5px;
  }

  .section {
    margin: 40px 0;
  }

  .weight {
    gap: 10px;
  }

  input {
    text-align: right;
    font-size: 1rem;
    color: gray;
    width: 80px;
    height: 40px;
  }

  .flex {
    display: flex;
    gap: 7px;
    align-items: flex-end;
  }

  .flex p {
    margin: 5px;
  }

  .result {
    font-size: 18px;
    font-weight: 500;
  }

  img {
    max-width: 250px;
  }
</style>
