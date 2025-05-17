export const transformAttributesToArray = (attributesObject: any) => {
  return Object.entries(attributesObject).map(([key, value]) => ({
    id: key, // attr1, attr2 veya ce6a8cb5-e966-4c59-b330-df594e552899 gibi
    ...(value as any) // name, options, createdAt, updatedAt gibi alanlar
  }));
};