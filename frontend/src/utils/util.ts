
export const replaceTemplateVariables = (text: string, slots: Record<string, string>) => {
  return text.replace(/\{(\w+)\}/g, (_, key) => slots[key] ?? `{${key}}`);
};

// slot 보강 및 개행 적용
export const formatMessage = (text: string, slots: Record<string, string>) => {
  const replaced = text.replace(/\{(\w+)\}/g, (_, key) => slots[key] ?? `{${key}}`);
  return replaced;
};
