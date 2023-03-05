import { default as Add } from '../icons/add.svg';
import { default as Confirm } from '../icons/confim.svg';
import { default as Cancel } from '../icons/cancel.svg';
import { default as Subtract } from '../icons/subtract.svg';
import '../App.css';

function onlick_handler(e) {
  e.stopPropagation();
}

function MyAddedButton(props) {

  function findCourse(course) {
    return props.studyPlan.find(element => element.codice === course.codice);
  }

  function getCoursePrerequisite(code) {
    return props.courses.find(element => element.codice === code);
  }

  function checkIncompatibility(course) {
    if (course.incompatibilità === '') {
      return undefined;
    } else {
      const c = course.incompatibilità.map(elem => props.studyPlan.find(element => element.codice === elem));
      const ci = c.filter(element => element !== undefined).map(elem => elem.codice);
      if (ci.length) {
        return ci;
      } else {
        return false;
      }
    }
  }

  function checkPrerequisite(course) {
    if (course.propedeuticità === "Nessuna") {
      return undefined;
    } else {
      const c = props.studyPlan.find(element => element.codice === course.propedeuticità);
      if (c === undefined) {
        return getCoursePrerequisite(course.propedeuticità).codice;
      } else {
        return undefined;
      }
    }
  }

  function checkMaxStudent(course) {
    if (course.maxStudenti === "NaN") {
      return false;
    } else if (parseInt(course.numStudenti) < parseInt(course.maxStudenti)) {
      return false;
    } else {
      return true;
    }
  }

  function finalizeAddCourse(course) {
    props.setCourses(c => c.map(elem => (elem.codice === course.codice) ? { ...elem, numStudenti: (parseInt(elem.numStudenti) + 1) } : elem));
    props.setUser(us => Object.assign({}, us, { totaleCrediti: (parseInt(us.totaleCrediti) + parseInt(course.crediti)) }));
    props.setStudyPlan(sp => sp.concat(course));
    props.setStartEdit(() => true);
    props.setSideErr(() => '');
    props.setErrParams(() => '');
  }

  function added_handler(course) {
    if (findCourse(course)) {
      props.setSideErr(() => 'Corso già presente nel piano di studi.');
      props.setErrParams(() => '');
    } else if (checkIncompatibility(course)) {
      const courseProblem = checkIncompatibility(course);
      props.setSideErr(() => 'Corso incompatibile con altri inseriti: ');
      props.setErrParams(() => ({ courseProblem }));
    } else if (checkPrerequisite(course)) {
      const courseProblem = checkPrerequisite(course);
      props.setSideErr(() => 'Corso necessetà di propedeuticità: ');
      props.setErrParams(() => ({ courseProblem }));
    } else if (checkMaxStudent(course)) {
      props.setSideErr(() => 'Il corso ha già raggiunto il numero di studenti massimo.');
      props.setErrParams(() => '');
    } else {
      finalizeAddCourse(course);
    }
  }

  return (

    <img className='imgShadow' src={(props.course.status) ? ((props.course.status === 'added') ? Confirm :
      ((props.course.status === 'blocked') ? Cancel : false)) : Add}
      onClick={(e) => { onlick_handler(e); added_handler(props.course); }} alt="update_icon" />

  );
}

function MyRemovedButton(props) {

  function checkPrerequisite(course) {
    const c = props.studyPlan.filter(el => el.propedeuticità === course.codice).map(elem => elem.codice);
    if (c.length) {
      return c;
    } else {
      return false;
    }
  }

  function removed_handler(course) {
    const checkedCourses = checkPrerequisite(course);
    if (!checkedCourses) {
      props.setCourses(c => c.map(elem => (elem.codice === course.codice) ? { ...elem, numStudenti: (parseInt(elem.numStudenti) - 1) } : elem));
      props.setStudyPlan(sp => sp.filter(element => element.codice !== course.codice));
      props.setUser(us => Object.assign({}, us, { totaleCrediti: (parseInt(us.totaleCrediti) - parseInt(course.crediti)) }));
      props.setStartEdit(() => true);
    } else {
      props.setSideErr(() => 'Corso propedeutico per altri corsi: ');
      props.setErrParams(() => ({ checkedCourses }));
    }
  }

  return (

    <img className='imgShadow' src={Subtract} onClick={(e) => {props.setSideErr(() => ''); props.setErrParams(() => '');
      onlick_handler(e); removed_handler(props.course); }} alt="subtract_icon" />

  );
}

export { MyAddedButton, MyRemovedButton };