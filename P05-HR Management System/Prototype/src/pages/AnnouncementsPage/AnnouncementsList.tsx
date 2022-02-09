import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  GridFilterModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 130 },
  { field: "dateposted", headerName: "Date Posted", width: 130 },
  { field: "postedby", headerName: "Posted by", width: 130 },
  //   { field: "lastName", headerName: "Last name", width: 130 },
  //   {
  //     field: "age",
  //     headerName: "Age",
  //     type: "number",
  //     width: 90,
  //   },
  //   {
  //     field: "fullName",
  //     headerName: "Full name",
  //     description: "This column has a value getter and is not sortable.",
  //     sortable: true,
  //     width: 160,
  //     valueGetter: (params: GridValueGetterParams) =>
  //       `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  //   },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

export default function AnnouncementsList() {
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [
      {
        columnField: "rating",
        operatorValue: ">",
        value: "2.5",
      },
    ],
  });

  const [announcementList, setannouncementList] = useState([
    {
      title: "",
    },
  ]);
  const [list, setList] = useState<any[]>([]);

  const getreq = async () => {
    let x: any = [];
    try {
      const response = await axios.get(
        "http://localhost:5000/getAnnouncements"
      );
      const li = response.data.Items;
      x = li[0];
      // console.log(li[0].title);
    } catch (error) {
      console.error(error);
    }
    let a = [];
    try {
      for (let i = 0; i < x.title.length; i++) {
        a.push({
          title: x.title[i],
        });
        setList([...list, a]);
      }
    } catch (err) {}
  };

  useEffect(() => {
    getreq();
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        components={{
          Toolbar: GridToolbar,
        }}
        checkboxSelection
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
      />
    </div>
  );
}
