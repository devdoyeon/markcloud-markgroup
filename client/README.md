# MarkCloud GroupWare PROJECT

# Framework

# Library

- quill.js(Text Editor)
- SASS(SCSS)

<pre>
    MarkCloud Groupware
</pre>

## MAIN SCREEN

| 번호 | 화면명(영어)                  | 화면설명(한글)        | 연결URL                        |
| :--- | :---------------------------- | :-------------------- | :----------------------------- |
| 1    | MAIN                          | 메인페이지            | "/groupware"                   |
| 2    | Project Status List           | 프로젝트 현황리스트   | “/groupware/project”           |
| 3    | Project Status Detail         | 프로젝트 현황 상세    | “/groupware/project/:id”       |
| 4    | Project Status Create         | 프로젝트 현황 등록    | “/groupware/project/write”     |
| 5    | Project Status Update         | 프로젝트 상세 수정    | “/groupware/project/write/:id” |
| 6    | report Business Report List   | 주간 업무 보고 리스트 | “/groupware/report”            |
| 7    | report Business Report Detail | 주간 업무 보고 상세   | “/groupware/report/:id”        |
| 8    | report Business Report Create | 주간 업무 보고 등록   | “/groupware/report/write”      |
| 9    | report Business Report Update | 주간 업무 보고 수정   | “/groupware/report/write/:id”  |
| 10   | Board List                    | 게시판 리스트         | “/groupware/board"             |
| 11   | Board Detail                  | 게시판 상세           | “/groupware/board/:id"         |
| 12   | Board Create                  | 게시판 등록           | “/groupware/board/write"       |
| 13   | Board Update                  | 게시판 수정           | “/groupware/board/write/:id"   |
| 14   | Notice List                   | 공지사항 리스트       | “/groupware/notice"            |
| 15   | Notice Detail                 | 공지사항 상세         | “/groupware/notice/:id"        |
| 16   | Notice Create                 | 공지사항 등록         | “/groupware/notice/write"      |
| 17   | Notice Update                 | 공지사항 수정         | “/groupware/notice/write/:id"  |
| 18   | Business Management           | 업무 관리             | “/groupware/business"          |
| 19   | Personnel Management          | 인사 관리             | “/groupware/personnel”         |

## CLIENT DEVELOPMENT

- [] 메인 페이지 [Mark.KDY,Mark.ABW]
- [] 프로젝트 현황 [Mark.KDY]
- [] 주간 업무 보고 [Mark.KDY]
- [] 게시판 [Mark.KDY]
- [] 업무 관리 [Mark.ABW]
- [] 인사 관리 [Mark.ABW]
- [] 공지사항 [Mark.ABW]

# js/commonUtils

| FUNCTION         | PARAMETER | DATA TYPE | RETURN  |
| :--------------- | :-------- | :-------- | :------ |
| numberWithCommas | value     | Number    | Integer |
| emptyCheck       | value     | All(\*)   | Boolean |
