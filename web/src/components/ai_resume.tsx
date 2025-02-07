import { Form, Input, Button, Col, Row, Divider, Carousel, Flex, Table, TableColumnsType, TableProps } from "antd";
import Highlighter from "react-highlight-words";
import { useState } from "react";
import { defaultResume } from "@/tmp"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/reducers";
import { actions as resumeAction } from "@/reducers/resume";
import axios from "axios";
import { EP_AI_RESUME } from "@/endpoints";

interface DataType {
    key: React.Key;
    text: string;
    reason: string;
}

const columns: TableColumnsType<DataType> = [
    {
        title: '제안',
        dataIndex: 'text',
    },
    {
        title: '이유',
        dataIndex: 'reason',
    },
];

 const carouselStyle: React.CSSProperties = {
    margin: 0,
    color: '#fff',
    minHeight: '160px',
    width: "100%",
    textAlign: 'center',
    background: 'lightslategrey',
    padding: '20px'
};

type SuggestionResponse = {
    text: string,
    suggestion: [
        {text: string, reason: string},
        {text: string, reason: string},
        {text: string, reason: string},
    ]
}

const defaultSuggestion: SuggestionResponse = {
    text: "웹 애플리케이션 개발 및 유지보수",
    // text: "Agile 방법론을 통한 팀 프로젝트 관리",
    suggestion: [
        {
            text: "웹 애플리케이션 개발을 통해 서비스 응답 시간을 25% 단축시키고, 사용자 만족도를 15% 향상시켰습니다.",
            reason: "구체적인 숫자를 통해 성과를 명확히 제시하여 전문성을 강화할 수 있습니다."
        },
        {
            text: "5명의 팀원과 협력하여 웹 애플리케이션을 3개월 내에 개발, 성공적으로 2000명의 사용자에게 서비스 런칭하였습니다.",
            reason: "팀워크와 프로젝트 성과를 수치적으로 보여주어 협업 능력과 전문성을 동시에 부각할 수 있습니다."
        },
        {
            text: "웹 애플리케이션 유지보수를 통해 버그 발생률을 40% 감소시키고, 평균 응답 속도를 30% 개선하였습니다.",
            reason: "구체적인 수치로 사용자 경험의 개선을 보여주어 효과적인 결과를 강조할 수 있습니다."
        },
    ]
}

export default function AIResume() {
    const dispatch = useDispatch()
    const resume_state = useSelector(( state: RootState ) => state.resume)
    const [ suggestion, set_suggestion ] = useState<SuggestionResponse>(defaultSuggestion)
    const [ selected_suggestion, set_selected_suggestion ] = useState<string>("")

    // rowSelection object indicates the need for row selection
    const rowSelection: TableProps<DataType>['rowSelection'] = {
        type: "radio",
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            set_selected_suggestion(selectedRows[0].text)
        },
        getCheckboxProps: (record: DataType) => ({
            disabled: record.reason === 'Disabled User', // Column configuration not to be checked
            text: record.text,
        }),
    };

    const save_resume = (v: {resume?: string}) => {
        console.log(v)
        axios.post(EP_AI_RESUME, {resume: v.resume}).then((resp) => {
            const suggestion = JSON.parse(resp.data.output)
            console.log(suggestion)
            set_suggestion(suggestion)
        }).catch((e) => {
            console.log(e)
        })
        dispatch(resumeAction.set({ currentResume: v.resume ? v.resume : "" }))
    }

    const data = suggestion.suggestion.map((v, i) => {
        return { key: i + 1, ...v} as DataType
    }) 

    return (
        <div>
            <Form
                name="nest-messages"
                onFinish={ save_resume }
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
                            <Button type="primary" htmlType="submit" style={{ width: 100 }}>첨삭하기</Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>

            <Divider orientation="left">아래 화면에서 첨삭을 진행하세요</Divider>

            <div style={{whiteSpace: "pre-wrap", paddingLeft: 66.24}}>
                <Carousel arrows infinite={false} adaptiveHeight onSwipe={(v) => {alert(v)}}>
                    <div>
                        <Table<DataType>
                            columns={columns}
                            dataSource={data}
                            title={() => <h2>원본 텍스트: "웹 애플리케이션 개발 및 유지보수"</h2>}
                            pagination={false}
                            rowSelection={rowSelection}
                            style={carouselStyle}
                            // onRow={(data, index) => ({ onClick: () => set_selected_suggestion(data.text) })}
                        />
                    </div>
                    <div>
                        <Table<DataType>
                            columns={columns}
                            dataSource={data}
                            title={() => <h2>원본 텍스트: "웹 애플리케이션 개발 및 유지보수"</h2>}
                            pagination={false}
                            rowSelection={rowSelection}
                            style={carouselStyle}
                        />
                    </div>
                </Carousel>
                <Flex vertical={false} style={{marginTop: 20, marginBottom: 20}}>
                    <div style={{width: "50%", padding: 15, backgroundColor: "#1677ff3f"}}>
                        <Highlighter
                            searchWords={[suggestion.text]}
                            textToHighlight={resume_state.currentResume}
                            autoEscape
                            highlightStyle={{ fontWeight: 'normal' }}
                        />
                    </div>
                    <div style={{width: "50%", padding: 15, backgroundColor: "#04bf033f"}}>
                        <Highlighter
                            searchWords={[selected_suggestion]}
                            textToHighlight={resume_state.currentResume.replaceAll(suggestion.text, selected_suggestion)}
                            autoEscape
                            highlightStyle={{ fontWeight: 'normal' }}
                        />
                    </div>
                </Flex>
                <Row gutter={ 24 } justify="end" align="middle">
                    <Col>
                        <Button
                            type="primary"
                            onClick={(v) => save_resume({resume: resume_state.currentResume.replaceAll(suggestion.text, selected_suggestion) })}
                            style={{ width: 100 }}
                        >수정하기</Button>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

