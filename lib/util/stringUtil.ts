function pascalToNormal(text: string): string {
  return text.replace(/([A-Z])/g, ' $1').trim();
};

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function trimText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}


export { pascalToNormal, trimText, toTitleCase };