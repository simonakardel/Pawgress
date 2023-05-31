

export function calculateDailyGrams(weightValue, activityValue) {
    return Math.round(activityValue * (weightValue * 1000));
  }

export function calculateMealComposition(dailyGrams, bonePercentage, boneContent) {
    const veggiesAndFruits = dailyGrams * 0.10;
    const liver = dailyGrams * 0.05;
    const otherOrgan = dailyGrams * 0.05;
    const totalBonePercentage = bonePercentage / boneContent;
    const totalBone = dailyGrams * totalBonePercentage;
    const muscleMeat = dailyGrams - veggiesAndFruits - liver - otherOrgan - totalBone;
  
    return {
      veggiesAndFruits: Math.round(veggiesAndFruits/10)*10,
      liver: Math.round(liver/10)*10,
      otherOrgan: Math.round(otherOrgan/10)*10,
      totalBone: Math.round(totalBone/10)*10,
      muscleMeat: Math.round(muscleMeat/10)*10
    };
  }

export function calculateTotalGrams(mealContent, selectedTimePeriod) {
    return {
      veggiesAndFruits: Math.round(mealContent.veggiesAndFruits * selectedTimePeriod),
      liver: Math.round(mealContent.liver * selectedTimePeriod),
      otherOrgan: Math.round(mealContent.otherOrgan * selectedTimePeriod),
      totalBone: Math.round(mealContent.totalBone * selectedTimePeriod),
      muscleMeat: Math.round(mealContent.muscleMeat * selectedTimePeriod)
    }
  }