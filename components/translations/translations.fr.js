module.exports.fr = {
  'LANGUAGE': 'Français',
  // env-var-create
  'env-var-create.name.placeholder': `NOM_DE_LA_VARIABLE`,
  'env-var-create.value.placeholder': `valeur de la variable`,
  'env-var-create.create-button': `Créer`,
  'env-var-create.errors.invalid-name': ({ name }) => `Le nom ${name} n'est pas valide`,
  'env-var-create.errors.already-defined-name': ({ name }) => `Le nom ${name} est déjà défini`,
  // env-var-editor-simple
  'env-var-editor-simple.empty-data': `Il n'y a pas de variable.`,
  // env-var-editor-expert
  'env-var-editor-expert.placeholder': `NOM_DE_LA_VARIABLE="valeur de la variable"`,
  'env-var-editor-expert.placeholder-readonly': `Il n'y a pas de variable.`,
  'env-var-editor-expert.errors.unknown': `Erreur inconnue`,
  'env-var-editor-expert.errors.line': `ligne`,
  'env-var-editor-expert.errors.invalid-name': ({ name }) => `Le nom ${name} n'est pas valide`,
  'env-var-editor-expert.errors.duplicated-name': ({ name }) => `attention, le nom ${name} est déjà défini`,
  'env-var-editor-expert.errors.invalid-line': `cette ligne est invalide, le format correct est : NOM="VALEUR"`,
  'env-var-editor-expert.errors.invalid-value': `la valeur est invalide, si vous utilisez des guillements, vous devez les échapper comme ceci : \\" ou alors mettre toute la valeur entre guillemets.`,
  // env-var-input
  'env-var-input.delete-button': `Enlever`,
  'env-var-input.keep-button': `Garder`,
  'env-var-input.value-placeholder': `valeur de la variable`,
};
