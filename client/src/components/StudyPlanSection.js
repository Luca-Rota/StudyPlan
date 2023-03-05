import MyNoStudyPlan from './NoStudyPlan';
import MyStudyPlan from './StudyPlan.js';
import { Alert } from "react-bootstrap";

function MyStudyPlanSection(props) {

  return (

    <>
      {(props.success) ? <Alert className='mb-3' variant='success' onClose={() => props.setSuccess(() => false)} dismissible> Operazione avvenuta con successo! </Alert> : false}
      {(props.initLoadPlan) ?
        <Alert key="warning" variant="warning" className='mt-5'> Loading... </Alert> :
        ((!props.user.pianoDiStudi) ?
          <MyNoStudyPlan user={props.user} setUser={props.setUser} setDirty={props.setDirty} /> :
          <MyStudyPlan startEdit={props.startEdit} Save={props.Save} setStudyPlan={props.setStudyPlan} courses={props.courses}
            setCourses={props.setCourses} setUser={props.setUser} user={props.user} Undo={props.Undo} initLoadPlan={props.initLoadPlan}
            setSideErr={props.setSideErr} setErrParams={props.setErrParams} setStartEdit={props.setStartEdit} 
            sideErr={props.sideErr} errParams={props.errParams} studyPlan={props.studyPlan} Delete={props.Delete} />)}
    </>

  );
}

export default MyStudyPlanSection;