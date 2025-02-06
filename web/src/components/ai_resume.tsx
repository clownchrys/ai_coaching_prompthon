import { Form, Input, Button, Col, Row, Divider, Carousel, Flex, Table, TableColumnsType, TableProps } from "antd";
import Highlighter from "react-highlight-words";
import { useState } from "react";

interface DataType {
    key: React.Key;
    text: string;
    reason: string;
}

const columns: TableColumnsType<DataType> = [
    {
      title: '제안',
      dataIndex: 'text',
    //   render: (text: string) => <a>{text}</a>,
    },
    {
      title: '이유',
      dataIndex: 'reason',
    },
  ];

const data: DataType[] = [
    {
      key: '1',
      text: '웹 애플리케이션 개발을 통해 서비스 응답 시간을 25% 단축시키고, 사용자 만족도를 15% 향상시켰습니다.',
      reason: '구체적인 숫자를 통해 성과를 명확히 제시하여 전문성을 강화할 수 있습니다.',
    },
    {
      key: '2',
      text: '5명의 팀원과 협력하여 웹 애플리케이션을 3개월 내에 개발, 성공적으로 2000명의 사용자에게 서비스 런칭하였습니다.',
      reason: '팀워크와 프로젝트 성과를 수치적으로 보여주어 협업 능력과 전문성을 동시에 부각할 수 있습니다.',
    },
    {
      key: '3',
      text: '웹 애플리케이션 유지보수를 통해 버그 발생률을 40% 감소시키고, 평균 응답 속도를 30% 개선하였습니다.',
      reason: '구체적인 수치로 사용자 경험의 개선을 보여주어 효과적인 결과를 강조할 수 있습니다.',
    },
  ];

// rowSelection object indicates the need for row selection
const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.reason === 'Disabled User', // Column configuration not to be checked
      text: record.text,
    }),
  };
  
const onFinish = (values: any) => {
    console.log(values);
};

const carouselStyle: React.CSSProperties = {
    margin: 0,
    // height: '160px',
    color: '#fff',
    minHeight: '160px',
    width: "100%",
    textAlign: 'center',
    // background: '#364d79',
    background: 'lightslategrey',
    padding: '20px'
};

const defaultResume = `
이력서

이름: 홍길동
주소: 서울특별시 강남구 테헤란로 123
전화번호: 010-1234-5678
이이메일: kim.jimin@email.com
생년월일: 1990년 5월 15일

학력

서울대학교

학사, 컴퓨터공학
2010년 3월 - 2014년 2월

고려대학교
석사, 소프트웨어공학
2014년 3메일:** honggildong@example.com
LinkedIn: linkedin.com/in/honggildong
 
목표
혁신적인 IT 솔루션을 제공하는 ABC 테크놀로지에서 소프트웨어 엔지니어로서의 경력을 쌓고, 팀과 함께 기술적 도전을 해결하며 성장하고자 합니다.
 
학력
서울대학교
컴퓨터공학 학사, 2020년 2월 졸업

학점: 3.8/4.0
주요 과목: 데이터베이스 시스템, 알고리즘, 소프트웨어 공학

월 - 2016년 2월
 
경력

ABC 테크

소프트웨어 엔지니어
2016년 3월 - 현재
웹 애플리케이션 개발 및 유지보수
Agile 방법론을 통한 팀 프로젝트 관리
사용자 요구사항 분석 및 시스템 설계

**XYZ 솔---

경력
XYZ 소프트웨어 - 서울특별시
주니어 소프트웨어 엔지니어
2020년 3월 - 현재

다양한 클라이언트의 요구에 맞춘 웹 애플리케이션 개발
Java, Python, JavaScript를 사용하여 REST루션즈**
인턴 소프트웨어 개발자
2015년 6월 - 2015년 8월
Java 기반의 기업용 애플리케이션 개발 지원
데이터베이스 설계 및 쿼리 최적화
 
기술 스킬

프로그래밍 언어: Java, Python, JavaScriptful API 설계 및 구현
팀원들과 협력하여 코드 리뷰 및 품질 개선 작업 수행
Agile 방법론을 적용하여 프로젝트 관리 및 진행 상황 보고

인턴십
DEF 테크놀로지 - 서울특별시
소프트웨어 개발 인턴
2019년
웹 개발: HTML, CSS, React, Node.js
데이터베이스: MySQL, MongoDB
도구 및 프레임워크: Git, Docker, JIRA
클라우드 서비스: AWS, Azure
 
자격증

정보처리기사 (20156월 - 2019년 8월
프론트엔드 개발 팀에서)
AWS 공인 솔루션스 아키텍트 – 어소시에이트 (2021)
 
활동 및 수상 경력

서울대학교 프로그래밍 경진대회 1위 (2013)
ABC 테크 내부 해커톤 최우수상 수상 (2020)
 
자기소개서

안녕하세요, 김지민 React.js를 사용하여 사용자 인터페이스 개선

테스트 자동화를 위한 스크립트 작성 및 유지보수
주간 회의에서 진행 상황 발표 및 피드백 수렴
 
기술 스택

프로그래밍 언어: Java, Python, JavaScript, C++
웹 프레임워크: React.js, Node.js
데이터베이스: MySQL, MongoDB입니다. 저는 ABC 테크에서 7년간 소프트웨어 엔지니어로서 다양한 프로젝트를 수행하며 기술적 역량을 쌓아왔습니다. 특히, 사용자 요구사항을 분석하고 그에 맞는 솔루션을 제시하는 데 강점을 가지고 있습니다. 팀워크와 커뮤니케이션 능력을 바탕으로 프로젝트를 성공적으로 이끌어 나가며, 지속적인
도구: Git, Docker, JIRA
 
자격증

정보처리기사 (2021년 취득 학습과 성장을 통해 기업과 함께 발전하고자 합니다. 감사합니다.

`

