import React from "react";
import { Save, AddCircle } from 'grommet-icons';
import classnames from 'classnames';
import Stepper from 'react-stepper-horizontal';
import { TagInput } from '../components/reactjs-tag-input';
import InputRange from 'react-input-range';
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
    Collapse,
    Container,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Nav,
    NavItem,
    NavLink,
    Alert,
    FormGroup,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    ListGroup,
    ListGroupItem,
    TabContent,
    TabPane
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
import '../assets/css/all.css';
import '../assets/css/table.css';
import 'react-input-range/lib/css/index.css';

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
            collapsetable: false,
            stepPosition: 0,
            btncolor: "primary",
            focused: "",
            PopAmost: "",
            Type: "",
            Var: '',
            step: 1,
            value: 0,
            MedSep: defaultMessage.Descriptive.spt.type.tp1,
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
            activeTab: '2',
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
                title: `${defaultMessage.Descriptive.Table.col1}`,
                dataIndex: 'value',
                align: 'center',
            },
            {
                title: `${defaultMessage.Descriptive.Table.col2}`,
                dataIndex: 'frequency',
                align: 'center',
            },
            {
                title: `${defaultMessage.Descriptive.Table.col3}`,
                dataIndex: 'cumulativeFrequency',
                align: 'center',
            },
            {
                title: `${defaultMessage.Descriptive.Table.col4}`,
                dataIndex: 'relativeFrequency',
                align: 'center',
            },
            {
                title: `${defaultMessage.Descriptive.Table.col5}`,
                dataIndex: 'accumulatedPercentage',
                align: 'center',
            },

            {
                title: `${defaultMessage.Descriptive.Table.col6}`,
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
        this.toggle = this.toggle.bind(this);
        this.SendArray = this.SendArray.bind(this);
        this.toggleModalDemo = this.toggleModalDemo.bind(this);
        this.toggleModalHelp = this.toggleModalHelp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    };

    toggle(tab) {
        this.setState({
            activeTab: tab,
        });
    };

    onDismissCSV = () => {
        this.setState({
            csvfile: '',
            csv: '',
            acceptedFiles: '',
            csvdata: null
        });
    };

    toggleModalDemo = () => {
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
            encoding: "ISO-8859-1",
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
                        inputValue = inputValue.replace(/([\u0300-\u036f]|[^0-9a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s,-\.\;])/g, '');
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
                collapsetable: false
            });
        } else {
            this.setState({
                collapsetable: true
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
        this.setState({ loading: true });
        if (this.state.Type === 'Qualitative' && this.state.rSelected === 'Ordinal') {
            for (let i = 0; i < this.state.vet.length; i++) {
                aux.splice(i, 0,
                    {
                        value: this.state.vet[i].value,
                        frequency: this.state.vet[i].frequency
                    }
                );
            }
        } else {
            for (let i = 0; i < this.state.tags.length; i++) {
                aux.push((this.state.tags[i].displayValue));
            }
        };
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
                    btnSave: false,
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

    saveValidation = () => {
        if (this.state.Name === '') {
            this.Name.focus();
        }
        else {
            this.setState({
                loadingsv: true
            });
            var body = {
                "name": this.state.Name,
                "data": {
                    "type": this.state.Type,
                    "subType": this.state.rSelected,
                    "PopAmost": this.state.PopAmost,
                    "name": this.state.Var,
                    "values": this.state.tags
                },
                "results": {
                    "dataDescriptive": this.state.vet,
                    "weightedMean": this.state.weightedMean,
                    "median": this.state.median,
                    "variance": this.state.variance,
                    "deviation": this.state.deviation,
                    "coefvar": this.state.coefvar,
                    "percentile": this.state.percentile,
                    "mode": this.state.mode,
                },
                "language": localStorage.getItem('defaultLanguage'),
            };
            this.saveChanges(body);
        };
    }

    async saveChanges(body) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }),
        };
        try {
            const response = await fetch('https://datatongji-backend.herokuapp.com/descriptive/save', requestInfo);
            var promise = await response.json();
            if (response.ok) {
                this.notify('br', defaultMessage.Modal.save.message, 'fas fa-check', 'success');
                this.setState({
                    loadingsv: false
                });
                this.toggleModalDemo();
            } else {
                throw new Error(promise.error);
            }
        } catch (e) {
            this.notify('tc', e.message, 'fas fa-exclamation-triangle', 'danger');
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
    };

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
    };

    getTrNode(target) {
        return closest(target, 'tr');
    };

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
    };

    renderTableHeader() {
        let header = Object.keys(
            {
                Variável: 'se',
                Fi: '2',
                Fac: 2,
                'Fr%': '25.00',
                'Fac%': '25.00'
            }
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
        if (med.includes('Quartil')) {
            this.setState({
                MedSep: med,
                step: 25
            })
        }
        else if (med.includes('Quintil')) {
            this.setState({
                MedSep: med,
                step: 20
            })
        }
        else if (med.includes('Decil')) {
            this.setState({
                MedSep: med,
                step: 10
            })
        }
        else if (med.includes('Percentil')) {
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

    async positionStep(steps) {
        var Position = this.state.stepPosition;
        if (steps === 1) {
            if (await this.inputValidation()) {
                if (Position !== 1) {
                    this.setState({
                        rSelected: '',
                    });
                }
                this.setState({
                    stepPosition: Position += + 1,
                    collapsetable: false
                });
            }
        }
        if (steps !== 1) {
            if ((Position - 1) > 0) {
                await this.SendArray();
                // return this.setState({
                //     stepPosition: Position += - 1,
                //     collapsetable: false
                // });
            }
            // else {
            return this.setState({
                stepPosition: Position += - 1,
                rSelected: '',
                collapsetable: false
            });
            // }
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

    async inputValidation() {
        if (this.state.stepPosition === 0) {
            if (this.state.Var == null || this.state.Var.trim() === "") {
                return this.notify('br', defaultMessage.Descriptive.Var.error, 'fas fa-exclamation-triangle', 'danger');
            } else if (this.state.tags === null || this.state.tags.length === 0) {
                return this.notify('br', defaultMessage.Descriptive.Tags.error, 'fas fa-exclamation-triangle', 'danger');
            }
            else if (this.state.PopAmost === "") {
                return this.notify('br', defaultMessage.Descriptive.distrib.error, 'fas fa-exclamation-triangle', 'danger');
            }
            else {
                this.setState({ loading: true });
                await this.SendArray();
                return true;
            }
        }
        else if (this.state.stepPosition === 1) {
            if (this.state.rSelected == null || this.state.rSelected.trim() === "") {
                return this.notify('br', defaultMessage.Descriptive.Type.error, 'fas fa-exclamation-triangle', 'danger');
            }
            else {
                this.setState({ loading: true });
                await this.SendArray();
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
                <div dangerouslySetInnerHTML={{ __html: defaultMessage.Modal.info.descText }} />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={this.toggleModalHelp}>
                    {defaultMessage.Modal.btn1}
                </Button>
                <Button href="https://www.dropbox.com/s/xc7dds1mh9i8aov/Descriptive.csv?dl=1" className="btn-round animation-on-hover" color="success">
                    <form class="form-horizontal"> {defaultMessage.Modal.btn3}</form>
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

        let sendBtn = <i className="tim-icons icon-double-right" />;
        if (this.state.loading === true) {
            sendBtn = <DotLoader
                css={`
                      display: block;
                      margin: 0 auto;
                      border-color: red;
                      `}
                sizeUnit={"px"}
                size={20}
                color={'#fff'}
                loading={this.state.loading}
            />
        };

        let ResultItems;

        if (Position === 0) {
            button.push(
                <Button
                    disabled={true}
                    className="btn-round btn-icon animation-on-hover"
                    color="primary"
                    onClick={() => this.positionStep(0)}>
                    <i className="tim-icons icon-double-left" />
                </Button>
            );
            button.push(
                <Button disabled={this.state.loading}
                    className="btn-round btn-icon animation-on-hover"
                    color="primary"
                    onClick={() => this.positionStep(1)}>
                    {sendBtn}
                </Button>);
            Card_Body = <CardBody
                style={{ marginLeft: '5%', marginRight: '5%' }}
            >
                <Container >
                    <Row>
                        <Col sm md="9">
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
                        </Col>
                        <Col sm>
                            <FormGroup>
                                <CardTitle>{defaultMessage.Descriptive.distrib.title}</CardTitle>
                                <ButtonGroup vertical style={{ width: '100%' }}>
                                    <Button color={this.buttoncolor('PopAmost', 'Population')} onClick={() => this.onRadioBtnClick('PopAmost', 'Population')} active={this.state.PopAmost === 'Population'}>{defaultMessage.Descriptive.popamost.pop}</Button>
                                    <Button color={this.buttoncolor('PopAmost', 'Sample')} onClick={() => this.onRadioBtnClick('PopAmost', 'Sample')} active={this.state.PopAmost === 'Sample'}>{defaultMessage.Descriptive.popamost.amost}</Button>
                                </ButtonGroup>
                            </FormGroup>
                        </Col>
                    </Row>
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
            button.push(
                <Button
                    className="btn-round btn-icon animation-on-hover"
                    color="primary"
                    onClick={() => this.positionStep(0)}>
                    <i className="tim-icons icon-double-left" />
                </Button>
            );
            button.push(
                <Button disabled={this.state.loading}
                    className="btn-round btn-icon animation-on-hover"
                    color="primary"
                    onClick={() => this.positionStep(1)}>
                    {sendBtn}
                </Button>);
            if (this.state.Type === 'Qualitative') {
                ButtonType = <ButtonGroup vertical style={{ width: '100%' }}>
                    <Button color={this.buttoncolor('QntQuali', 'Nominal')} onClick={() => this.onRadioBtnClick('QntQuali', 'Nominal')} active={this.state.rSelected === 'Nominal'}>{defaultMessage.Descriptive.quali.type1}</Button>
                    <Button color={this.buttoncolor('QntQuali', 'Ordinal')} onClick={() => this.onRadioBtnClick('QntQuali', 'Ordinal')} active={this.state.rSelected === 'Ordinal'}>{defaultMessage.Descriptive.quali.type2}</Button>
                </ButtonGroup>
            } else if (this.state.Type === 'Quantitative') {
                ButtonType = <ButtonGroup vertical style={{ width: '100%' }}>
                    <Button color={this.buttoncolor('QntQuali', 'Continuous')} onClick={() => this.onRadioBtnClick('QntQuali', 'Continuous')} active={this.state.rSelected === 'Continuous'}>{defaultMessage.Descriptive.quant.type2}</Button>
                    <Button color={this.buttoncolor('QntQuali', 'Discrete')} onClick={() => this.onRadioBtnClick('QntQuali', 'Discrete')} active={this.state.rSelected === 'Discrete'}>{defaultMessage.Descriptive.quant.type1}</Button>
                </ButtonGroup>
            }
            Card_Body = <CardBody style={{ marginLeft: '5%', marginRight: '5%' }}>
                <Container >
                    <Row>
                        <Col sm>
                            <FormGroup>
                                <CardTitle>{defaultMessage.Descriptive.distrib.title}</CardTitle>
                                <ButtonGroup vertical style={{ width: '100%' }}>
                                    <Button disabled={true} color={this.buttoncolor('PopAmost', 'Population')} onClick={() => this.onRadioBtnClick('PopAmost', 'Population')} active={this.state.PopAmost === 'Population'}>{defaultMessage.Descriptive.popamost.pop}</Button>
                                    <Button disabled={true} color={this.buttoncolor('PopAmost', 'Sample')} onClick={() => this.onRadioBtnClick('PopAmost', 'Sample')} active={this.state.PopAmost === 'Sample'}>{defaultMessage.Descriptive.popamost.amost}</Button>
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
                            <Collapse isOpen={this.state.collapsetable}>
                                {table}
                            </Collapse>
                        </Col>
                    </Row>
                </Container>
            </CardBody>
        } else if (Position === 2) {
            if (this.state.Type === 'Qualitative') {
                ButtonType = <ButtonGroup vertical style={{ width: '100%' }}>
                    <Button disabled={true} color={this.buttoncolor('QntQuali', 'Nominal')} onClick={() => this.onRadioBtnClick('QntQuali', 'Nominal')} active={this.state.rSelected === 'Nominal'}>{defaultMessage.Descriptive.quali.type1}</Button>
                    <Button disabled={true} color={this.buttoncolor('QntQuali', 'Ordinal')} onClick={() => this.onRadioBtnClick('QntQuali', 'Ordinal')} active={this.state.rSelected === 'Ordinal'}>{defaultMessage.Descriptive.quali.type2}</Button>
                </ButtonGroup>
            } else if (this.state.Type === 'Quantitative') {
                ButtonType = <ButtonGroup vertical style={{ width: '100%' }}>
                    <Button disabled={true} color={this.buttoncolor('QntQuali', 'Continuous')} onClick={() => this.onRadioBtnClick('QntQuali', 'Continuous')} active={this.state.rSelected === 'Continuous'}>{defaultMessage.Descriptive.quant.type2}</Button>
                    <Button disabled={true} color={this.buttoncolor('QntQuali', 'Discrete')} onClick={() => this.onRadioBtnClick('QntQuali', 'Discrete')} active={this.state.rSelected === 'Discrete'}>{defaultMessage.Descriptive.quant.type1}</Button>
                </ButtonGroup>
            }
            button = []
            button.push(
                <Button
                    className="btn-round btn-icon animation-on-hover"
                    color="primary"
                    onClick={() => this.positionStep(0)}>
                    <i className="tim-icons icon-double-left" />
                </Button>
            );
            button.push(
                <Button
                    className="btn-round btn-icon animation-on-hover"
                    color="primary"
                    onClick={this.toggleModalDemo}
                    disabled={this.state.btnSave}>
                    <Save color='#fff' ></Save>
                </Button>
            );
            if (this.state.Type === 'Qualitative') {
                ResultItems =
                    <ListGroup>
                        <ListGroupItem style={{ backgroundColor: 'transparent' }}
                            className="justify-content-between">{defaultMessage.Descriptive.Results.mode}: <Badge pill>{this.state.mode}</Badge></ListGroupItem>
                        <ListGroupItem style={{ backgroundColor: 'transparent' }}
                            className="justify-content-between">{defaultMessage.Descriptive.Results.median}: <Badge pill>{this.state.median}</Badge></ListGroupItem>
                        <ListGroupItem style={{ backgroundColor: 'transparent' }}
                            className="justify-content-between">{this.state.MedSep} ({((this.state.value * (100 / this.state.step)) / 100)}): <Badge pill>{this.state.percentile[this.state.value - 1]}</Badge></ListGroupItem>
                    </ListGroup>;
            }
            else {
                ResultItems = <ListGroup>
                    <ListGroupItem style={{ backgroundColor: 'transparent' }}
                        className="justify-content-between">{defaultMessage.Descriptive.Results.wmean}: <Badge pill>{this.state.weightedMean}</Badge></ListGroupItem>
                    <ListGroupItem style={{ backgroundColor: 'transparent' }}
                        className="justify-content-between">{defaultMessage.Descriptive.Results.mode}: <Badge pill>{this.state.mode}</Badge></ListGroupItem>
                    <ListGroupItem style={{ backgroundColor: 'transparent' }}
                        className="justify-content-between">{defaultMessage.Descriptive.Results.median}: <Badge pill>{this.state.median}</Badge></ListGroupItem>
                    <ListGroupItem style={{ backgroundColor: 'transparent' }}
                        className="justify-content-between">{defaultMessage.Probability.Results.var}: <Badge pill>{this.state.variance}</Badge></ListGroupItem>
                    <ListGroupItem style={{ backgroundColor: 'transparent' }}
                        className="justify-content-between">{defaultMessage.Probability.Results.std}: <Badge pill>{this.state.deviation}</Badge></ListGroupItem>
                    <ListGroupItem style={{ backgroundColor: 'transparent' }}
                        className="justify-content-between">{defaultMessage.Probability.Results.coef}: <Badge pill>{this.state.coefvar}</Badge></ListGroupItem>
                    <ListGroupItem style={{ backgroundColor: 'transparent' }}
                        className="justify-content-between">{this.state.MedSep} ({((this.state.value * (100 / this.state.step)) / 100)}): <Badge pill>{this.state.percentile[this.state.value - 1]}</Badge></ListGroupItem>
                </ListGroup>;
            }
            Card_Body =
                <CardBody style={{ marginLeft: '5%', marginRight: '5%', marginTop: '-2%' }}>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}
                            >
                                {defaultMessage.Descriptive.Nav.pn1}
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}
                            >
                                {defaultMessage.Descriptive.Nav.pn2}
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <Modal isOpen={this.state.modalDemo} toggle={this.toggleModalDemo}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                <b>{defaultMessage.Modal.save.title}</b>
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-hidden="true"
                                onClick={this.toggleModalDemo}
                            >
                                <i className="tim-icons icon-simple-remove" />
                            </button>
                        </div>
                        <ModalBody>
                            <p>{defaultMessage.Modal.save.text}</p>
                            <Label for="error" className="control-label">{defaultMessage.Modal.save.input1}:</Label>
                            <Input type="text" name="Name" placeholder={defaultMessage.Modal.save.lbl1}
                                autoFocus
                                onFocus={this.onFocus}
                                ref={(input) => { this.Name = input; }}
                                onInput={this.handleChange.bind(this)}
                                style={{ backgroundColor: '#1c2336', color: '#fff' }} />
                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-round animation-on-hover" color="secondary" onClick={this.toggleModalDemo}>
                                {defaultMessage.Modal.btn1}
                            </Button>
                            <Button disabled={this.state.loadingsv} className="btn-round animation-on-hover" color="primary" onClick={this.saveValidation}>
                                {saveBtn}
                            </Button>
                        </ModalFooter>
                    </Modal>
                    <TabContent activeTab={this.state.activeTab}><br />
                        <TabPane tabId="1">
                            <Row>
                                <Col sm>
                                    <FormGroup>
                                        <CardTitle>{defaultMessage.Descriptive.distrib.title}</CardTitle>
                                        <ButtonGroup vertical style={{ width: '100%' }}>
                                            <Button disabled={true} color={this.buttoncolor('PopAmost', 'Population')} onClick={() => this.onRadioBtnClick('PopAmost', 'Population')} active={this.state.PopAmost === 'Population'}>{defaultMessage.Descriptive.popamost.pop}</Button>
                                            <Button disabled={true} color={this.buttoncolor('PopAmost', 'Sample')} onClick={() => this.onRadioBtnClick('PopAmost', 'Sample')} active={this.state.PopAmost === 'Sample'}>{defaultMessage.Descriptive.popamost.amost}</Button>
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
                                    <div><br /><br />
                                        <table id='students' hover>
                                            <tbody>
                                                <tr>{this.renderTableHeader()}</tr>
                                                {this.renderTableData()}
                                            </tbody>
                                        </table>
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col sm>
                                    <FormGroup>
                                        <CardTitle>{defaultMessage.Descriptive.spt.title}:</CardTitle>
                                        <ComboBox value={this.state.MedSep} data={[`${defaultMessage.Descriptive.spt.type.tp4}`, `${defaultMessage.Descriptive.spt.type.tp3}`, `${defaultMessage.Descriptive.spt.type.tp2}`, `${defaultMessage.Descriptive.spt.type.tp1}`]} onChange={event => this.onChangeCB(event.target.value)} color={'primary'} style={{ color: 'black' }} /><br /><br />
                                    </FormGroup>
                                </Col>
                                <Col sm md='8'>
                                    <FormGroup>
                                        <CardTitle>{defaultMessage.Descriptive.spt.title2}:</CardTitle>
                                        <form >
                                            <Row style={{ marginTop: '20px' }}>
                                                <Col className="text-center text-md-left" sm={{ size: 1 }}>
                                                    <Button color={'primary'}
                                                        className="btn-round btn-icon animation-on-hover"
                                                        onClick={() => this.RangeChange('-')}
                                                        size="sm">-
                                                    </Button>
                                                </Col>
                                                <Col className="text-center" sm md='9'>
                                                    <Container style={{ width: '98%', justifyItems: 'center', alignContent: 'center' }}>
                                                        <InputRange
                                                            step={this.state.step}
                                                            maxValue={100}
                                                            minValue={0}
                                                            value={this.state.value}
                                                            formatLabel={value => `${value}%`}
                                                            onChange={value =>
                                                                this.setState({
                                                                    value
                                                                })} /></Container>
                                                </Col>
                                                <Col className="text-center text-md-left" sm md='1'>
                                                    <Button color={'primary'}
                                                        className="btn-round btn-icon animation-on-hover"
                                                        onClick={() => this.RangeChange('+')}
                                                        size="sm">+</Button>
                                                </Col>
                                            </Row>
                                        </form>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm>
                                    <br />
                                    {ResultItems}
                                </Col>
                            </Row>
                            <Row>
                                <Col sm>
                                    <br /><div className="chart-area">
                                        <Doughnut
                                            data={this.state.data}
                                            options={'sss'}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
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