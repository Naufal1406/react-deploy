import React, {Component} from "react";
import {Table} from "react-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Axios from "axios";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-responsive-dt/js/responsive.dataTables.js";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Swal from "sweetalert2"
import logoBca from "../asset/img/logobca.jpg"

class EventCalender extends Component{
    constructor(props){
        super(props)

        this.state = {
            fields : {},
            schedule : [],
            number : 1,
            // title : [],
            // start : [],
            // end : [],
            // input : []
        }

    }

    componentDidMount(event) {
        this.getSchedule();
    }

    getSchedule() {
        Axios.get('http://localhost:8080/sqi-schedule/get-schedule')
        .then((response) => {
            const dataSchedule = response.data;
            this.setState({
                schedule : dataSchedule
            });
            $(function() {
                $("#scheduleTable").DataTable({
                    responsive : true,
                })
            })
        });
        
    }

    getScheduleById = (id) => {
        Axios.get('http://localhost:8080/sqi-schedule/get-scheduleById/' + id)
        .then((response)=>{
            this.setState({
                id : response.data.id,
                task : response.data.task,
                app : response.data.app,
                fromDate : response.data.fromDate,
                fromTime : response.data.fromTime,
                toDate : response.data.toDate,
                toTime : response.data.toTime,
                color : response.data.color
            });
        });
    }

    deleteSchedule = (id) => {
        Axios.delete('http://localhost:8080/sqi-schedule/delete-schedule/' + id)
        .then((response)=>{
            Swal.fire({
                icon : 'success',
                title : 'Success',
                text : "Your Task Has Been Deleted",
                confrimButtonText : "OK"
            }).then((result)=>{
                if(result.isConfirmed){
                    window.location.reload();
                }
            })
        })
    }

    taskSubmit(event){
        const fields = this.state.fields;
        const schedule = {
            task : fields["task"],
            app : fields["app"],
            fromDate : fields["fromDate"],
            toDate : fields["toDate"],
            fromTime : fields["fromTime"],
            toTime :fields["toTime"],
            color : fields["color"]
        }
        console.log(schedule);

        Axios.post('http://localhost:8080/sqi-schedule/add-schedule', schedule)
        .then((response)=>{
            Swal.fire({
                icon : 'success',
                title : 'Success',
                text : "Your Task Has Been Added",
                confrimButtonText : "OK"
            }).then((result)=>{
                if(result.isConfirmed){
                    window.location.reload();
                }
            })
        });
    }

