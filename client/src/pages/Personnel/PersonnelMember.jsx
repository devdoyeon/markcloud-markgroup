import { useEffect, useState } from 'react';
import SideMenu from 'common/SideMenu';
import Pagination from 'common/Pagination';
import { useNavigate } from 'react-router-dom';
import CommonSelect from 'common/CommonSelect';
import { getBusinessRead } from 'js/groupwareApi';
import CommonModal from 'common/CommonModal';
import { catchError, changeTitle } from 'js/commonUtils';

const PersonnelMember = () => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [num, setNum] = useState(0);
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({});
  const [inputVal, setInputVal] = useState('나의 업무현황');
  const [contactValue, setContactValue] = useState('===');
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 15,
    limit: 5,
  });

  const navigate = useNavigate();

  const projectNameArr = [
    '마크클라우드',
    '마크뷰',
    '마크통',
    '마크링크',
    '삼성전자',
    '그린터치',
  ];

  const contactNameArr = ['안병욱', '송지은', '권정인', '강은수', '권도연'];

  let prevent = false;

  const getProjectApi = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getBusinessRead(pageInfo);
    if (typeof result === 'object') {
      const { data, meta } = result?.data;
      setList(data);
      setMeta(meta);
      setPageInfo(prev => {
        const clone = { ...prev };
        clone.page = meta?.page;
        clone.totalPage = meta?.totalPage;
        return clone;
      });
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    changeTitle('그룹웨어 > 업무 관리');
  }, []);

  useEffect(() => {
    getProjectApi();
  }, [pageInfo.page]);

  const handleChangeRadioButton = e => {
    setInputVal(e.target.value);
  };

  const handleChangeClear = () => {};

  const { project_member, project_name } = meta;

  return (
    <>
      <div className='container'>
        <SideMenu />
        <div className='content-wrap member'>
          <div className='header'>
            <h3>인사 관리</h3>
          </div>
          <div className='member-wrap'>
            <div className='id-line'>
              <div>
                <span>아이디</span>
                <input type='text' />
              </div>
              <div className='name'>
                <span>성명</span>
                <input type='text' />
              </div>
              <div className='gender-wrap'>
                <span>성별</span>
                <div className='gender-input-wrap'>
                  <div>
                    <input type='radio' name='gender' />
                    <span>남</span>
                  </div>

                  <div>
                    <input type='radio' name='gender' />
                    <span>여</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='date-line'>
              <div className='birth-date'>
                <span>생년월일</span>
                <input type='date' />
              </div>
              <div className='affiliation'>
                <span>소속</span>
                <CommonSelect
                  opt={projectNameArr}
                  selectVal={contactValue}
                  setSelectVal={setContactValue}
                />
              </div>
              <div className='password'>
                <span>비밀번호</span>
                <input type='password' />
              </div>
            </div>
            <div className='phone-line'>
              <div>
                <span>휴대전화</span>
                <input type='text' />
              </div>
              <div>
                <span>이메일</span>
                <input type='text' />
              </div>
            </div>
            <div>
              <label>
                <span>주소</span>
                <input type='text' placeholder='(선택)' />
              </label>
              <button className='commonBtn'>주소찾기</button>
            </div>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'duplicateLogin' || alert === 'tokenExpired')
              return navigate('/sign-in');
          }}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default PersonnelMember;
