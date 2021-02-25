import React, {Component} from "react";
// import {Table} from "react-bootstrap";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Axios from "axios";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-responsive-dt/js/responsive.dataTables.js";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.print';
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import Swal from "sweetalert2";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import MaterialTable, { MTableToolbar } from "material-table";
// import MUIDataTable from "mui-datatables";

class EventCalender extends Component{
    constructor(props){
        super(props)

        this.state = {
            fields : {},
            schedule : [],
            number : 1,
            fileName : 'SQi Schedule'
        }

    }

    componentDidMount(event) {
        this.getSchedule();
        
    }

    getSchedule() {
        Axios.get('/sqi-schedule/get-schedule')
        .then((response) => {
            const dataSchedule = response.data;
            this.setState({
                schedule : dataSchedule
            });
            // DATATABLE 
            $(function() {
                // Setup - add a text input to each footer cell
                $('.filter').each( function (i) {
                    var title = $('#example thead th').eq( $(this).index() ).text();
                    if(title==="application"){
                        $(this).html( '<button type="text" placeholder="Search '+title+'" data-index="'+i+'" />' );
                    } else {
                        $(this).html( '<input type="text" placeholder="Search '+title+'" data-index="'+i+'" />' );
                    }
                    
                } );
            
                // DataTable
                var table = $('#example').DataTable( {
                    scrollY:        "300px",
                    scrollX:        true,
                    scrollCollapse: true,
                    paging:         true,
                    fixedColumns:   true,
                    responsive:     true,
                    dom: 'Bfrtip',
                    buttons: [
                                'copy', 'csv', 'excel', 'pdf', 'print'
                            ]
                } );
            
                // Filter event handler
                $( table.table().container() ).on( 'keyup', '.filter input', function () {
                    table
                        .column( $(this).data('index') )
                        .search( this.value )
                        .draw();
                } );
            })


            
            // $(function() {
            //     $("#example").DataTable({
            //         responsive : true,
            //     })
            // })
        });
        
    }

