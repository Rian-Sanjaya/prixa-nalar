import { diseaseAccuracyMap, diseaseAccuracyDescMap, priority, triageType } from './constant';

const triagePriority = (triage: any) => {
  const isHomecare = triage === triageType.homecare;
  const isOpd = triage === triageType.opd || triage === triageType.poly || triage === triageType.ugd;

  if (isHomecare) {
    return priority.homecare;
  } else if (isOpd) {
    return priority.opd;
  }
};

const classifyDisease = (score: any) => {
  if (score > 0.25) {
    return diseaseAccuracyMap.high;
  } else if (score > 0.15) {
    return diseaseAccuracyMap.medium;
  }

  return diseaseAccuracyMap.low;
};

const classifyDiseaseLevel = (score: any) => {
  if (score > 0.25) {
    return priority.opd;
  } else if (score > 0.15) {
    return priority.homecare;
  }

  return priority.homecare;
};

const convertDisease = (disease: any) => {
  const classify = classifyDisease(disease.score);
  const triage = triagePriority(disease.triage.nameIndo);
  const classifyLevel = classifyDiseaseLevel(disease.score);
  return {
    id: disease.id,
    name: disease.name,
    score: disease.score,
    triage: triage,
    classify: classify,
    classifyLevel: classifyLevel,
    evidenceLevel: diseaseAccuracyDescMap[classify],
    article: disease.articles ? disease.articles[0] : '#',
    description: disease.description,
    prognosis: disease.prognosis,
  };
};

export const findInProfiles = (profiles: any, name: any) => {
  const findElement = profiles.find((element: any) => element.type === name);
  if (findElement) {
    return findElement.nameIndo;
  } else {
    return '';
  }
};

export const getConvertedDisease = (diseases: any) => {
  return (diseases || []).map((disease: any) => convertDisease(disease));
};

export const getHighestDisease = (diseases: any) => {
  const convertedDisease = getConvertedDisease(diseases);

  return convertedDisease.reduce((max: any, next: any) => {
    if (max.classifyLevel === next.classifyLevel) {
      return max.triage > next.triage ? max : next;
    } else if (max.classifyLevel > next.classifyLevel) {
      return max;
    } else if (max.classifyLevel < next.classifyLevel) {
      return next;
    } else {
      return '';
    }
  });
};
