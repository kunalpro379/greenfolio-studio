import { useEffect, useRef } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

const starter = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="d" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="p" isExecutable="false">
    <bpmn:startEvent id="s" name="Order placed"><bpmn:outgoing>f1</bpmn:outgoing></bpmn:startEvent>
    <bpmn:task id="t1" name="Charge card"><bpmn:incoming>f1</bpmn:incoming><bpmn:outgoing>f2</bpmn:outgoing></bpmn:task>
    <bpmn:endEvent id="e" name="Shipped"><bpmn:incoming>f2</bpmn:incoming></bpmn:endEvent>
    <bpmn:sequenceFlow id="f1" sourceRef="s" targetRef="t1"/>
    <bpmn:sequenceFlow id="f2" sourceRef="t1" targetRef="e"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="dg"><bpmndi:BPMNPlane id="pl" bpmnElement="p">
    <bpmndi:BPMNShape id="s_di" bpmnElement="s"><dc:Bounds x="180" y="160" width="36" height="36"/></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="t1_di" bpmnElement="t1"><dc:Bounds x="280" y="138" width="120" height="80"/></bpmndi:BPMNShape>
    <bpmndi:BPMNShape id="e_di" bpmnElement="e"><dc:Bounds x="470" y="160" width="36" height="36"/></bpmndi:BPMNShape>
    <bpmndi:BPMNEdge id="f1_di" bpmnElement="f1"><di:waypoint x="216" y="178"/><di:waypoint x="280" y="178"/></bpmndi:BPMNEdge>
    <bpmndi:BPMNEdge id="f2_di" bpmnElement="f2"><di:waypoint x="400" y="178"/><di:waypoint x="470" y="178"/></bpmndi:BPMNEdge>
  </bpmndi:BPMNPlane></bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export default function BpmnCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const modeler = new BpmnModeler({ container: ref.current });
    modeler.importXML(starter).catch(console.error);
    return () => modeler.destroy();
  }, []);
  return <div ref={ref} className="h-full w-full bg-paper" />;
}
