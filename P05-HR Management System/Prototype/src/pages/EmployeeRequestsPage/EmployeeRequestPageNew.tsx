import axios from "axios";
import React, { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Alert, Button, Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";

import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  // GridSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { AnyAaaaRecord } from "dns";

// import AddEmployee from "./AddEmployee";

export default function EmployeeRequestsPage() {
  const [list, setList] = useState<any[]>([]);
  const [SnackbarOpen, setSnackbarOpen] = useState(false);
  const [loader, setloader] = useState(true);
  const [firstRender, setfirstRender] = useState(true);
  const [modalOpen] = useState(false);

  //const [selectedIndex, setSelectedIndex] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<any>();

  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [
      {
        columnField: "rating",
        operatorValue: ">",
        value: "2.5",
      },
    ],
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "Employee ID", width: 130 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "title", headerName: "Title", width: 250 },
    { field: "status", headerName: "Status", width: 300 },
    { field: "data", headerName: "Request", width: 700 },
    { field: "dateAdded", headerName: "Date Added", width: 150 },

    // {
    //   field: "age",
    //   headerName: "Age",
    //   type: "number",
    //   width: 90,
    // },
    // {
    //   field: "fullName",
    //   headerName: "Full name",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: true,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    // },
  ];

  // const is_empty = (option: string, description: string, id: string) => {
  //   if (title == "" || aData == "" || id =="") {
  //     if (title == "")
  //     {
  //         alert("title is empty")
  //     }
  //     if (aData == "")
  //     {
  //         alert("title is empty")
  //     }
  //     if (id = "")
  //     {
  //         alert("id is empty")
  //     }
  //     return 1;
  //   }
  //   return 0;
  // };

  const handleGetRequests = async () => {
    let x: any = [];
    try {
      const response = await axios.get(
        "http://localhost:5001/getEmployeeRequests"
      );

      const li = response.data.Items;
      x = li;
      setList(x);
      console.log("Employee REQ  IETMSSSSSSSS", li);
      setfirstRender(false);
      setloader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveRequest = async () => {
      await axios({
        method: "post",
        url: "http://localhost:5001/approveRequests",
        data: {
          id: selectedIndex[0],
        },
      });
  };

  const handleDenyRequest = async () => {
      await axios({
        method: "post",
        url: "http://localhost:5001/denyRequests",
        data: {
          id: selectedIndex[0],
        },
      });
  };

  useEffect(() => {
    handleGetRequests().then(() => {
      if (firstRender === false && modalOpen === false) {
        setSnackbarOpen(true);
      }
    });
    // handleClick();
  }, [modalOpen, firstRender]);

  useEffect(() => {
    console.log("SELECTED INDEX:", selectedIndex);
  },selectedIndex);
//[selectedIndex]
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      setSnackbarOpen(false);
      return;
    }
    setSnackbarOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  function CustomGridToolbar() {
    return (
      <GridToolbarContainer
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          <GridToolbarColumnsButton style={{ margin: 10 }} />
          <GridToolbarFilterButton style={{ margin: 10 }} />
          <GridToolbarDensitySelector style={{ margin: 10 }} />
          <GridToolbarExport style={{ margin: 10 }} />
        </div>
        <div>
          {/* <AddEmployee setOpen={setModalOpen} open={modalOpen} /> */}
        </div>
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        components={{
          LoadingOverlay: LinearProgress,
          Toolbar: CustomGridToolbar,
        }}
        loading={loader}
        // loading
        rows={list}
        columns={columns}
        autoHeight
        // autoPageSize
        // pageSize={5}

        rowsPerPageOptions={[10]}
        checkboxSelection
        onSelectionModelChange={(id) => {
          setSelectedIndex(id);
        }}
        filterModel={filterModel}
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={SnackbarOpen}
        autoHideDuration={4000}
        onClose={handleClose}
        message="Note archived"
        action={action}
      >
        <Alert onClose={handleClose} severity="success">
          Requests Updated
        </Alert>
      </Snackbar>

      <Button onClick={handleApproveRequest}>Approve Selected Request</Button>

      <Button onClick={handleDenyRequest}>Deny Selected Request</Button>
    </div>
  );
}
