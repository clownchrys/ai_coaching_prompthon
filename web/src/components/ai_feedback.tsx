import { RootState } from "@/reducers"
import { Button, Card, Col, Divider, Form, Input, Row } from "antd"
import axios from "axios"
import { useState } from "react"
import { useSelector } from "react-redux"
import {
    EP_AI_INTERVIEW_FB,
    EP_NAVER_BOOK_SEARCH,
    EP_CO_BING_SEARCH,
} from "@/endpoints"
import Link from "next/link"

type BookInfo = {
    title: string,
    description: string,
    recommendation_reason: string,
    link: string
}

type FormValues = {
    job_position: string,
    topic: string,
    company: string,
}

export default function AIFeedback() {
    const interview_state = useSelector(( state: RootState ) => state.interview)
    const [ interview_feedback, set_interview_feedback ] = useState("Hello, World!")
    const [ book_info, set_book_info ] = useState<BookInfo>()
    const [ company_trend, set_company_trend ] = useState("Hello, World!")

    const onFinish = (v: FormValues) => {
        const interview_result = interview_state.history.map((v, i) => `${v.speaker}: ${v.text}`).join("\n")
        axios.post(EP_AI_INTERVIEW_FB, { interview_result }).then((resp) => {
            console.log(resp.data)
            const interview_fb = resp.data.feedback
            set_interview_feedback(interview_fb)
        }).catch((e) => {
            console.log(e)
        })

        const {job_position, topic, company} = v;

        axios.post(EP_NAVER_BOOK_SEARCH, { job_position, topic }).then((resp) => {
            console.log(resp.data)
            const books = JSON.parse(resp.data.books)
            set_book_info(books)
        })

        axios.post(EP_CO_BING_SEARCH, {topic: company}).then((resp) => {
            console.log(resp.data)
            const trend = resp.data.result
            set_company_trend(trend)
        })
    }

    return (
        <div>
            <h2>OOO 님, 수고하셨어요</h2>
            <Form
                name="nest-messages"
                onFinish={ onFinish }
                initialValues={{
                    job_position: "데이터엔지니어",
                    topic: "Airflow",
                    company: "기아자동차"
                } as Partial<FormValues>}
            >
                <Row gutter={ 24 } justify="end" align="middle">
                    <Form.Item required name="job_position" label="직무" style={{marginRight: 30}}>
                        <Input placeholder="for 도서 추천" />
                    </Form.Item>
                    <Form.Item required name="topic" label="주제 분야" style={{marginRight: 30}}>
                        <Input placeholder="for 도서 추천" />
                    </Form.Item>
                    <Form.Item required name="company" label="대상 기업">
                        <Input placeholder="for 기업 동향" />
                    </Form.Item>
                </Row>
                <Form.Item label={null}>
                    <Row gutter={ 24 } justify="end" align="middle">
                        <Col>
                            <Button
                                type="primary"
                                style={{ width: 100 }}
                                // onClick={ onClick }
                                htmlType="submit"
                            >
                                피드백 받기
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
            <Card title="면접 총평" style={{whiteSpace: "pre-wrap"}}>
                { interview_feedback }
            </Card>
            <Divider/>
            <h2>앞으로가 더 빛날 당신을 위해 추천해드려요</h2>
            <Row gutter={16}>
                <Col span={8}>
                <Card title="추천 도서" bordered={false}>
                    <h3>제목: { book_info && book_info.title }</h3>
                    <br/>
                    <p>설명: { book_info && book_info.description }</p>
                    <br/>
                    <p>추천 사유: { book_info && book_info.recommendation_reason }</p>
                    { book_info && 
                    <>
                        <br/>
                        <p>링크: </p>
                        <Link passHref target="_blank" rel="noopener noreferrer" href={ book_info && book_info.link || "" }>
                            { book_info && book_info.link || "no link" }
                        </Link>
                    </>
                    }
                </Card>
                </Col>
                <Col span={8}>
                <Card title="추천 강의" bordered={false}>
                    To be continued...
                </Card>
                </Col>
                <Col span={8}>
                <Card title="추천 ??" bordered={false}>
                    To be continued...
                </Card>
                </Col>
            </Row>
            <Divider/>
            <h2>당신이 희망하는 OOO 회사는 지금?</h2>
            <Card style={{whiteSpace: "pre-wrap"}}>
                { company_trend }
            </Card>
        </div>
    )
}