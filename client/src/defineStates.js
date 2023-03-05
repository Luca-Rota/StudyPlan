
function define_states(course, studyPlan) {

  function checkIncompatibility(course) {
    if (course.incompatibilità === '') {
      return false;
    } else {
      const c = course.incompatibilità.map(elem => studyPlan.find(element => element.codice === elem));
      const ci = c.filter(element => element !== undefined).map(elem => elem.codice);
      if (ci.length) {
        return ci;
      } else {
        return false;
      }
    }
  }

  function checkMaxStudent(course) {
    if (course.maxStudenti === "NaN") {
      return false;
    } else if (parseInt(course.numStudenti) >= parseInt(course.maxStudenti)) {
      return true;
    } else {
      return false;
    }
  }

  function checkPrerequisite(course) {
    if (course.propedeuticità === "Nessuna") {
      return false;
    } else {
      const c = studyPlan.find(el => el.codice === course.propedeuticità);
      if (c === undefined) {
        return course.propedeuticità;
      } else {
        return false;
      }
    }
  }

  function defineBlockedCourse(course) {
    if (checkMaxStudent(course) || checkIncompatibility(course) || checkPrerequisite(course)) {
      return true;
    } else {
      return false;
    }
  }

  function defineAddedCourse(course) {
    return studyPlan.find(c => c.codice === course.codice);
  }

  if (defineAddedCourse(course)) {
    return "added";
  } else if (defineBlockedCourse(course)) {
    return "blocked";
  } else {
    return "";
  }

}

export default define_states;