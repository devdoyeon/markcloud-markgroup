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
  const [statusValue, setStatusValue] = useState('===');
  const [personValue, setPersonValue] = useState('선택');
  const [participation, setParticipation] = useState([]);
  let prevent = false;

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
      setStatusValue(result?.data?.project_status);
      setParticipation(result?.data?.project_members);
      document.querySelector('.content').innerHTML =
        new DOMParser().parseFromString(
          result?.data?.project_description,
          'text/html'
        ).body.innerHTML;
      peopleList();
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 멤버 리스트
  const peopleList = async () => {
    setPersonArr([]);
    const result = await getPeopleList();
    if (typeof result === 'object') {
      let obj = {};
      result?.data?.forEach(i => {
        setPersonArr(prev => {
          const clone = [...prev];
          clone.push(`${i?.name} (${i?.section})`);
          return clone;
        });
        obj[`${i?.name} (${i?.section})`] = i?.user_id;
      });
      setMemberObj(obj);
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
    if (typeof result === 'object') projectDetail();
    else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 프로젝트 멤버 삭제
  const deleteMember = async user => {
    const result = await deleteProjectMember(id, user);
    if (typeof result === 'object') projectDetail();
    else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    if (getCookie('myToken')) {
      changeTitle('그룹웨어 > 프로젝트 상세 보기');
      projectDetail();
    }
  }, []);

  useEffect(() => {
    if (getCookie('myToken'))
      changeState(setProjectInfo, 'project_status', statusValue);
  }, [statusValue]);

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
                <hr />
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
                                <img
                                  src={deletePerson}
                                  alt={`${getKeyByValue(
                                    memberObj,
                                    person
                                  )} 삭제 버튼`}
                                  onClick={() => deleteMember(person)}
                                />
                              </span>
                            </>
                          );
                        }, <></>)}
                  </div>
                </div>
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
