const SignIn = () => {
  return (
    <div className='container'>
      <div className='signIn'>
        <div className='loginForm'>
          <h3>로그인</h3>
          <div className='line'></div>
          <input type='text' placeholder='아이디' />
          <input type='password' placeholder='패스워드' />
          <button>로그인</button>
          <div className='row'>
            <a href='https://markcloud.co.kr/sign-up'>회원가입</a>
            <a href='https://markcloud.co.kr/find-id'>아이디 찾기</a>
            <a href='https://markcloud.co.kr/find-pw'>비밀번호 찾기</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