    updateSchedule = (id) => {
        const schedule = {
            task : this.state.task,
            app : this.state.app,
            fromDate : this.state.fromDate,
            fromTime : this.state.toTime,
            toDate : this.state.toDate,
            toTime : this.state.toTime,
            color : this.state.color
        }   

        Axios.put('http://localhost:8080/sqi-schedule/update-schedule/' + id, schedule)
        .then((response)=>{
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Your Data has been Update',
                confirmButtonText: `OK`
              }).then((result) => {
                  if(result.isConfirmed) {
                    window.location.reload();
                  }
              })
        })
    }

    handleUpdateSchedule = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleChange(field, e){
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }
    
    render(){
        const { schedule } = this.state;
        let { number } = this.state;
        return(
            <div className = "content">
                {/* <section>
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                        <a id="fullCalender" className="nav-link active" aria-current="page" href="#">Calender</a>
                        </li>
                        <li className="nav-item">
                        <a id="report" className="nav-link" aria-current="page" href="#">Report</a>
                        </li>
                        
                    </ul>
                </section> */}

                <section className="titleSection">
                    <div className="titleWeb">                       
                        <h3>
                        <span className="material-icons" style={{fontSize : "40px"}}>event_available</span>
                                                   
                            SQi Calendar
                        </h3>

                    </div>
                </section>

                <section className="contentSection">
                    {/* Add Task Button */}
                    <button type="button" className="btn btn-primary addTask" data-bs-toggle="modal" data-bs-target="#addTaskModal">
                    Add Task
                    </button>
                </section>

                {/* Modal Add Task  */}
                <section className="contentSection">
                <div className="modal fade" id="addTaskModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Your Task</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {/* <form role="form" id="addTaskSchedule" onSubmit={this.taskSubmit.bind(this)}> */}
                            <div className="modal-body">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <div>
                                                    <div className="task col-sm-6">
                                                        <label>Your Task</label>
                                                    </div>
                                                    <div className="task col-md-12">
                                                        <input
                                                        name="task"
                                                        className="col-md-12" 
                                                        // rows="1.5" 
                                                        // cols="52" 
                                                        placeholder="-- Enter Your Task --"
                                                        onChange={this.handleChange.bind(this, "task")}
                                                        value ={this.state.fields["task"]}
                                                        />
                                                    </div>
                                                </div>
                                            
                                            </div>                                
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <div className="application col-sm-6">
                                                    <label>Your Application</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <select 
                                                    className=" application col-sm-12" 
                                                    name="app" 
                                                    id="appItem"
                                                    onChange={this.handleChange.bind(this, "app")}
                                                    value={this.state.fields["app"]}>
                                                        <option value="null">-- Choose Application --</option>
                                                        <option className="selectApp" value="CRM Halo">CRM Halo</option>
                                                        <option className="selectApp" value="Halo Lite">Halo Lite</option>
                                                        <option className="selectApp" value="Halo Apps">Halo Apps</option>
                                                        <option className="selectApp" value="Spekta BCA">Spekta BCA</option>
                                                        <option className="selectApp" value="Telephony">Telephony</option>
                                                        <option className="selectApp" value="SOSMED">SOSMED</option>
                                                        <option className="selectApp" value="Chain">Chain</option>
                                                        <option className="selectApp" value="MQA">MQA</option>
                                                    </select>
                                                </div>
                                            </div>                                
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                    <div className="date col-sm-6">
                                                        <label>From</label>
                                                    </div>
                                                    <div className="chooseDate">
                                                        {/* From Date */}
                                                        <input 
                                                        className="fromDate col-sm-6" 
                                                        type="date" 
                                                        name="fromDate" 
                                                        placeholder="Start"
                                                        onChange={this.handleChange.bind(this,"fromDate")}
                                                        value={this.state.fields["fromDate"]}/>

                                                        {/* From Time */}
                                                        <input 
                                                        type="time"
                                                        className="fromTime col-sm-3"
                                                        name="fromTime"
                                                        onChange={this.handleChange.bind(this,"fromTime")}
                                                        value={this.state.fields["fromTime"]}/>
                                                    </div>                                                                                          
                                            </div>                                
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <div className="date col-sm-6">
                                                    <label>To</label>
                                                </div>
                                                <div className="chooseDate">
                                                    {/* To Date */}
                                                    <input 
                                                    className="toDate col-sm-6" 
                                                    type="date" 
                                                    name="toDate" 
                                                    placeholder="Finish"
                                                    onChange={this.handleChange.bind(this,"toDate")}
                                                    value={this.state.fields["toDate"]}/>

                                                    {/* To Time */}
                                                    <input 
                                                        type="time"
                                                        className="fromTime col-sm-3"
                                                        name="toTime"
                                                        onChange={this.handleChange.bind(this,"toTime")}
                                                        value={this.state.fields["toTime"]}/>
                                                </div>
                                                
                                            </div>                                
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <div className="color col-sm-6">
                                                    <label>Choose Color</label>
                                                </div>
                                                <div className="chooseColor">
                                                    <select
                                                    className="col-sm-6" 
                                                    name="color" 
                                                    id="selectColor"
                                                    onChange={this.handleChange.bind(this, "color")}
                                                    value={this.state.fields["color"]}>
                                                        <option value="null">-- Choose Color --</option>
                                                        <option className="blue" value="#1F7EE6">CRM Halo</option>
                                                        <option className="green" value="#1FF206">Halo Lite</option>
                                                        <option className="yellow" value="#D2FC00">Halo Apps</option>
                                                        <option className="orange" value="#FF8900">Spekta BCA</option>
                                                        <option className="purple" value="#CF2AFF">Telephony</option>
                                                        <option className="pink" value="#FE96DB">SOSMED</option>
                                                        <option className="gray" value="#81888A">Chain</option>
                                                        <option className="brown" value="#924D0D">MQA</option>
                                                    </select>
                                                </div>
                                                
                                            </div>                                
                                        </div>

                                    </div>
                                </div>
                            </div> 
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={this.taskSubmit.bind(this)}>Save changes</button>
                            </div>
                        {/* </form>  */}
                    </div>
                    </div>
                </div>
            </section>
            
            {/* Modal Delete */}
            <section className="contentSection">
                <div class="modal fade" id="deleteTaskModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Delete Task</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        Are you sure to delete this event?
                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" onClick={()=> this.deleteSchedule(this.state.id)}>Delete</button>
                        </div>
                    </div>
                    </div>
                </div>
            </section>


            {/* Modal Edit */}
            <section className="contentSection">
                <div className="modal fade" id="updateTaskModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Your Task</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                            <div className="modal-body">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <div>
                                                    <div className="task col-sm-6">
                                                        <label>Edit Task</label>
                                                    </div>
                                                    <div className="task col-md-12">
                                                        <input
                                                        name="task"
                                                        className="col-md-12" 
                                                        // rows="1.5" 
                                                        // cols="52" 
                                                        placeholder="-- Enter Your Task --"
                                                        onChange={this.handleUpdateSchedule}
                                                        value ={this.state.task}
                                                        />
                                                    </div>
                                                </div>
                                            
                                            </div>                                
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <div className="application col-sm-6">
                                                    <label>Your Application</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <select 
                                                    className=" application col-sm-12" 
                                                    name="app" 
                                                    id="appItem"
                                                    onChange={this.handleUpdateSchedule}
                                                    value={this.state.app}>
                                                        <option value="null">-- Choose Application --</option>
                                                        <option className="selectApp" value="CRM Halo">CRM Halo</option>
                                                        <option className="selectApp" value="Halo Lite">Halo Lite</option>
                                                        <option className="selectApp" value="Halo Apps">Halo Apps</option>
                                                        <option className="selectApp" value="Spekta BCA">Spekta BCA</option>
                                                        <option className="selectApp" value="Telephony">Telephony</option>
                                                        <option className="selectApp" value="SOSMED">SOSMED</option>
                                                        <option className="selectApp" value="Chain">Chain</option>
                                                        <option className="selectApp" value="MQA">MQA</option>
                                                    </select>
                                                </div>
                                            </div>                                
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                    <div className="date col-sm-6">
                                                        <label>From</label>
                                                    </div>
                                                    <div className="chooseDate">
                                                        {/* From Date */}
                                                        <input 
                                                        className="fromDate col-sm-6" 
                                                        type="date" 
                                                        name="fromDate" 
                                                        placeholder="Start"
                                                        onChange={this.handleUpdateSchedule}
                                                        value={this.state.fromDate}/>

                                                        {/* From Time */}
                                                        <input 
                                                        type="time"
                                                        className="fromTime col-sm-3"
                                                        name="fromTime"
                                                        onChange={this.handleUpdateSchedule}
                                                        value={this.state.fromTime}/>
                                                    </div>                                                                                          
                                            </div>                                
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <div className="date col-sm-6">
                                                    <label>To</label>
                                                </div>
                                                <div className="chooseDate">
                                                    {/* To Date */}
                                                    <input 
                                                    className="toDate col-sm-6" 
                                                    type="date" 
                                                    name="toDate" 
                                                    placeholder="Finish"
                                                    onChange={this.handleUpdateSchedule}
                                                    value={this.state.toDate}/>

                                                    {/* To Time */}
                                                    <input 
                                                        type="time"
                                                        className="fromTime col-sm-3"
                                                        name="toTime"
                                                        onChange={this.handleUpdateSchedule}
                                                        value={this.state.toTime}/>
                                                </div>
                                                
                                            </div>                                
                                        </div>

                                        <div className="col-sm-12">
                                            <div className="form-group">
                                                <div className="color col-sm-6">
                                                    <label>Choose Color</label>
                                                </div>
                                                <div className="chooseColor">
                                                    <select
                                                    className="col-sm-6" 
                                                    name="color" 
                                                    id="selectColor"
                                                    onChange={this.handleUpdateSchedule}
                                                    value={this.state.color}>
                                                        <option value="null">-- Choose Color --</option>
                                                        <option className="blue" value="#1F7EE6">CRM Halo</option>
                                                        <option className="green" value="#1FF206">Halo Lite</option>
                                                        <option className="yellow" value="#D2FC00">Halo Apps</option>
                                                        <option className="orange" value="#FF8900">Spekta BCA</option>
                                                        <option className="purple" value="#CF2AFF">Telephony</option>
                                                        <option className="pink" value="#FE96DB">SOSMED</option>
                                                        <option className="gray" value="#81888A">Chain</option>
                                                        <option className="brown" value="#924D0D">MQA</option>
                                                    </select>
                                                </div>
                                                
                                            </div>                                
                                        </div>

                                    </div>
                                </div>
                            </div> 
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={()=> this.updateSchedule(this.state.id)}>Save changes</button>
                            </div>
                        {/* </form>  */}
                    </div>
                    </div>
                </div>
            </section>

            <section className="contentSection">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar= {{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                      }}
                    events = {
                        schedule.map((result)=>{
                            return{
                                title : `${result.task} - ${result.app}`,
                                start : `${result.fromDate}T${result.fromTime}`,
                                end : `${result.toDate}T${result.toTime}`,
                                color : result.color
                            }
                        })  
                    }
                />
                </section>

                <section id="dataTables" className="contentSection">
                    {/* Table */}
                    <table 
                        id="scheduleTable"
                        responsive 
                        striped 
                        style={{ width : "100%"}}>
                    <thead>
                        <tr>
                            <th className="header">No.</th>
                            <th className="header">Application</th>
                            <th className="header">Task</th>
                            <th className="header">From Date</th>
                            <th className="header">To Date</th>
                            <th className="header">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((result)=>{
                            return(
                                <tr>
                                    <td className="data">{number++}</td>
                                    <td>{result.app}</td>
                                    <td>{result.task}</td>
                                    <td className="data">
                                        {/* {result.fromDate} */}
                                    {`${result.fromDate}T${result.fromTime}`}
                                    </td>
                                    <td className="data">
                                        {/* {result.toDate} */}
                                        {`${result.toDate}T${result.toTime}`}
                                    </td>
                                    <td>
                                        <div className="actionBtn">
                                        <button type="button" className="btn btn-warning action" data-bs-toggle="modal" data-bs-target="#updateTaskModal" onClick={()=> this.getScheduleById(result.id)}>Update</button>
                                        <button type="button" className="btn btn-danger action" data-bs-toggle="modal" data-bs-target="#deleteTaskModal" onClick={()=> this.getScheduleById(result.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    </table>
                </section>
                {/* </table> */}

                
            </div>
        );
    }
}

export default EventCalender;