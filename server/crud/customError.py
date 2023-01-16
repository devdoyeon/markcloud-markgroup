#

class S3ConnError(Exception):
    def __init__(self):
        print('s3 커넥트 실패')

class InvalidError(Exception):
    def __init__(self):
        print("사용자 인증 실패")
        
class DuplicatedError(Exception):
    def __init__(self):
        print("데이터 중복")