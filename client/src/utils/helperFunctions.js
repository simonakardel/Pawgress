const maxParagraphLenght = 180; 

export function restrictParagraphLength(paragraph) {
  if (paragraph.length <= maxParagraphLenght) {
    
    return paragraph;
  } else {

    return paragraph.substr(0, maxParagraphLenght) + '...';
  }
}


