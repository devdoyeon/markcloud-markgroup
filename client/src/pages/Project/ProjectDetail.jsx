import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideMenu from 'common/SideMenu';
import CommonModal from 'common/CommonModal';
import CommonSelect from 'common/CommonSelect';
import { commonModalSetting, changeTitle, catchError } from 'js/commonUtils';
import { getProjectDetail } from 'js/groupwareApi';
import deletePerson from 'image/deletePersonIcon.svg';

const ProjectDetail = () => {
  const statusArr = ['시작 전', '진행 중', '종료'];
  const personArr = [
    '권도연',
    '안병욱',
    '김남호',
    '장지원',
    '정다은',
    '송지은',
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    content: '',
    bool: false,
  });
  const [projectInfo, setProjectInfo] = useState({});
  const [statusValue, setStatusValue] = useState('===');
  const [personValue, setPersonValue] = useState('선택');
  const [participation, setParticipation] = useState([]);

  //= 프로젝트 상세 내역
  const projectDetail = async () => {
    const result = await getProjectDetail(id);
    if (typeof result === 'object') {
      setProjectInfo(result?.data);
      setStatusValue(result?.data?.project_status);
      document.querySelector('.content').innerHTML =
        new DOMParser().parseFromString(
          result?.data?.project_description,
          'text/html'
        ).body.innerHTML;
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    changeTitle('그룹웨어 > 프로젝트 상세 보기');
    projectDetail();
  }, []);

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
                  <CommonSelect
                    opt={statusArr}
                    selectVal={statusValue}
                    setSelectVal={setStatusValue}
                  />
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
                                {person}
                                <img
                                  src={deletePerson}
                                  alt={`${person} 삭제 버튼`}
                                  onClick={() => {
                                    setParticipation(prev => {
                                      const clone = [...prev];
                                      clone.splice(clone.indexOf(person), 1);
                                      return clone;
                                    });
                                  }}
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
                  <button
                    className='addPersonBtn'
                    onClick={() =>
                      setParticipation(prev => {
                        const clone = [...prev];
                        if (clone.includes(personValue)) {
                          commonModalSetting(
                            setAlertBox,
                            true,
                            'alert',
                            '이미 추가된 인원입니다.'
                          );
                          return clone;
                        } else clone.push(personValue);
                        return clone;
                      })
                    }>
                    추가
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='btn-wrap'>
            <button
              className='commonBtn editBtn'
              onClick={() => navigate(`/project/write/${id}`)}>
              수정
            </button>
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
