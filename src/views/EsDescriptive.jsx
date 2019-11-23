import React from "react";
import { MDBRow, MDBCol } from 'mdbreact';
import { Save, AddCircle } from 'grommet-icons';
import Stepper from 'react-stepper-horizontal';
import { TagInput } from '../components/reactjs-tag-input';
import InputRange from 'react-input-range';
import '../assets/css/all.css';
import '../assets/css/table.css';
import 'react-input-range/lib/css/index.css';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import NotificationAlert from "react-notification-alert";

import {
    Button,
    Badge,
    ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Nav,
    NavItem,
    Alert,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    ListGroup,
    ListGroupItem,
} from "reactstrap";
import { Table } from 'antd';
import { DotLoader } from 'react-spinners';
import { css } from 'emotion'
import Papa from 'papaparse';
import { Doughnut } from 'react-chartjs-2';
import csvicon from '../assets/img/csv.svg';
import '../assets/css/antdtable.css';
import "react-table/react-table.css";
import '../assets/css/csv.css';

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
    return el;
};
var defaultMessage = localStorage.getItem('defaultLanguage') !== 'pt-br' ? require('../locales/en-us.js') : require('../locales/pt-br.js');

class Descriptive extends React.Component {
    constructor(props) {
        super(props);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.state = {
            steps: [
                { title: '' },
                { title: '' },
                { title: '' }],
            data: {
                datasets: [{
                    backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                    data: [10, 20, 30]
                }],
                labels: [
                    'Red',
                    'Yellow',
                    'Blue'
                ]
            },
            tags: [],
            vet: [],
            collapse: false,
            stepPosition: 0,
            btncolor: "primary",
            focused: "",
            PopAmost: "",
            Type: "",
            Var: '',
            step: 1,
            value: 0,
            MedSep: "Percentil",
            cSelected: [],
            items: [],
            test: [],
            loading: false,
            loadingsv: false,
            modalDemo: false,
            modalHelp: false,
            acceptedFiles: '',
            btnSave: true,
            dispcsv: false,
            csv: null,
            csvfile: undefined,
            dragIndex: -1,
            draggedIndex: -1,
        };
        this.header = css({
            // backgroundColor: 'transparent',
            background: '#e5e5e5',
            borderWidth: '0px',
            borderStyle: 'solid',
            color: 'white',
            '& table': {
                borderCollapse: 'collapse'
            },
            '& thead > tr > th': {
                color: 'white',
                fontStyle: 'bold',
                background: 'linear-gradient(to bottom right, #550300, #d32a23, #550300)',
            },
            '& thead > tr': {
                color: 'white',
                fontStyle: 'bold',
                background: 'linear-gradient(to bottom right, #550300, #d32a23, #550300)',
            }
        });
        this.columns = [
            {
                title: 'Variável',
                dataIndex: 'value',
                align: 'center',
            },
            {
                title: 'Fi',
                dataIndex: 'frequency',
                align: 'center',
            },
            {
                title: 'Fac',
                dataIndex: 'cumulativeFrequency',
                align: 'center',
            },
            {
                title: 'Fr%',
                dataIndex: 'accumulatedPercentage',
                align: 'center',
            },
            {
                title: 'Fac%',
                dataIndex: 'relativeFrequency',
                align: 'center',
            },

            {
                title: 'Operates',
                key: 'operate',
                width: '90px',
                align: 'center',
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
                            <i class="fas fa-arrows-alt" />
                        </a>
                    </span>,
            },
        ];
        this.onTagsChanged = this.onTagsChanged.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
        this.updateData = this.updateData.bind(this);
    };

    onDismissCSV = () => {
        this.setState({
            csvfile: '',
            csv: '',
            acceptedFiles: '',
            csvdata: null
        });
    };

    toggleModalDemo() {
        this.setState({
            modalDemo: !this.state.modalDemo
        });
    };

    toggleModalHelp = () => {
        this.setState({
            modalHelp: !this.state.modalHelp
        });
    };

