export const requestXmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="5.1.2">
  <collaboration id="Collaboration_082c66w">
    <participant id="Participant_0pd7pym" name="审核流程" processRef="Process" />
  </collaboration>
  <process id="Process" isExecutable="false">
    <startEvent id="StartEvent_1y45yut" name="开始">
      <outgoing>SequenceFlow_0h21x7r</outgoing>
    </startEvent>
    <task id="Task_1hcentk" name="流程开始">
      <incoming>SequenceFlow_0h21x7r</incoming>
      <outgoing>SequenceFlow_06o0wf0</outgoing>
    </task>
    <task id="Task_13intos" name="业务复核">
      <incoming>SequenceFlow_06o0wf0</incoming>
      <outgoing>SequenceFlow_1oydyx4</outgoing>
    </task>
    <endEvent id="EndEvent_0aot3cz" name="结束">
      <incoming>SequenceFlow_087c77r</incoming>
    </endEvent>
    <task id="Task_1jcp1lx" name="领导审批">
      <incoming>SequenceFlow_1oydyx4</incoming>
      <outgoing>SequenceFlow_087c77r</outgoing>
    </task>
    <sequenceFlow id="SequenceFlow_087c77r" sourceRef="Task_1jcp1lx" targetRef="EndEvent_0aot3cz" />
    <sequenceFlow id="SequenceFlow_1oydyx4" sourceRef="Task_13intos" targetRef="Task_1jcp1lx" />
    <sequenceFlow id="SequenceFlow_06o0wf0" sourceRef="Task_1hcentk" targetRef="Task_13intos" />
    <sequenceFlow id="SequenceFlow_0h21x7r" sourceRef="StartEvent_1y45yut" targetRef="Task_1hcentk" />
  </process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Collaboration_082c66w">
      <bpmndi:BPMNShape id="Participant_0pd7pym_di" bpmnElement="Participant_0pd7pym" isHorizontal="true">
        <omgdc:Bounds x="100" y="-5" width="700" height="250" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">
        <omgdc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="160" y="145" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1hcentk_di" bpmnElement="Task_1hcentk">
        <omgdc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_13intos_di" bpmnElement="Task_13intos">
        <omgdc:Bounds x="400" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_0aot3cz_di" bpmnElement="EndEvent_0aot3cz">
        <omgdc:Bounds x="742" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="749" y="145" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1jcp1lx_di" bpmnElement="Task_1jcp1lx">
        <omgdc:Bounds x="570" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_087c77r_di" bpmnElement="SequenceFlow_087c77r">
        <omgdi:waypoint x="670" y="120" />
        <omgdi:waypoint x="742" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1oydyx4_di" bpmnElement="SequenceFlow_1oydyx4">
        <omgdi:waypoint x="500" y="120" />
        <omgdi:waypoint x="570" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_06o0wf0_di" bpmnElement="SequenceFlow_06o0wf0">
        <omgdi:waypoint x="340" y="120" />
        <omgdi:waypoint x="400" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0h21x7r_di" bpmnElement="SequenceFlow_0h21x7r">
        <omgdi:waypoint x="188" y="120" />
        <omgdi:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;

export const processStatus = {
  id: "test_process",
  data: [
    {
      des: "已完成",
      status: "success",
      step: 1,
      stepTitle: "复核",
      taskStatus: "COMPLETED",
      xmlId: "Task_1hcentk",
    },
    {
      des: "当前处理",
      status: "finish",
      step: 2,
      stepTitle: "业务复核",
      taskStatus: "RUNNING",
      xmlId: "Task_13intos",
    },
    {
      des: "待执行",
      status: "wait",
      step: 3,
      stepTitle: "领导审批",
      taskStatus: "READY",
      xmlId: "Task_1jcp1lx",
    },
  ],
};
