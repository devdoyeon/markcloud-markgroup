import enum

class ProjectStatus(str, enum.Enum):
    ALL = "all" # 전체 업무 현황
    MS = "MS" # 나의 업무현황   
    MR = "MR" # 내가 요청한 업무 


    