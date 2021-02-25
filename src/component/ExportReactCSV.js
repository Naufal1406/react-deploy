import React from 'react';
import { CSVLink } from 'react-csv'

const ExportReactCSV = ({ csvData, fileName}) => {
    return(
        <button
            className="btn btn-primary"
            data={csvData}
            filename={fileName}>
                Export
        </button>
    )
}

export default CSVLink;