export default function AIResume() {
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    return (
        <div>
            <Form
                // {...layout}
                name="nest-messages"
                onFinish={ onFinish }
                // style={{ maxWidth: 600 }}
                initialValues={{
                    resume: defaultResume
                }}
            >
                <Form.Item name="resume" label="내 이력서">
                    <Input.TextArea style={{ height: 150 }} />
                </Form.Item>
                <Form.Item label={null}>
                    <Row gutter={ 24 } justify="end" align="middle">
                        <Col>
                            <Button type="primary" htmlType="submit" style={{ width: 100 }}>첨삭하기</Button></Col>
                        <Col>
                            <Button onClick={ () => alert("유저 이력서 연동하기") } style={{ width: 100 }}>저장하기</Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>

            <Divider orientation="left">아래 화면에서 첨삭을 진행하세요</Divider>

            <div style={{whiteSpace: "pre-wrap", paddingLeft: 66.24}}>
                <Carousel arrows infinite={false} adaptiveHeight>
                    <div>
                        <Table<DataType>
                            rowSelection={{ type: "radio", ...rowSelection }}
                            columns={columns}
                            dataSource={data}
                            title={() => <h2>원본 텍스트: "웹 애플리케이션 개발 및 유지보수"</h2>}
                        />
                    </div>
                    {/* <div style={{display: "table"}}>
                        <div style={carouselStyle}>
                            "text": "", <br/>
                            "suggestion": <br/>
                        </div>
                    </div> */}
                    <div>
                        <h3 style={carouselStyle}>2</h3>
                    </div>
                    <div>
                        <h3 style={carouselStyle}>3</h3>
                    </div>
                    <div>
                        <h3 style={carouselStyle}>4</h3>
                    </div>
                </Carousel>
                <Flex vertical={false} style={{marginTop: 20, marginBottom: 20}}>
                    <div style={{width: "50%", padding: 15, backgroundColor: "#1677ff3f"}}>
                        <Highlighter
                            searchWords={["웹 애플리케이션 개발 및 유지보수"]}
                            textToHighlight={defaultResume}
                            autoEscape
                            highlightStyle={{ fontWeight: 'normal' }}
                        />
                    </div>
                    <div style={{width: "50%", padding: 15, backgroundColor: "#04bf033f"}}>
                        <Highlighter
                            searchWords={["웹 애플리케이션 개발을 통해 서비스 응답 시간을 25% 단축시키고, 사용자 만족도를 15% 향상시켰습니다."]}
                            textToHighlight={defaultResume.replaceAll("웹 애플리케이션 개발 및 유지보수", "웹 애플리케이션 개발을 통해 서비스 응답 시간을 25% 단축시키고, 사용자 만족도를 15% 향상시켰습니다.")}
                            autoEscape
                            highlightStyle={{ fontWeight: 'normal' }}
                        />
                    </div>
                </Flex>
                <Row gutter={ 24 } justify="end" align="middle">
                    <Col>
                        <Button type="primary" htmlType="submit" style={{ width: 100 }}>수정하기</Button>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

