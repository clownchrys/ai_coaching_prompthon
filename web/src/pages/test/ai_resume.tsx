import React, { useState } from 'react';
import Image from "next/image"
import { Layout, Menu, Steps, theme } from 'antd';
import { ItemType, MenuItemType } from 'antd/es/menu/interface';
import { StepProps } from 'antd/es/steps';
import AIResume from '@/components/ai_resume';

const { Header, Content, Footer } = Layout;

// const items = new Array(1).fill(null).map((_, index) => ({
//   key: index + 1,
//   label: `nav ${index + 1}`,
// }));

const steps: StepProps[] = [
    {
        title: 'Step 1',
        subTitle: 'AI 이력서 첨삭',
        status: 'process',
        // status: 'finish',
        description: '이력서 한방에 해결!',
    },
    {
        title: 'Step 2',
        subTitle: 'AI 모의 면접',
        status: 'process',
        description: '면접까지 한방에!',
    },
    {
        title: 'Step 3',
        subTitle: 'AI 피드백',
        status: 'wait',
        description: '완벽하게 준비하기!',
    },
]

export default function Main() {
  const {token: { colorBgContainer, borderRadiusLG }} = theme.useToken();
  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    console.log('onChange:', value);
    setCurrent(value);
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" >
            <Image src="/jkam.png" alt="Jobkorea Logo" width={ 91 } height={ 91 } />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["0"]}
          items={[ { key: "0", label: "AI Coach Service" } ]}
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
            <AIResume/>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        JK x AM AI 코치 서비스 ©{new Date().getFullYear()} Created by 유부초밥
      </Footer>
    </Layout>
  );
}