
function Course(codice, nome, crediti, numStudenti = 0, maxStudenti = '', incompatibilità = '', propedeuticità = '', status = '') {

  this.codice = codice;
  this.nome = nome;
  this.crediti = crediti;
  this.numStudenti = numStudenti;
  this.maxStudenti = maxStudenti;
  this.incompatibilità = incompatibilità;
  this.propedeuticità = propedeuticità;
  this.status = status;

}

export { Course };