import React, {Component} from "react";
// import "datatables.net-dt/js/dataTables.dataTables";
// import "datatables.net-dt/css/jquery.dataTables.min.css";
// import "datatables.net-responsive-dt/js/responsive.dataTables.js";
// import "datatables.net-responsive-dt/css/responsive.dataTables.css";
// import "jquery/dist/jquery.min.js";

class TableSchedule extends Component{
    render(){
        return(
            <div>
                <section>
                    {/* <!-- NAVBAR --> */}
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a id="fullCalender" className="nav-link " aria-current="page" href="#">Calender</a>
                    </li>
                    <li className="nav-item">
                        <a id="report" className="nav-link active" aria-current="page" href="#">Report</a>
                    </li>
                    
                </ul>
                </section>
                <section>
                <table
                    reponsive
                    striped
                    id="table-schedule"
                    style={{width : "100%", margin : "20px"}}>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Application</th>
                            <th>Task</th>
                            <th>From Date</th>
                            <th>To Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1.</td>
                            <td>CRM Halo</td>
                            <td>Melakukan Implementasi</td>
                            <td>02-02-2021</td>
                            <td>03-02-2021</td>                            
                        </tr>
                    </tbody>
                </table>
                </section>
            </div>
        );
    }
}

export default TableSchedule;