import { RootState } from "@/reducers"
import { Card, Col, Divider, Row } from "antd"
import axios from "axios"
import { useState } from "react"
import { useSelector } from "react-redux"

const EP_AI_INTERVIEW_FB = "http://localhost:8001"

export default function AIFeedback() {
    const interview_state = useSelector(( state: RootState ) => state.interview)

    axios.post(EP_AI_INTERVIEW_FB, {}).then((value) => {
        set_interview_feedback(value.data as string)
    }).catch((e) => {
        console.log(e)
    })

    const [ interview_feedback, set_interview_feedback ] = useState("Hello, World!")

    return (
        <div>
            <h2>OOO 님, 수고하셨어요</h2>
            <Card title="면접 총평">
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