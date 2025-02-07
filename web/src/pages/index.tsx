import React, { useState } from 'react';
import Image from "next/image"
import { Layout, Menu, Steps, theme } from 'antd';
import { StepProps } from 'antd/es/steps';

import AIResume from '@/components/ai_resume';
import AIInterview from '@/components/ai_interview';
import AIFeedback from '@/components/ai_feedback';

const { Header, Content, Footer } = Layout;


export default function Main() {
  const {token: { colorBgContainer, borderRadiusLG }} = theme.useToken();
  const [current, setCurrent] = useState(0);

  const steps: StepProps[] = [
      {
          title: 'Step 1',
          subTitle: 'AI 이력서 첨삭',
          status: current > 0 ? 'finish' : "process",
          description: '이력서 한방에 해결!',
      },
      {
          title: 'Step 2',
          subTitle: 'AI 모의 면접',
          status: current > 1 ? 'finish' : "process",
          description: '면접까지 한방에!',
      },
      {
          title: 'Step 3',
          subTitle: 'AI 피드백',
          status: current > 2 ? 'finish' : "process",
          description: '완벽하게 보완하기!',
      },
  ]

  const onChange = (value: number) => {
    setCurrent(value);
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" >
            <Image src="/jkam.png" alt="Logo" width={ 91 } height={ 91 } />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["0"]}
          items={[ { key: "0", label: "JK x AM Jobis" } ]}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <Steps
            type="navigation"
            size="small"
            current={current}
            onChange={onChange}
            className="site-navigation-steps"
            items={steps}
        />
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <div>
            { current == 0 && <AIResume/> }
            { current == 1 && <AIInterview/> }
            { current == 2 && <AIFeedback/> }
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        JK x AM Jobis ©{new Date().getFullYear()} Created by 유부초밥
      </Footer>
    </Layout>
  );
}