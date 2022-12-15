import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import EditorComponent from 'common/EditorComponent';
import SideMenu from 'common/SideMenu';
import { changeState, commonModalSetting } from 'js/commonUtils';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';
import {
  getBoardDetail,
  createBoard,
  editBoard,
  editNotice,
  getNoticeInfo,
  createNotice,
} from 'js/groupwareApi';

const BusinessNewBoard = () => {
  const [alert, setAlert] = useState('');
  const [postInfo, setPostInfo] = useState({
    created_id: '',
    title: '',
    content: '',
  });
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });

  const [projectValue, setProjectValue] = useState('===');
  const [contactValue, setContactValue] = useState('===');
  const [requesterValue, setRequesterValue] = useState('===');
  const [progressValue, setProgressValue] = useState('===');

  const projectNameArr = [
    '마크클라우드',
    '마크뷰',
    '마크통',
    '마크링크',
    '삼성전자',
    '그린터치',
  ];

  const contactNameArr = ['안병욱', '송지은', '권정인', '강은수', '권도연'];

  const progressArr = ['요청', '접수', '진행', '완료'];

  const path = useLocation().pathname;
  const { id } = useParams();
  const navigate = useNavigate();

  // const returnHeader = () => {
  //   switch (path.split('/')[1]) {
  //     case 'project':
  //       return '프로젝트 현황';
  //     case 'weekly':
  //       return '주간 업무 보고';
  //     case 'board':
  //       return '사내게시판';
  //     case 'notice':
  //       return '공지사항';
  //     default:
  //       break;
  //   }
  // };

  const getOriginDetail = async () => {
    let result;
    switch (path.split('/')[1]) {
      case 'notice':
        result = await getNoticeInfo(id);
        break;
      case 'board':
        result = await getBoardDetail(id);
        break;
      case 'weekly':
        return;
      case 'project':
        return;
      default:
    }
    if (typeof result === 'object') {
      setPostInfo(result?.data);
    } else return; // 에러 처리
  };

  const createNew = async () => {
    let result;
    switch (path.split('/')[1]) {
      case 'notice':
        result = await createNotice(postInfo);
        break;
      case 'board':
        result = await createBoard(postInfo);
        break;
      case 'weekly':
        return;
      case 'project':
        return;
      default:
    }
    if (typeof result === 'object') {
      setAlert('apply');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '등록이 완료되었습니다.'
      );
    } else return; // 에러 처리
  };

  const editPost = async () => {
    let result;
    if (typeof result === 'object') {
      setAlert('edit');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '수정이 완료되었습니다.'
      );
    } else return; // 에러 처리
  };

  useEffect(() => {
    if (id?.length) getOriginDetail();
  }, []);
  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap business'>
          <div className='header'>
            <h3>업무 관리</h3>
          </div>

          <div className='work-wrap project-work-wrap'>
            <div className='project-wrap project-name'>
              <div className='project-list'>
                <span>프로젝트</span>
                <CommonSelect
                  opt={projectNameArr}
                  selectVal={projectValue}
                  setSelectVal={setProjectValue}
                />
              </div>
            </div>
            <div className='project-wrap'>
              {/* ============================= */}
              <div className='project-list'>
                <span>요청자</span>
                <CommonSelect
                  opt={contactNameArr}
                  selectVal={requesterValue}
                  setSelectVal={setRequesterValue}
                />
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>담당자</span>
                <CommonSelect
                  opt={contactNameArr}
                  selectVal={contactValue}
                  setSelectVal={setContactValue}
                />
              </div>
              {/* ============================= */}
              <div className='project-list'>
                <span>진행상태</span>
                <CommonSelect
                  opt={progressArr}
                  selectVal={progressValue}
                  setSelectVal={setProgressValue}
                />
              </div>
            </div>
            <div className='project-wrap title'>
              <span>제목</span>
              <div className='title-input-wrap'>
                <label>
                  <input type='text' placeholder='제목을 입력해주세요.' />
                </label>
              </div>
            </div>
            <div className='content'>
              <EditorComponent
                content={postInfo.content}
                setContent={setPostInfo}
              />
            </div>
          </div>

          <div className='btn-wrap'>
            <button
              className='commonBtn applyBtn'
              onClick={id?.length ? editPost : createNew}>
              등록
            </button>
            <button
              className='commonBtn list'
              onClick={() => {
                setAlert('cancel');
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  `${id?.length ? '수정' : '작성'}을 취소하시겠습니까?<br/>${
                    id?.length ? '수정' : '작성'
                  }이 취소된 글은 복구할 수 없습니다.`
                );
              }}>
              목록
            </button>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'cancel' || alert === 'apply')
              navigate(`/${path.split('/')[1]}`);
            else if (alert === 'edit') navigate(`/${path.split('/')[1]}/${id}`);
          }}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default BusinessNewBoard;
