import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';
import { commonModalSetting, changeTitle, catchError } from 'js/commonUtils';
import {
  getProjectDetail,
  getPeopleList,
  addProjectMember,
  deleteProjectMember,
  getProjectMember,
} from 'js/groupwareApi';
import { changeState, getKeyByValue } from 'js/commonUtils';
import { getCookie } from 'js/cookie';
import deletePerson from 'image/deletePersonIcon.svg';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const [memberObj, setMemberObj] = useState({});
  const [personArr, setPersonArr] = useState([]);
  const [projectInfo, setProjectInfo] = useState({});
  const [personValue, setPersonValue] = useState('선택');
  const [participation, setParticipation] = useState([]);
  let prevent = false;

  //= 멤버 리스트
  const peopleList = async () => {
    setPersonArr([]);
    const result = await getPeopleList();
    if (typeof result === 'object') {
      let obj = {};
      let arr = [];
      result?.data?.forEach(i => {
        arr.push(`${i?.name} (${i?.section})`);
        obj[`${i?.name} (${i?.section})`] = i?.user_id;
      });
      setPersonArr(arr);
      setMemberObj(obj);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 프로젝트 참가 인원 목록
  const getMember = async () => {
    const result = await getProjectMember(id);
    if (typeof result === 'object') {
      setParticipation(result?.data);
      peopleList();
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 프로젝트 상세 내역
  const projectDetail = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, []);
    const result = await getProjectDetail(id);
    if (typeof result === 'object') {
      setProjectInfo(result?.data);
      document.querySelector('.content').innerHTML =
        new DOMParser().parseFromString(
          result?.data?.project_description,
          'text/html'
        ).body.innerHTML;
      getMember();
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 프로젝트 멤버 추가
  const addMember = async () => {
    if (participation.includes(memberObj[personValue]))
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '이미 추가된 인원입니다.'
      );
    const result = await addProjectMember(id, memberObj[personValue]);
    if (typeof result === 'object') getMember();
    else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 프로젝트 멤버 삭제
  const deleteMember = async user => {
    const result = await deleteProjectMember(id, user);
    if (typeof result === 'object') getMember();
    else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    if (getCookie('myToken')) {
      changeTitle('그룹웨어 > 프로젝트 상세 보기');
      projectDetail();
    }
  }, []);

  useEffect(() => {
    switch (projectInfo.project_status) {
      case 'before':
        changeState(setProjectInfo, 'project_status', '시작 전');
        break;
      case 'progress':
        changeState(setProjectInfo, 'project_status', '진행 중');
        break;
      case 'complete':
        changeState(setProjectInfo, 'project_status', '종료');
        break;
      default:
        return;
    }
  }, [projectInfo]);

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap project'>
          <div className='header'>
            <h3 onClick={() => navigate('/project')}>프로젝트 현황</h3>
          </div>
          <div className='projectWrapper detail'>
            <div className='projectTitle'>{projectInfo?.project_name}</div>
            <div className='projectInfo column'>
              <hr />
              <div className='row makeProjectDate'>
                <span>작성일</span>
                <div className='projectDate'>{projectInfo?.created_at}</div>
              </div>
              <hr />
              <div className='row date'>
                <div className='row start'>
                  <span>프로젝트 시작일</span>
                  <div className='date-start'>
                    {projectInfo?.project_start_date}
                  </div>
                </div>
                <div className='row'>
                  <span>프로젝트 종료일</span>
                  <div className='date-end'>
                    {projectInfo?.project_end_date}
                  </div>
                </div>
              </div>
              <hr />
              <div className='content'></div>
              <hr />
              <div className='projectSetting column'>
                <div className='row statusSelect'>
                  <span>프로젝트 상태</span>
                  <div className='fixedStatus'>
                    {projectInfo?.project_status}
                  </div>
                </div>
                <hr />
                <div className='row peopleWrap'>
                  <span>참여 목록</span>
                  <div className='row'>
                    {participation?.length === 0
                      ? '참여 인원을 추가해 주세요.'
                      : participation?.reduce((acc, person) => {
                          return (
                            <>
                              {acc}
                              <span className='personBtn'>
                                {getKeyByValue(memberObj, person)}
                                {localStorage.getItem('yn') === 'n' ||
                                projectInfo?.created_id ===
                                  localStorage.getItem('userName') ? (
                                  <img
                                    src={deletePerson}
                                    alt={`${getKeyByValue(
                                      memberObj,
                                      person
                                    )} 삭제 버튼`}
                                    onClick={() => deleteMember(person)}
                                  />
                                ) : (
                                  <></>
                                )}
                              </span>
                            </>
                          );
                        }, <></>)}
                  </div>
                </div>
                {localStorage.getItem('yn') === 'n' ||
                projectInfo?.created_id === localStorage.getItem('userName') ? (
                  <div className='row'>
                    <span>참여 인원 추가</span>
                    <div className='people column'>
                      <CommonSelect
                        opt={personArr}
                        selectVal={personValue}
                        setSelectVal={setPersonValue}
                      />
                    </div>
                    <button className='addPersonBtn' onClick={addMember}>
                      추가
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className='btn-wrap'>
            {localStorage.getItem('yn') === 'n' ||
            projectInfo?.created_id === localStorage.getItem('userName') ? (
              <button
                className='commonBtn editBtn'
                onClick={() => navigate(`/project/write/${id}`)}>
                수정
              </button>
            ) : (
              <></>
            )}
            <button
              className='commonBtn listBtn'
              onClick={() => navigate('/project')}>
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
            if (alert === 'cancel' || alert === 'completeDelete')
              navigate('/project');
            else if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
            else return;
          }}
        />
      )}
    </>
  );
};

export default ProjectDetail;