    handlecsvChange = event => {
        if (event.target.files[0].name.includes('.csv')) {
            this.setState({
                csvfile: event.target.files[0],
                csv: 'has-csv',
                acceptedFiles: event.target.files[0].name,
                dispcsv: false
            });
        } else {
            this.notify('br', defaultMessage.Correg.csv.error3, 'fas fa-exclamation-triangle', 'danger');
        }
    };

    importCSV = () => {
        const { csvfile } = this.state;
        Papa.parse(csvfile, {
            skipEmptyLines: 'greedy',
            // dynamicTyping: true,
            keepEmptyRows: false,
            complete: this.updateData,
            header: true,
        });
    };

    updateData = (result) => {
        var data = result.data;
        var keys = Object.keys(data[0]);
        var arrfull = [];
        var pass = true;
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === '') {
                keys.splice(i, 1);
            }
        };
        if (keys.length !== 1) {
            this.notify('br', defaultMessage.Correg.csv.error1, 'fas fa-exclamation-triangle', 'danger');
        } else {
            for (i = 0; i < data.length; i++) {
                // eslint-disable-next-line no-loop-func
                Object.keys(data[0]).forEach(function (key) {
                    if (data[i][key] !== undefined && data[i][key] !== '') {
                        var inputValue = data[i][key];
                        inputValue = inputValue.replace(/\s{2,}/g, ' ');
                        inputValue = inputValue.replace(/-{2,}/g, '-');
                        inputValue = inputValue.replace(/,{1,}/g, '.');
                        inputValue = inputValue.replace(/\.{2,}/g, '.');
                        inputValue = inputValue.replace(/\;{2,}/g, ';');
                        inputValue = inputValue.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s,-\.\;])/g, '');
                        if (isNaN(inputValue)) {
                            inputValue = inputValue.replace(/,{1,}/g, '.');
                            inputValue = inputValue.replace(/\.{1,}/g, '');
                        };
                        arrfull.push(inputValue);
                    }
                })
            };
            if (pass) {
                this.setState({ csvdata: data });
                if (this.state.Var === '') {
                    this.setState({ Var: keys[0] });
                }
                let aux = [];
                var pos = 1;

                if (this.state.tags.length > 0) {
                    aux = this._toConsumableArray(this.state.tags);
                    pos = this.state.tags.length
                }
                for (i = 0; i < arrfull.length; i++) {
                    aux = [].concat(aux, [{
                        index: pos,
                        displayValue: arrfull[i]
                    }]);
                    pos++;
                }
                this.setState({
                    tags: aux,
                    dispcsv: true
                });
            }
            else {
                this.notify('br', defaultMessage.Correg.csv.error2, 'fas fa-exclamation-triangle', 'danger');
            }
        };
    };

    _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } };

    onRadioBtnClick(categ, rSelected) {
        if (rSelected !== 'Ordinal') {
            this.setState({
                collapse: false
            });
        } else {
            this.setState({
                collapse: true
            });
        }

        if (categ === 'QntQuali') {
            this.setState({ rSelected });
        } else if (categ === 'PopAmost') {
            this.setState({
                PopAmost: rSelected
            });
        }
    }

    buttoncolor(categ, btn) {
        if (categ === 'QntQuali') {
            if (btn === this.state.rSelected) {
                return "primary"
            } else { return "secondary" }
        }
        else if (categ === 'PopAmost') {
            if (btn === this.state.PopAmost) {
                return "primary"
            } else { return "secondary" }
        }
    }

    notify = (place, message, icon, color) => {
        var options = {
            place: place,
            message: (
                <div>
                    <div>
                        {message}
                    </div>
                </div>
            ),
            type: color,
            icon: icon,
            autoDismiss: 7
        };
        this.refs.notificationAlert.notificationAlert(options);
    };

    async SendArray() {
        let aux = [];
        for (let i = 0; i < this.state.tags.length; i++) {
            aux.push((this.state.tags[i].displayValue));
        }
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({
                "varPesq": this.state.Var,
                "data": aux,
                "subTypeMeasure": this.state.rSelected,
                "amost": this.state.PopAmost,
                "language": localStorage.getItem('defaultLanguage')
            }),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }),
        };

        try {
            const response = await fetch('https://datatongji-backend.herokuapp.com/descriptive/simple_frequency', requestInfo);
            var result = await response.json();
            console.log(result);
            if (response.ok) {
                this.setState({
                    Type: result.typeVar,
                    weightedMean: result.weightedMean,
                    median: result.median,
                    variance: result.variance,
                    deviation: result.deviation,
                    coefvar: result.coefvar,
                    percentile: result.percentile,
                    rSelected: result.subType,
                    loading: false
                });
                if (result.mode.length > 1) {
                    let m = result.mode[0].Value;
                    for (let i = 1; i < result.mode.length; i++) {
                        m = m + ' | ' + result.mode[i].Value;
                    }
                    this.setState({ mode: m })
                } else {
                    this.setState({ mode: result.mode[0].Value })
                }
                this.setState({ vet: result.dataDescriptive });
            } else {
                throw new Error(result.error);
            }
        }
        catch (e) {
            this.notify('br', e.message, 'fas fa-exclamation-triangle', 'danger');
            this.setState({
                loading: false
            });
        }
    };

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
                //         ev.target.dataTransfer.effectAllowed = 'none'
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
            const { dragIndex, draggedIndex, vet: oldData } = currentState;
            const vet = [...oldData];
            //       const data = oldData;
            const item = vet.splice(dragIndex, 1)[0];
            vet.splice(draggedIndex, 0, item);
            result.vet = vet;
            result.dragIndex = -1;
            result.draggedIndex = -1;
        }
        this.setState(result);
    }

    renderTableHeader() {
        let header = Object.keys(
            { Variável: 'se', Fi: '2', Fac: 2, 'Fr%': '25.00', 'Fac%': '25.00' }
        )
        return header.map((key, index) => {
            return <th key={index} style={{ background: 'linear-gradient(to bottom left, #550300, #d32a23, #550300)' }}>{key}</th>
        })
    }

    renderTableData() {
        return this.state.vet.map((student, index) => {
            const { value, frequency, cumulativeFrequency, relativeFrequency, accumulatedPercentage } = student //destructuring
            return (
                <tr key={value}>
                    <td>{value}</td>
                    <td>{frequency}</td>
                    <td>{cumulativeFrequency}</td>
                    <td>{relativeFrequency + '%'}</td>
                    <td>{accumulatedPercentage + '%'}</td>
                </tr>
            )
        })
    }

    onTagsChanged(tags) {
        this.setState({ tags })
    };

    onChangeCB = (event) => {
        this.setState(
            { value: 0 })
        this.RangeStep(event);
    }

    RangeStep = (med) => {
        if (med === 'Quartil') {
            this.setState({
                MedSep: med,
                step: 25
            })
        }
        else if (med === 'Quintil') {
            this.setState({
                MedSep: med,
                step: 20
            })
        }
        else if (med === 'Decil') {
            this.setState({
                MedSep: med,
                step: 10
            })
        }
        else if (med === 'Percentil') {
            this.setState({
                MedSep: med,
                step: 1
            })
        }
    };

    PopAmost = e => {
        this.setState({
            PopAmost: e.target.value
        });
    };

    onFocus = () => {
        this.setState({
            focused: "input-group-focus"
        });
    };

    onBlur = () => {
        this.setState({
            focused: ""
        });

    };

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    ResultCollapse = e => {
        this.setState(state => ({ collapse: !this.state.collapse }));
        if (this.state.stepPosition === 2) {
            this.SendArray();
        }
    };

    async positionStep(steps) {
        var Position = this.state.stepPosition;
        console.log(this.state.stepPosition);
        if (steps === 1) {
            if (await this.inputValidation())
                return this.setState({ stepPosition: Position += + 1 });
        }

        if (steps !== 1 && Position > 0) {
            await this.SendArray();
            return this.setState({ stepPosition: Position += - 1 });
        }
    };

    RangeChange = (op) => {
        if (op === '+') {
            if ((this.state.value + this.state.step) > 100) {
                this.setState(
                    { value: 100 })
            } else {
                this.setState(
                    { value: this.state.value + this.state.step })
            }
        } else {
            if ((this.state.value - this.state.step) <= 0) {
                this.setState(
                    { value: 0 })
            }
            else {
                this.setState(
                    { value: (this.state.value - this.state.step) })
            }
        }
        // this.Calcular();
    };

    inputValidation = () => {
        if (this.state.stepPosition === 0) {
            if (this.state.PopAmost === "") {
                return this.notify('br', defaultMessage.Descriptive.distrib.error, 'fas fa-exclamation-triangle', 'danger');
            }
            else if (this.state.Var == null || this.state.Var.trim() === "") {
                return this.notify('br', defaultMessage.Descriptive.Var.error, 'fas fa-exclamation-triangle', 'danger');
            } else if (this.state.tags === null || this.state.tags.length === 0) {
                return this.notify('br', defaultMessage.Descriptive.Tags.error, 'fas fa-exclamation-triangle', 'danger');
            }
            else {
                this.SendArray();
                return true;
            }
        }
        else if (this.state.stepPosition === 1) {
            if (this.state.rSelected == null || this.state.rSelected.trim() === "") {
                return this.notify('br', defaultMessage.Descriptive.Type.error, 'fas fa-exclamation-triangle', 'danger');
            }
            else {
                return true;
            }
        }
    };

    render() {
        const fileInputKey = this.state.acceptedFiles.value ? '' : +new Date();
        let button = [];
        let Position = this.state.stepPosition;
        let Card_Body;
        let ButtonType;
        let table;
        let tagcsv = null;
        let ModalHelp = (<Modal isOpen={this.state.modalHelp} toggle={this.toggleModalHelp}>
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                    <b>{defaultMessage.Modal.info.title}</b>
                </h5>
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-hidden="true"
                    onClick={this.toggleModalHelp}
                >
                    <i className="tim-icons icon-simple-remove" />
                </button>
            </div>
            <ModalBody style={{ textAlign: 'justify' }}>
                <div dangerouslySetInnerHTML={{ __html: defaultMessage.Modal.info.corregText }} />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={this.toggleModalHelp}>
                    {defaultMessage.Modal.btn1}
                </Button>
            </ModalFooter>
        </Modal>)

        if (this.state.dispcsv) {
            tagcsv =
                (
                    <TagInput
                        tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
                        placeholder={defaultMessage.Descriptive.Tags.placeholder}
                        tags={this.state.tags}
                        onTagsChanged={this.onTagsChanged}
                    />)
        } else {
            tagcsv = null;
        };

        let saveBtn = defaultMessage.Modal.btn2;
        if (this.state.loadingsv === true) {
            saveBtn = <DotLoader
                css={`
                      display: block;
                      margin: 0 auto;
                      border-color: red;
                      `}
                sizeUnit={"px"}
                size={20}
                color={'#fff'}
                loading={this.state.loadingsv}
            />
        };

        if (Position === 0) {
            button.push(
                <Button
                    disabled={true}
                    className="btn-round btn-icon"
                    color="primary"
                    onClick={() => this.positionStep(0)}>
                    <i className="tim-icons icon-double-left" />
                </Button>
            );
            button.push(
                <Button
                    className="btn-round btn-icon"
                    color="primary"
                    onClick={() => this.positionStep(1)}>
                    <i className="tim-icons icon-double-right" />
                </Button>);
            Card_Body = <CardBody
                style={{ marginLeft: '10%', marginRight: '10%' }}
            >
                <Container >
                    <Row>
                        <Col sm>
                            <FormGroup>
                                <CardTitle>{defaultMessage.Descriptive.Var.title}</CardTitle>
                                <InputGroup className={this.state.focused}>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText><i className="fas fa-thumbtack"></i></InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        type="text"
                                        name="Var"
                                        value={this.state.Var}
                                        placeholder={defaultMessage.Descriptive.Var.placeholder}
                                        onFocus={this.onFocus}
                                        onBlur={this.onBlur}
                                        onChange={this.handleChange}
                                    />
                                </InputGroup>
                            </FormGroup>
                        </Col>
                        <Col sm>
                            <FormGroup>
                                <CardTitle>{defaultMessage.Descriptive.distrib.title}</CardTitle>
                                <ButtonGroup>
                                    <Button color={this.buttoncolor('PopAmost', 'População')} onClick={() => this.onRadioBtnClick('PopAmost', 'População')} active={this.state.PopAmost === 'População'}>População</Button>
                                    <Button color={this.buttoncolor('PopAmost', 'Amostra')} onClick={() => this.onRadioBtnClick('PopAmost', 'Amostra')} active={this.state.PopAmost === 'Amostra'}>Amostra</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <CardTitle>{defaultMessage.Descriptive.Tags.title}</CardTitle>
                        {!this.state.dispcsv ? (
                            <TagInput
                                tagStyle={`background: linear-gradient(to bottom right, #550300, #d32a23, #550300);`}
                                placeholder={defaultMessage.Descriptive.Tags.placeholder}
                                tags={this.state.tags}
                                onTagsChanged={this.onTagsChanged}
                            />
                        ) :
                            <ul className="list-group mt-2">
                                {tagcsv}
                            </ul>}
                    </FormGroup>
                    <br />
                    <Nav style={{ justifyContent: 'center' }}>
                        <NavItem style={{ width: '220px' }}>
                            <label
                                id="csv"
                                className={
                                    this.state.csv
                                        ? 'has-csv'
                                        : ''}>
                                <input
                                    key={fileInputKey}
                                    className="csv-input"
                                    type="file"
                                    accept=".csv"
                                    ref={input => {
                                        this.filesInput = input;
                                    }}
                                    name="file"
                                    placeholder={null}
                                    onChange={this.handlecsvChange}
                                /><img
                                    src={csvicon}
                                    alt="select file"
                                    style={{ height: '30px' }} />
                                <p />
                            </label>
                            {this.state.acceptedFiles !== '' ? (
                                <ul className="list-group mt-2">
                                    {<Alert
                                        toggle={this.onDismissCSV}
                                        color={'success'} className="text-center">{this.state.acceptedFiles}</Alert>
                                    }
                                </ul>) : ''}
                        </NavItem>
                        <NavItem ><span>&nbsp;&nbsp;</span></NavItem >
                        <NavItem >
                            <Button
                                className="btn-round btn-icon animation-on-hover"
                                style={this.state.acceptedFiles !== '' ? { top: '15px' } : { top: '7px' }}
                                color="success"
                                size="sm"
                                onClick={this.importCSV}
                                disabled={this.state.acceptedFiles !== '' ? false : true}>
                                <AddCircle color='#fff' ></AddCircle>
                            </Button>
                        </NavItem>
                    </Nav>
                </Container>
            </CardBody>
        } else if (Position === 1) {
            button = []
            if (this.state.collapse) {
                table = <div style={{ justifyContent: 'center' }}>
                    <Table
                        bordered={true}
                        size={'small'}
                        responsive
                        className={
                            // (this.state.dragIndex >= 0 && 'dragging-container') || 
                            this.header}
                        ref="dragContainer"
                        columns={this.columns}
                        pagination={false}
                        dataSource={this.state.vet}
                    />
                </div>
            }
            button.push(
                <Button
                    className="btn-round btn-icon"
                    color="primary"
                    onClick={() => this.positionStep(0)}>
                    <i className="tim-icons icon-double-left" />
                </Button>
            );
            button.push(
                <Button
                    className="btn-round animation-on-hover"
                    color="primary"
                    type="button"
                    onClick={() => this.positionStep(1)}
                >
                    Show Results
              </Button>);
            if (this.state.Type === 'Qualitativo') {
                ButtonType = <ButtonGroup>
                    <Button color={this.buttoncolor('QntQuali', 'Nominal')} onClick={() => this.onRadioBtnClick('QntQuali', 'Nominal')} active={this.state.rSelected === 'Nominal'}>Nominal</Button>
                    <Button color={this.buttoncolor('QntQuali', 'Ordinal')} onClick={() => this.onRadioBtnClick('QntQuali', 'Ordinal')} active={this.state.rSelected === 'Ordinal'}>Ordinal</Button>
                </ButtonGroup>
            } else if (this.state.Type === 'Quantitativo') {
                ButtonType = <ButtonGroup>
                    <Button color={this.buttoncolor('QntQuali', 'Contínua')} onClick={() => this.onRadioBtnClick('QntQuali', 'Contínua')} active={this.state.rSelected === 'Contínua'}>Contínua</Button>
                    <Button color={this.buttoncolor('QntQuali', 'Discreta')} onClick={() => this.onRadioBtnClick('QntQuali', 'Discreta')} active={this.state.rSelected === 'Discreta'}>Discreta</Button>
                </ButtonGroup>
            }
            Card_Body = <CardBody style={{ marginLeft: '10%', marginRight: '10%' }}>
                <Container >
                    <Row>
                        <Col sm>
                            <FormGroup>
                                <CardTitle>{defaultMessage.Descriptive.distrib.title}</CardTitle>
                                <ButtonGroup>
                                    <Button disabled={true} color={this.buttoncolor('PopAmost', 'População')} onClick={() => this.onRadioBtnClick('PopAmost', 'População')} active={this.state.PopAmost === 'População'}>População</Button>
                                    <Button disabled={true} color={this.buttoncolor('PopAmost', 'Amostra')} onClick={() => this.onRadioBtnClick('PopAmost', 'Amostra')} active={this.state.PopAmost === 'Amostra'}>Amostra</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Col>
                        <Col sm>
                            <FormGroup>
                                <CardTitle>{defaultMessage.Descriptive.Type.title}</CardTitle>
                                {ButtonType}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm>
                            {table}
                        </Col>
                    </Row>
                </Container>
            </CardBody>
        } else if (Position === 2) {
            button = []
            button.push(
                <Button
                    className="btn-round btn-icon"
                    color="primary"
                    onClick={() => this.positionStep(0)}>
                    <i className="tim-icons icon-double-left" />
                </Button>
            );

            Card_Body = <CardBody style={{ marginLeft: '10%', marginRight: '10%' }}>
                <Container >
                    <MDBRow className="mx-auto" >
                        {/* <MDBCol >
                            <CardTitle>Variável estudada: <b>{this.state.Var}</b></CardTitle>
                            <TagInput placeholder="Valores da variável" addTagOnEnterKeyPressed={false} tagStyle={`
                            background: linear-gradient(to bottom left, #550300, #d32a23, #550300);`} inputStyle={`
                            display: none;
                            `} tagDeleteStyle={`
                            display: none;
                            `} tags={this.state.tags} /><br />
                            <br />
                        </MDBCol> */}
                        <MDBCol >
                            <CardTitle>Tipo de distribuição de dados: <b>{this.state.PopAmost}</b></CardTitle>
                            <CardTitle>Tipo de análise de dados desejada: <b>{this.state.rSelected}</b></CardTitle>
                            <ComboBox value={this.state.MedSep} data={['Quartil', 'Quintil', 'Decil', 'Percentil']} onChange={event => this.onChangeCB(event.target.value)} color={'primary'} style={{ color: 'black' }} /><br /><br />
                            <form>
                                <Row>
                                    <Col className="text-center text-md-right" sm={{ size: 2 }}>
                                        <Button color={'primary'}
                                            onClick={() => this.RangeChange('-')}
                                            size="sm">-</Button>
                                    </Col>
                                    <Col className="text-center text-md-right" sm={{ size: 7 }}>
                                        <InputRange
                                            style={{ backgroundColor: '#000' }}
                                            step={this.state.step}
                                            maxValue={100}
                                            minValue={0}
                                            value={this.state.value}
                                            formatLabel={value => `${value}%`}
                                            onChange={value =>
                                                this.setState({
                                                    value
                                                })} ></InputRange>
                                    </Col>
                                    <Col className="text-center text-md-left" sm={{ size: 1 }}>
                                        <Button color={'primary'}
                                            onClick={() => this.RangeChange('+')}
                                            size="sm">+</Button>
                                    </Col>
                                </Row>
                            </form>
                        </MDBCol>
                    </MDBRow>
                    {/* <Collapse isOpen={this.state.collapse}> */}
                    <div><br /><br />
                        <ListGroup>
                            <ListGroupItem style={{ backgroundColor: 'transparent' }}
                                className="justify-content-between">Média Ponderada Simples: <Badge pill>{this.state.weightedMean}</Badge></ListGroupItem>
                            <ListGroupItem style={{ backgroundColor: 'transparent' }}
                                className="justify-content-between">Moda: <Badge pill>{this.state.mode}</Badge></ListGroupItem>
                            <ListGroupItem style={{ backgroundColor: 'transparent' }}
                                className="justify-content-between">Mediana: <Badge pill>{this.state.median}</Badge></ListGroupItem>
                            <ListGroupItem style={{ backgroundColor: 'transparent' }}
                                className="justify-content-between">Variância: <Badge pill>{this.state.variance}</Badge></ListGroupItem>
                            <ListGroupItem style={{ backgroundColor: 'transparent' }}
                                className="justify-content-between">Desvio Padrão: <Badge pill>{this.state.deviation}</Badge></ListGroupItem>
                            <ListGroupItem style={{ backgroundColor: 'transparent' }}
                                className="justify-content-between">Coeficiente de Variação: <Badge pill>{this.state.coefvar}</Badge></ListGroupItem>
                            <ListGroupItem style={{ backgroundColor: 'transparent' }}
                                className="justify-content-between">{this.state.MedSep} ({((this.state.value * (100 / this.state.step)) / 100)}): <Badge pill>{this.state.percentile[this.state.value - 1]}</Badge></ListGroupItem>

                        </ListGroup><br /><br />

                        <table id='students' hover>
                            <tbody>
                                <tr>{this.renderTableHeader()}</tr>
                                {this.renderTableData()}
                            </tbody>
                        </table>
                    </div>
                    <div className="chart-area">
                        <Doughnut
                            data={this.state.data}

                            options={'sss'}
                        />
                    </div>
                    {/* </Collapse> */}
                </Container>
            </CardBody>
        }
        return (
            <>
                <div className="content">
                    <div className="react-notification-alert-container">
                        <NotificationAlert ref="notificationAlert" />
                    </div>
                    <Row>
                        <Col md="12">
                            <Card>
                                <CardHeader>{defaultMessage.Descriptive.title}
                                    <span>&nbsp;&nbsp;</span>
                                    <Button
                                        className="btn-round btn-icon animation-on-hover"
                                        color="info"
                                        onClick={this.toggleModalHelp}
                                        style={{ height: '20px', width: '15px' }}>?
                                    </Button>
                                    {ModalHelp}
                                </CardHeader>
                                <CardBody>
                                    <Card>
                                        <Stepper steps={this.state.steps}
                                            activeStep={this.state.stepPosition}
                                            activeColor={"#750f0f"}
                                            completeColor={"#c45858"} />
                                        <CardBody>
                                            {Card_Body}
                                            {button[0]}
                                            {button[1]}
                                            {button[2]}
                                        </CardBody>
                                    </Card>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
};

export default Descriptive;