    getScheduleById = (id) => {
        Axios.get('/sqi-schedule/get-scheduleById/' + id)
        .then((response)=>{
            console.log(response.data)
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
        Axios.delete('/sqi-schedule/delete-schedule/' + id)
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
            app : fields["app"][1],
            fromDate : fields["fromDate"],
            toDate : fields["toDate"],
            fromTime : fields["fromTime"],
            toTime :fields["toTime"],
            // color : fields["color"]
            color : fields["app"][0]
        }
        console.log(schedule);

        Axios.post('/sqi-schedule/add-schedule', schedule)
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
            app : this.state.app[1],
            fromDate : this.state.fromDate,
            fromTime : this.state.toTime,
            toDate : this.state.toDate,
            toTime : this.state.toTime,
            color : this.state.app[0]
        }
        console.log(schedule);   

        Axios.put('/sqi-schedule/update-schedule/' + id, schedule)
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

    handleUpdateApp = (e) => {
        console.log(e);
        this.setState({
            [e.target.name] : e.target.value.split(",")
        })
    }

    handleChange(field, e){
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    handleChangeApp(field, e) {
        let fields = this.state.fields;
        fields[field] = e.target.value.split(",");
        const color = fields[field][0];
        const app = fields[field][1];
        this.setState({ fields });
    }
    
    // exportTableToExcel(tableID, filename = ''){
    //     var downloadLink;
    //     var dataType = 'application/vnd.ms-excel';
    //     var tableSelect = document.getElementById("example1");
    //     var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        
    //     // Specify file name
    //     filename = filename?filename+'.xls':'excel_data.xls';
        
    //     // Create download link element
    //     downloadLink = document.createElement("a");
        
    //     document.body.appendChild(downloadLink);
        
    //     if(navigator.msSaveOrOpenBlob){
    //         var blob = new Blob(['\ufeff', tableHTML], {
    //             type: dataType
    //         });
    //         navigator.msSaveOrOpenBlob( blob, filename);
    //     }else{
    //         // Create a link to the file
    //         downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        
    //         // Setting the file name
    //         downloadLink.download = filename;
            
    //         //triggering the function
    //         downloadLink.click();
    //     }
    // }

    // jQuery DataTable
    filterTable() {
        // Setup - add a text input to each footer cell
        // $('#example tfoot th').each( function (i) {
        //     var title = $('#example thead th').eq( $(this).index() ).text();
        //     $(this).html( '<input type="text" placeholder="Search '+title+'" data-index="'+i+'" />' );
        // } );
      
        // // DataTable
        // var table = $('#example').DataTable( {
        //     scrollY:        "300px",
        //     scrollX:        true,
        //     scrollCollapse: true,
        //     paging:         true,
        //     fixedColumns:   true
        // } );
     
        // // Filter event handler
        // $( table.table().container() ).on( 'keyup', 'tfoot input', function () {
        //     table
        //         .column( $(this).data('index') )
        //         .search( this.value )
        //         .draw();
        // } );
    }


    render(){
        const { schedule } = this.state;
        let { number } = this.state;
        return(
            <div className = "content">
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
                    <div><span class="material-icons inputTask" style={{position : "relative"}}>assignment</span></div>
                    Add Task
                    </button>
                </section>                                          

                {/* Modal Add Task  */}
                <section className="contentSection">
                <div className="modal fade" id="addTaskModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span class="material-icons inputTask" style={{marginRight : "5px"}}>assignment</span>
                            <h5 className="modal-title" id="exampleModalLabel"> 
                                Add Your Task
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
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
                                                    onChange={this.handleChangeApp.bind(this, "app")}
                                                    value={this.state.fields["app"]}>                                                        
                                                        <option value="null">-- Choose Application --</option>
                                                        <option className="selectApp" id="crmHalo" value="#62A1F3,CRM Halo">CRM Halo</option>
                                                        <option className="selectApp" id="haloLite" value="#71E263,Halo Lite">Halo Lite</option>
                                                        <option className="selectApp" id="haloApps"value="#F2F171,Halo Apps">Halo Apps</option>
                                                        <option className="selectApp" id ="spekta"value="#F8C957,Specta">Specta</option>
                                                        <option className="selectApp" id="telephony" value="#E18FF0,Telephony">Telephony</option>
                                                        <option className="selectApp" id="sosmed" value="#FF66C5,SOSMED">SOSMED</option>
                                                        <option className="selectApp" id="chain" value="#CDBCCF,Chain">Chain</option>
                                                        <option className="selectApp" id="mqa" value="#D8854F,MQA">MQA</option>
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
                            <span class="material-icons inputTask" style={{marginRight : "5px"}}>assignment</span>
                            <h5 className="modal-title" id="exampleModalLabel">Edit Your Task</h5>
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
                                                    onChange={this.handleUpdateApp}
                                                    value={this.state.app}>
                                                        <option value="null">{this.state.app}</option>
                                                        <option className="selectApp" value="#62A1F3,CRM Halo">CRM Halo</option>
                                                        <option className="selectApp" value="#71E263,Halo Lite">Halo Lite</option>
                                                        <option className="selectApp" value="#F2F171,Halo Apps">Halo Apps</option>
                                                        <option className="selectApp" value="#F8C957,Specta">Specta</option>
                                                        <option className="selectApp" value="#E18FF0,Telephony">Telephony</option>
                                                        <option className="selectApp" value="#FF66C5,SOSMED">SOSMED</option>
                                                        <option className="selectApp" value="#CDBCCF,Chain">Chain</option>
                                                        <option className="selectApp" value="#D8854F,MQA">MQA</option>
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

            <section>
                <div className="col-lg-4">
                    <label for="calendar_view">Filter Applications</label>
                        <div className="input-group">
                            <select className="filter" id="calendar_filter" multiple={true}>
                                <option value="CRM Halo">CRM Halo</option>
                                <option value="Halo Lite">Halo Lite</option>
                                <option value="Halo Apps">Halo Apps</option>
                                <option value="Specta">Specta</option>
                                <option value="Telephony">Telephony</option>
                                <option value="SOSMED">SOSMED</option>
                                <option value="Chain">Chain</option>
                                <option value="MQA">MQA</option>
                            </select>
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

                {/*BUTTON EXPORT TO EXCEL  */}
                {/* <section id="buttonExport">
                    <ReactHTMLTableToExcel
                        className="btn btn-primary"
                        table="example"
                        filename="SQiReport"
                        sheet="Sheet"
                        buttonText="Export To Excel File"/>
                </section>*/}               
               
                <section id="dataTables" className="contentSection">
                    <table 
                        id="example"
                        className="row-border hover stripe display nowrap"
                        responsive 
                        striped 
                        style={{ width : "100%", border : "3px solid #FAF8F7"}}>
                    <thead>
                        <tr id="filtering">
                            <th className="filter">No.</th>
                            <th className="filter">Application</th>
                            <th className="filter">Task</th>
                            <th className="filter">From Date</th>
                            <th className="filter">To Date</th>
                            <th className="filter">Action</th>
                        </tr>
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
                                        {`${result.fromDate}`}
                                    </td>
                                    <td className="data">
                                        {`${result.toDate}`}
                                    </td>
                                    <td>
                                        <div className="actionBtn">
                                        <button type="button" className="btn btn-warning action" data-bs-toggle="modal" data-bs-target="#updateTaskModal" onClick={()=> this.getScheduleById(result.id)}><span class="material-icons">edit</span></button>
                                        <button type="button" className="btn btn-danger action" data-bs-toggle="modal" data-bs-target="#deleteTaskModal" onClick={()=> this.getScheduleById(result.id)}><span class="material-icons">delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    {/* <tfoot>
                        <tr>
                            <th>No.</th>
                            <th>Application</th>
                            <th>Task</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th style={{display : "none"}}>Action</th>
                        </tr>
                    </tfoot> */}

                    </table>
                </section>


                {/* MATERIAL TABLE */}
                {/* <section style={{margin : "30px"}}>
                    <MaterialTable
                    id = "scheduleTable"
                    title ="Task Scheduling Review"
                    columns =
                    {[
                        { title : 'No.' , field : "no", filtering : false},
                        { title : 'Application',
                            field : "app",
                            lookup : {
                                "CRM Halo" : 'CRM Halo',
                                "Halo Lite" : 'Halo Lite',
                                "Halo Apps" : 'Halo Apps',
                                "Specta" : 'Specta',
                                "Telephony" : 'Telephony',
                                "SOSMED" : 'SOSMED',
                                "Chain" : 'Chain',
                                "MQA" : 'MQA'}},
                        { title : 'Task', field : "task"},
                        { title : "From Date", field : "fromDate"},
                        { title : "To Date", field : "toDate"}
                    ]}
                    data = {
                        schedule.map((result)=>{
                            return{
                                no : number++,
                                id : result.id,
                                app : result.app,
                                task : result.task,
                                fromDate : `${result.fromDate}`,
                                toDate : `${result.toDate}`,
                            }
                        })
                        }
                    options = 
                    {{ 
                        filtering : true,
                        actionsColumnIndex: -1,
                        exportButton : true,
                        rowStyle: {
                            backgroundColor: '#EEE',
                          } 
                    }}
                    actions = 
                    {[
                        {
                            icon: 'edit',
                            tooltip : 'Edit Task',
                            onClick : (event, rowData) => {
                                console.log(rowData.id);
                                this.getScheduleById(rowData.id);
                            }
                        },
                        {
                            icon: 'delete',
                            tooltip : 'Delete Task',
                            onClick : (event, rowData) => {
                                console.log(rowData.id);
                                this.getScheduleById(rowData.id);
                            }
                        }
                    ]}

                    components={{
                        Action: props => {
                            if(props.action.icon === "edit") {
                                return(
                                    <button type="button" className="btn btn-warning action" data-bs-toggle="modal" onClick={(event) => props.action.onClick(event, props.data)}data-bs-target="#updateTaskModal"><span class="material-icons">edit</span></button>
                                )
                            }
                            if(props.action.icon === "delete") {
                                return(
                                    <button type="button" className="btn btn-danger action" data-bs-toggle="modal" onClick={(event) => props.action.onClick(event, props.data)}data-bs-target="#deleteTaskModal"><span class="material-icons">delete</span></button>
                                )
                            }                            
                        }                           
                      }}
                    />
                </section> */}

                {/* MUI DATATABLE */}
                {/* <MUIDataTable
                    title ={"Task Schedule Review"}
                    data = {
                            schedule.map((result)=>{
                                return{
                                    no : number++,
                                    id : result.id,
                                    app : result.app,
                                    task : result.task,
                                    fromDate : `${result.fromDate}`,
                                    toDate : `${result.toDate}`,
                                }
                            })
                            }
                    columns ={['No','Application','Task','From Date','To Date']}
                    options= {{filterType :'checkbox'}}
                    /> */}
                
            </div>
        );
    }
}

export default EventCalender;

{/* <section id="buttonExport">
                    <button className="btn btn-primary" onClick={()=> this.exportTableToExcel("example1")}>Export to Excel</button>
                </section>  */}