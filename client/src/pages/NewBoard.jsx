import SideMenu from 'common/SideMenu';
import { useLocation, useParams } from 'react-router-dom';

const NewBoard = () => {
  const path = useLocation().pathname;
  const { id } = useParams();

  return (
    <div className='container'>
      <SideMenu />
      <div className='content-wrap'>{/* quill 적용 */}</div>
    </div>
  );
};

export default NewBoard;
