import React, {useState, useEffect} from “react”;
import { DataGrid } from ‘@material-ui/data-grid’;
import axois from 'axios'
export default function App() {
const [rowData,setRowData] = useState([]);

useEffect(() => {
// const axios = require(‘axios’).default;
axios.get('http://localhost:8080/user/all')
.then((response) => {
setIsLoaded(true);
console.log(response.data);
setRowData(response.data);

});
}, []);


const columns = [
{ field: “id”, headerName: “ID”, width: 10 },
{ field: “userName”, headerName: “Name”, width: 170 },
{ field: “userTelNo”, headerName: “Tel No”, width: 70 },
{ field: “userEmail”, headerName: “EMail”, width: 100 },
{ field: “userRole”, headerName: “Role”, width: 100 },
];

return(
<div style={{ height: 400, width: ‘100%’ }}>
<div style={{ display: ‘flex’, height: ‘100%’ }}>
<div style={{ flexGrow: 1 }}>
<DataGrid
columns={columns}
rows={rowData}
id=”id”
pageSize={15}
/>
</div>
</div>
</div>
);
}
