import { RootState } from "@/reducers"
import { Button, Card, Col, Divider, Row } from "antd"
import axios from "axios"
import { useState } from "react"
import { useSelector } from "react-redux"
import {
    EP_AI_INTERVIEW_FB,
    EP_NAVER_BOOK_SEARCH,
    EP_CO_BING_SEARCH,
} from "@/endpoints"


export default function AIFeedback() {
    const interview_state = useSelector(( state: RootState ) => state.interview)
    const [ interview_feedback, set_interview_feedback ] = useState("Hello, World!")

    const onClick = () => {
        const interview_result = interview_state.history.map((v, i) => `${v.speaker}: ${v.text}`).join("\n")
        axios.post(EP_AI_INTERVIEW_FB, { interview_result }).then((resp) => {
            console.log(resp.data)
            const interview_fb = resp.data.feedback
            set_interview_feedback(interview_fb)
        }).catch((e) => {
            console.log(e)
        })
    }

    return (
        <div>
            <h2>OOO 님, 수고하셨어요</h2>
            <Row gutter={ 24 } justify="end" align="stretch">
                <Col>
                    <Button
                        type="primary"
                        style={{ width: 100 }}
                        onClick={ onClick }
                    >
                        피드백 받기
                    </Button>
                </Col>
            </Row>
            <Card title="면접 총평" style={{whiteSpace: "pre-wrap"}}>
                { interview_feedback }
            </Card>
            <Divider/>
            <h2>당신을 위해 추천해드려요</h2>
            <Row gutter={16}>
                <Col span={8}>
                <Card title="추천 도서" bordered={false}>
                    Card content
                </Card>
                </Col>
                <Col span={8}>
                <Card title="추천 강의" bordered={false}>
                    Card content
                </Card>
                </Col>
                <Col span={8}>
                <Card title="추천 ??" bordered={false}>
                    Card content
                </Card>
                </Col>
            </Row>
            <Divider/>
            <h2>당신이 희망하는 OOO 회사는 지금?</h2>
            <Card>
                Card content
            </Card>
        </div>
    )
}