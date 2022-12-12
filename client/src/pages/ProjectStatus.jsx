import SideMenu from 'common/SideMenu';
import ProjectSelect from 'common/ProjectSelect';

const ProjectStatus = () => {
  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap'>
        <ProjectSelect />
      </div>
    </div>
  );
};

export default ProjectStatus;
