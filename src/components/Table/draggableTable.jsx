import React, { PureComponent } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';

const closest = function (el, selector, rootNode) {
  rootNode = rootNode || document.body;
  const matchesSelector =
    el.matches ||
    el.webkitMatchesSelector ||
    el.mozMatchesSelector ||
    el.msMatchesSelector;
  while (el) {
    const flagRoot = el === rootNode;
    if (flagRoot || matchesSelector.call(el, selector)) {
      if (flagRoot) {
        el = null;
      }
      break;
    }
    el = el.parentElement;
  }
  el.setAttribute('style', 'border: 50px solid red;');
  return el;
};

class Demo extends PureComponent {
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    // accumulatedPercentage: "31.82"
    // cumulativeFrequency: 21
    // frequency: 21
    // relativeFrequency: "31.82"
    // value: "1000"
    this.state = {
      data: [
        {
          title: '0',
          accumulatedPercentage: '31.82',
          cumulativeFrequency: 21,
          frequency: 21,
          relativeFrequency: '31.82',
          value: '1000',
          key: '1'
        },
        {
          title: '1',
          accumulatedPercentage: '31.82',
          cumulativeFrequency: 21,
          frequency: 21,
          relativeFrequency: '31.82',
          value: '1000',
          key: '2'
        }
        ,
        {
          title: '2',
          accumulatedPercentage: '31.82',
          cumulativeFrequency: 21,
          frequency: 21,
          relativeFrequency: '31.82',
          value: '1000',
          key: '3'
        },
        {
          title: '3',
          accumulatedPercentage: '31.82',
          cumulativeFrequency: 21,
          frequency: 21,
          relativeFrequency: '31.82',
          value: '1000',
          key: '4'
        }
      
      ],
      dragIndex: -1,
      draggedIndex: -1,
    };
    this.columns = [
      {
        title: 'id',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Variável',
        dataIndex: 'value',
        key: 'content',
      },
      {
        title: 'Fi',
        dataIndex: 'frequency',
        key: 'content',
      },
      {
        title: 'Fac',
        dataIndex: 'cumulativeFrequency',
        key: 'content',
      },
      {
        title: 'Fr%',
        dataIndex: 'accumulatedPercentage',
        key: 'content',
      },
      {
        title: 'Fac%',
        dataIndex: 'relativeFrequency',
        key: 'content',
      },
      
      {
        title: 'Operates',
        key: 'operate',
        render: (text, record, index) =>
          <span>
            {(this.state.dragIndex >= 0 &&
              this.state.dragIndex !== this.state.draggedIndex &&
              index === this.state.draggedIndex &&
              <span
                className={`drag-target-line ${this.state.draggedIndex <
                  this.state.dragIndex
                  ? 'drag-target-top'
                  : ''}`}
              />) ||
              ''}
            <a
              className="drag-handle"
              draggable="false"
              onMouseDown={this.onMouseDown}
              href="#"
            >
              VaiDar
            </a>
          </span>,
      },
    ];
  }

  onMouseDown(e) {
    const target = this.getTrNode(e.target);
    if (target) {
      target.setAttribute('draggable', true);
      target.ondragstart = this.onDragStart;
      target.ondragend = this.onDragEnd;
    }
  }

  onDragStart(e) {
    const target = this.getTrNode(e.target);
    if (target) {
      //       e.dataTransfer.setData('Text', '');
      e.dataTransfer.effectAllowed = 'move';
      target.parentElement.ondragenter = this.onDragEnter;
      target.parentElement.ondragover = function (ev) {
        ev.preventDefault();
        return true;
      };
      const dragIndex = target.rowIndex - 1;
      this.setState({ dragIndex, draggedIndex: dragIndex });
    }
  }

  onDragEnter(e) {
    const target = this.getTrNode(e.target);
    this.setState({
      draggedIndex: target ? target.rowIndex - 1 : -1,
    });
  }

  onDragEnd(e) {
    const target = this.getTrNode(e.target);
    if (target) {
      target.setAttribute('draggable', false);
      target.ondragstart = null;
      target.ondragend = null;
      target.parentElement.ondragenter = null;
      target.parentElement.ondragover = null;
      this.changeRowIndex();
    }
  }

  getTrNode(target) {
    return closest(target, 'tr');
  }

  changeRowIndex() {
    const result = {};
    const currentState = this.state;
    result.dragIndex = result.draggedIndex = -1;
    if (
      currentState.dragIndex >= 0 &&
      currentState.dragIndex !== currentState.draggedIndex
    ) {
      const { dragIndex, draggedIndex, data: oldData } = currentState;
      const data = [...oldData];
      //       const data = oldData;
      const item = data.splice(dragIndex, 1)[0];
      data.splice(draggedIndex, 0, item);
      result.data = data;
      result.dragIndex = -1;
      result.draggedIndex = -1;
    }
    this.setState(result);
  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <h2>Table row dragging</h2>
        <Table
        id='students'
          className={(this.state.dragIndex >= 0 && 'dragging-container') || ''}
          //           ref="dragContainer"
          columns={this.columns}
          pagination={false}
          dataSource={this.state.data}
        />
      </div>
    );
  }
}
export default Demo;
