# MarkCloud GroupWare PROJECT

# Framework

# Library

- quill.js(Text Editor)
- SASS(SCSS)

<pre>
    MarkCloud Groupware
</pre>

## MAIN SCREEN

| 번호 | 화면명(영어)                  | 화면설명(한글)        | 연결URL                            |
| :--- | :---------------------------- | :-------------------- | :--------------------------------- |
| 1    | MAIN                          | 메인페이지            | "/mark-group"                      |
| 2    | Project Status List           | 프로젝트 현황리스트   | “/mark-group/project”              |
| 3    | Project Status Detail         | 프로젝트 현황 상세    | “/mark-group/project/:id”          |
| 4    | Project Status Create         | 프로젝트 현황 등록    | “/mark-group/project/write”        |
| 5    | Project Status Update         | 프로젝트 상세 수정    | “/mark-group/project/write/:id”    |
| 6    | report Business Report List   | 주간 업무 보고 리스트 | “/mark-group/report”               |
| 7    | report Business Report Detail | 주간 업무 보고 상세   | “/mark-group/report/:id”           |
| 8    | report Business Report Create | 주간 업무 보고 등록   | “/mark-group/report/write”         |
| 9    | report Business Report Update | 주간 업무 보고 수정   | “/mark-group/report/write/:id”     |
| 10   | Board List                    | 게시판 리스트         | “/mark-group/board"                |
| 11   | Board Detail                  | 게시판 상세           | “/mark-group/board/:id"            |
| 12   | Board Create                  | 게시판 등록           | “/mark-group/board/write"          |
| 13   | Board Update                  | 게시판 수정           | “/mark-group/board/write/:id"      |
| 14   | Notice List                   | 공지사항 리스트       | “/mark-group/notice"               |
| 15   | Notice Detail                 | 공지사항 상세         | “/mark-group/notice/:id"           |
| 16   | Notice Create                 | 공지사항 등록         | “/mark-group/notice/write"         |
| 17   | Notice Update                 | 공지사항 수정         | “/mark-group/notice/write/:id"     |
| 18   | Manage Mark                   | 지식재산 관리         | “/mark-group/manage-mark"          |
| 19   | Mark Detail                   | 지식재산 상세         | “/mark-group/manage-mark/:id"      |
| 20   | Add Mark                      | 지식재산 등록         | “/mark-group/manage-mark/add"      |
| 21   | Edit Mark                     | 지식재산 수정         | “/mark-group/manage-mark/edit/:id" |
| 22   | Business Management           | 업무 관리             | “/mark-group/business"             |
| 23   | Personnel Management          | 인사 관리             | “/mark-group/personnel”            |

## CLIENT DEVELOPMENT

- [] 메인 페이지 [Mark.KDY]
- [] 요금제 안내 페이지 [Mark.KDY]
- [] 결제 페이지 [Mark.KDY]
- [] 프로젝트 현황 [Mark.KDY]
- [] 주간 업무 보고 [Mark.KDY]
- [] 게시판 [Mark.KDY]
- [] 지식재산 관리 [Mark.KDY]
- [] 업무 관리 [Mark.ABW]
- [] 인사 관리 [Mark.ABW]
- [] 공지사항 [Mark.ABW]

# js/commonUtils

| FUNCTION         | PARAMETER | DATA TYPE | RETURN  |
| :--------------- | :-------- | :-------- | :------ |
| numberWithCommas | value     | Number    | Integer |
| emptyCheck       | value     | All(\*)   | Boolean |
